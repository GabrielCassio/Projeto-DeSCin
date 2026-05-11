#include "descin_node.hpp"

#include <string>

// Importing utils
#include "../backend/blockchain-core/src/utils/date.hpp"
#include "../backend/blockchain-core/src/utils/encryptation/sign_message.hpp"

// Implementação do construtor do DescinNode
DescinNode::DescinNode(int diff)
    : blockchain(diff)
    , project_repo()
    , mempool()
    , users()
    , key_vault()
    , tx_log()
{
}

bool DescinNode::process_investment(const std::string& sender_wallet,
                                    const std::string& project_id,
                                    unsigned long amount,
                                    const std::string& password) {
    std::lock_guard<std::mutex> lock(node_mutex);

    try {
        // 1. Verifica se o projeto está aberto a investimento.
        if (!project_repo.is_project_active(project_id)) {
            return false;
        }

        // 2. Busca a identidade do investidor.
        const UserBody* user = users.get_user_by_wallet(sender_wallet);
        if (!user) {
            return false;  // wallet não cadastrada
        }

        // 3. Decifra a chave privada com a senha.
        auto private_key = key_vault.load_private_key(sender_wallet, password);
        if (!private_key) {
            return false;  // senha errada
        }

        // 4. Monta a mensagem (mesmo formato que Wallet::format_data usa).
        // Aqui sender = chave pública PEM (não o wallet_address curto)
        // porque a is_transaction_valid espera reconstruir a chave pública
        // a partir do campo sender_key da transação.
        long long ts = date();
        std::string sender_pem = user->public_key_pem;
        std::string message = sender_pem + project_id + std::to_string(amount) + std::to_string(ts);

        // 5. Assina a mensagem com a chave privada decifrada.
        std::string signature = sign_message(*private_key, message);

        // 6. Cria a transação com a chave pública PEM como sender.
        Transaction tx(sender_pem, project_id, amount, ts, signature);

        // 7. Submete à mempool (que valida a assinatura internamente).
        if (!mempool.add_transaction(tx)) {
            return false;
        }

        // 8. Minera o bloco e adiciona à chain.
        auto pending = mempool.get_pending_transactions();
        auto new_block = blockchain.create_block(pending);
        auto mined_block = blockchain.mining_block(new_block);

        if (blockchain.send_block(mined_block)) {
            mempool.clear_pending_transactions(pending.size());

            // 9. Atualiza o estado do projeto.
            InvestimentBody inv = {
                project_id,
                sender_wallet,    // aqui guardamos o wallet_address (não a PEM)
                "",
                amount,
                amount,
                ts,
                "active"
            };
            project_repo.update_funding(sender_wallet, inv);

            // 10. Log de transparência.
            tx_log.append(tx);

            return true;
        }
    } catch (const std::exception& e) {
        std::cout << "Error: " << e.what() << std::endl;
        return false;
    }
    return false;
}

std::optional<std::string> DescinNode::register_user(const std::string& display_name, const std::string& email, const std::string& password) {
    // Validações básicas — falhamos rápido antes de gerar chave (custo alto).
    if (email.empty() || password.empty() || display_name.empty()) {
        return std::nullopt;
    }

    std::lock_guard<std::mutex> lock(node_mutex);

    // Checa email duplicado ANTES de gastar CPU gerando par RSA (~100ms).
    if (users.email_exists(email)) {
        return std::nullopt;
    }

    // Gera par RSA 2048-bit (operação cara — ~100ms).
    KeyPair kp = generate_key_pair();

    // Deriva o wallet_address curto da chave pública.
    std::string wallet_address = UserState::derive_wallet_address(kp.public_key);

    // Cifra e grava a chave privada em disco.
    auto stored_path = key_vault.store_private_key(wallet_address, kp.private_key, password);
    if (!stored_path) {
        return std::nullopt;  // falha de I/O ou criptografia
    }

    // Registra identidade pública no UserState.
    auto registered = users.add_user(display_name, email, kp.public_key, *stored_path, date());
    if (!registered) {
        return std::nullopt;  // improvável (já checamos email), mas defensivo
    }

    return *registered;  // wallet_address gerado
}

std::optional<std::string> DescinNode::login_user(const std::string& email,
                                                  const std::string& password) {
    // Validações básicas.
    if (email.empty() || password.empty()) {
        return std::nullopt;
    }

    std::lock_guard<std::mutex> lock(node_mutex);

    // Busca usuário pelo email.
    const UserBody* user = users.get_user_by_email(email);
    if (!user) {
        return std::nullopt;  // email não existe
    }

    // Tenta decifrar a chave privada. Se conseguiu, a senha está correta.
    auto decrypted = key_vault.load_private_key(user->wallet_address, password);
    if (!decrypted) {
        return std::nullopt;  // senha errada (ou arquivo corrompido)
    }

    // 'decrypted' (a chave em claro) sai de escopo aqui e é destruída.
    // Não a guardamos em lugar nenhum — segurança.
    return user->wallet_address;
}