#pragma once

/*
 * KeyVault — Cofre de chaves privadas dos usuários.

 * Cada usuário tem UM arquivo .dat cifrado com sua senha, contendo
 * sua chave privada RSA em PEM. Arquivo nomeado pelo wallet_address.

 * Usa internamente o database.cpp (AES-256-CBC + PBKDF2) para
 * cifragem/decifragem.
 
 *  - Não armazenamos hash de senha em lugar nenhum
 *  - Validar senha = tentar decifrar; se decifrou, senha está correta
 *  - Senha NUNCA persiste; só vive em RAM durante a operação
 */

#include <string>
#include <optional>


class KeyVault {

private:
    // Caminho do diretório onde os arquivos .dat ficam guardados.
    // Vem do construtor (default: "data/keys").
    std::string _base_dir;

public:
    // Constructor com caminho configurável (default: data/keys).
    // explicit impede conversão implícita de string para KeyVault.
    explicit KeyVault(const std::string& base_dir = "data/keys");

    // Destructor padrão (sem lógica especial).
    ~KeyVault() = default;

    // Cifra a chave privada com a senha e grava em disco.
    // Retorna o caminho do arquivo gravado, ou nullopt em caso de falha.
    std::optional<std::string> store_private_key(const std::string& wallet_address,
                                                 const std::string& private_key_pem,
                                                 const std::string& password);

    // Tenta carregar e decifrar a chave privada.
    // Retorna a chave em PEM se a senha bater.
    // Retorna nullopt se: senha errada, arquivo não existe, ou dados corrompidos.
    // (Os três casos viram a mesma resposta por segurança — não vaza qual deu errado.)
    std::optional<std::string> load_private_key(const std::string& wallet_address,
                                                const std::string& password);
};