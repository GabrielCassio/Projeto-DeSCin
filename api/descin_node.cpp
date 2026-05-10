#include "descin_node.hpp"

#include <string>

// Importing utils
#include "../backend/blockchain-core/src/utils/date.hpp"

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

bool DescinNode::process_investment(const std::string& sender, const std::string& project_id, unsigned long amount, const std::string& signature) {
    // Lockzinho
    std::lock_guard<std::mutex> lock(node_mutex);

    try {

        // Verify id project
        if (!project_repo.is_project_active(project_id)) {
            return false;
        }

        // Creating transaction
        Transaction tx(sender, project_id, amount, date(), signature);

        if (!mempool.add_transaction(tx)) {
            return false;
        }

        // Memool
        auto pending = mempool.get_pending_transactions();
            auto new_block = blockchain.create_block(pending);

            auto mined_block = blockchain.mining_block(new_block);

            // Send block to the chain/network
            if (blockchain.send_block(mined_block)) {
                mempool.clear_pending_transactions(pending.size());

                InvestimentBody inv = {project_id, sender, "", amount, amount, date(), "active"};
                project_repo.update_funding(sender, inv);

                tx_log.append(tx); // Log da transação para transparência 

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