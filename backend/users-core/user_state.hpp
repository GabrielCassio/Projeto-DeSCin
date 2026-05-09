#pragma once

// importando bibliotecas necessárias

#include <string>
#include <unordered_map> // para usar o unordered_map
#include <mutex> //  para garantir thread-safety nos acessos concorrentes
#include <optional> // para usar optional


/*
 * UserState — Repositório em memória dos usuários.
 *
 * "Você É sua wallet": identidade primária é wallet_address.
 * Email é apenas ponte de login. Senha NÃO fica aqui.
 */

struct UserBody {

    std::string wallet_address;
    std::string display_name;
    std::string email;
    std::string public_key_pem;
    std::string private_key_path;
    long long created_at;

};

class UserState {

    private:

        // mutex para garantir thread-safety nos acessos concorrentes
        // "mutable" permite que o mutex seja modificado mesmo em métodos const, garantindo a segurança em operações de leitura e escrita.

        mutable std::mutex _mtx; // mutex para garantir thread-safety

        // Ínidice primário: wallet_address -> dados do usuário (UserBody)
        // É a estrutura principal de armazenamento dos usuários, permitindo acesso rápido aos dados do usuário com base na wallet_address, que é a identidade primária.

        std::unordered_map<std::string, UserBody> _users; // mapeamento de wallet_address para UserBody


        // Índice secundário: email -> wallet_address
        // Permite mapear um email para a wallet_address correspondente
        // Mantendo sincronizado com _users em add_user()

        std::unordered_map<std::string, std::string> _email_index; // mapeamento de email para wallet_address
    
    public:

        UserState() = default;
        ~UserState() = default;

        // Gera o wallet_address curto a partir da chave pública PEM.
        // SHA-256 da chave, primeiros 8 bytes em hex (16 chars), prefixo "wallet_".
        static std::string derive_wallet_address(const std::string& public_key_pem);

        // Registra um novo usuário.
        // Retorna o wallet_address gerado, ou std::nullopt se o email já existe.
        std::optional<std::string> add_user(const std::string& display_name,
                                            const std::string& email,
                                            const std::string& public_key_pem,
                                            const std::string& private_key_path,
                                            long long created_at);

        // Busca pelo wallet_address. nullptr se não existir.
        const UserBody* get_user_by_wallet(const std::string& wallet_address) const;

        // Busca pelo email (usado no login). nullptr se não existir.
        const UserBody* get_user_by_email(const std::string& email) const;

        // Verifica se um email já está cadastrado.
        bool email_exists(const std::string& email) const;

        // Quantidade total de usuários.
        size_t count() const;


};