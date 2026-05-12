#include "auth_service.hpp"
#include "../exceptions/exceptions.hpp"
#include "../utils/password.hpp"

#include <algorithm>
#include <string>

LoginResult AuthService::login(const std::string& email,
                                const std::string& pwd,
                                const std::string& role) {
    auto user = user_service.get_by_email(email);
    if (!user || !password::verify(pwd, user->password))
        throw ValidationException("Email ou senha inválidos");

    bool has_role = std::find(user->role_choice.begin(),
                              user->role_choice.end(), role)
                    != user->role_choice.end();
    if (!has_role)
        throw ValidationException("Cargo inválido para este usuário");

    // Busca endereço da carteira vinculada ao usuário (opcional)
    std::string wallet_addr;
    try {
        pqxx::work txn(conn);
        auto r = txn.exec_params(
            "SELECT address FROM wallets WHERE user_id = $1 LIMIT 1",
            user->id);
        txn.commit();
        if (!r.empty()) wallet_addr = r[0][0].as<std::string>();
    } catch (...) {}

    std::string token = SessionStore::instance().create_session(
        std::to_string(user->id), wallet_addr);

    return LoginResult{token, user->id, user->username, user->email};
}

void AuthService::logout(const std::string& token) {
    SessionStore::instance().revoke(token);
}
