
#include "user_state.hpp" // Importando o header da classe userState

#include "../blockchain-core/src/utils/hashing/hash.hpp" // para usar a função de hashing SHA-256

std::string UserState::derive_wallet_address(const std::string& public_key_pem) {
    // Gerar o hash SHA-256 da chave pública PEM
    std::string full_hash = hash(public_key_pem);
    
    // Prefixar com "wallet_"
    return "wallet_" + full_hash.substr(0, 16);
}

// =====================================================================
//  add_user
// =====================================================================
//
// Registra um novo usuário no repositório.
// Falha (retorna nullopt) se o email já estiver em uso.
//
// Note: NÃO recebe senha. A senha é responsabilidade do KeyVault,
// que cifra a chave privada em arquivo separado ANTES desta função
// ser chamada. Aqui só registramos a identidade pública.
std::optional<std::string> UserState::add_user(const std::string& display_name,
                                               const std::string& email,
                                               const std::string& public_key_pem,
                                               const std::string& private_key_path,
                                               long long created_at) {
    // Trancar o mutex (RAII: destranca sozinho ao sair da função).
    std::lock_guard<std::mutex> lock(_mtx);

    // Checa duplicidade de email no índice secundário.
    if (_email_index.find(email) != _email_index.end()) {
        return std::nullopt;
    }

    // Deriva o wallet_address da chave pública.
    std::string wallet_address = derive_wallet_address(public_key_pem);

    // Monta o UserBody com todos os campos.
    UserBody user;
    user.wallet_address   = wallet_address;
    user.display_name     = display_name;
    user.email            = email;
    user.public_key_pem   = public_key_pem;
    user.private_key_path = private_key_path;
    user.created_at       = created_at;

    // Insere nos dois índices (primário e secundário).
    _users[wallet_address] = user;
    _email_index[email]    = wallet_address;

    return wallet_address;
}

//  get_user_by_wallet
// Busca pelo índice primário. Retorna nullptr se não existir.
// O ponteiro é válido enquanto o UserState não for destruído.
const UserBody* UserState::get_user_by_wallet(const std::string& wallet_address) const {
    std::lock_guard<std::mutex> lock(_mtx);

    auto it = _users.find(wallet_address);
    if (it == _users.end()) {
        return nullptr;
    }
    return &it->second;
}

//  get_user_by_email
// Busca pelo índice secundário (email). Faz dois lookups em O(1):
// email -> wallet_address -> UserBody.
const UserBody* UserState::get_user_by_email(const std::string& email) const {
    std::lock_guard<std::mutex> lock(_mtx);

    auto idx_it = _email_index.find(email);
    if (idx_it == _email_index.end()) {
        return nullptr;
    }

    // idx_it->second é o wallet_address. Agora vamos no map primário.
    auto user_it = _users.find(idx_it->second);
    if (user_it == _users.end()) {
        // Inconsistência: índice aponta pra wallet que não existe.
        // Não deveria acontecer, mas tratamos por segurança.
        return nullptr;
    }
    return &user_it->second;
}

//  email_exists
bool UserState::email_exists(const std::string& email) const {
    std::lock_guard<std::mutex> lock(_mtx);
    return _email_index.find(email) != _email_index.end();
}

//  count
size_t UserState::count() const {
    std::lock_guard<std::mutex> lock(_mtx);
    return _users.size();
}