#include "key_vault.hpp"      // a declaração desta classe
#include "database.hpp"       // derive_key, encrypt, decrypt, append_block, read_all_blocks

#include <openssl/rand.h>     // pra gerar salt e IV aleatórios (RAND_bytes)
#include <fstream>            // pra checar se arquivo existe antes de tentar abrir
#include <filesystem>         // pra criar o diretório data/keys se não existir



// =====================================================================
//  Constructor
// =====================================================================
//
// Garante que o diretório base exista. Se já existir, não faz nada.
// Se falhar (permissão, disco cheio), continuamos silenciosamente —

// a primeira tentativa de gravar vai retornar nullopt naturalmente.
KeyVault::KeyVault(const std::string& base_dir)
    : _base_dir(base_dir)
{
    std::error_code ec;
    std::filesystem::create_directories(_base_dir, ec);
    // Ignoramos 'ec' propositalmente — falhas viram nullopt nas operações.
}
// =====================================================================
//  store_private_key
// =====================================================================
//
// Cifra a chave privada com AES-256-CBC usando uma chave derivada da
// senha do usuário (PBKDF2 + salt aleatório). Grava num arquivo .dat
// nomeado pelo wallet_address.
//
// Estratégia: um arquivo por usuário, contendo UM único bloco cifrado.
// Sobrescreve qualquer arquivo anterior (idempotente).
std::optional<std::string> KeyVault::store_private_key(const std::string& wallet_address, const std::string& private_key_pem, const std::string& password) {
    // Senha vazia é rejeitada — não cifrar com "nada".
    if (password.empty()) return std::nullopt;

    // Gera salt e IV aleatórios (nunca se repetem entre cifragens).
    unsigned char salt[descin::db::SALT_SIZE];
    unsigned char iv[descin::db::IV_SIZE];
    if (RAND_bytes(salt, descin::db::SALT_SIZE) != 1 ||
        RAND_bytes(iv,   descin::db::IV_SIZE)   != 1) {
        return std::nullopt;
    }

    // Deriva a chave AES-256 a partir da senha + salt (PBKDF2).
    unsigned char aes_key[descin::db::KEY_SIZE];
    descin::db::derive_key(password, salt, aes_key);

    // Cifra a chave PEM.
    std::vector<unsigned char> ciphered =
        descin::db::encrypt(private_key_pem, aes_key, iv);

    // Monta o caminho: <base_dir>/<wallet_address>.dat
    std::filesystem::path file_path =
        std::filesystem::path(_base_dir) / (wallet_address + ".dat");

    // Sobrescreve qualquer arquivo anterior (um arquivo = uma chave).
    std::error_code ec;
    std::filesystem::remove(file_path, ec);

    // Grava o bloco cifrado.
    bool ok = descin::db::append_block(file_path.string(), wallet_address, salt, iv, ciphered);
    if (!ok) return std::nullopt;

    return file_path.string();
}

// Tenta carregar e decifrar a chave privada do usuário.

std::optional<std::string> KeyVault::load_private_key(const std::string& wallet_address, const std::string& password) {
    // Senha vazia: rejeita imediatamente.
    if (password.empty()) return std::nullopt;

    // Monta o caminho do arquivo.
    std::filesystem::path file_path =
        std::filesystem::path(_base_dir) / (wallet_address + ".dat");

    // Arquivo não existe → falha (não distinguimos de senha errada).
    if (!std::filesystem::exists(file_path)) return std::nullopt;

    // Lê os blocos do arquivo. Esperamos exatamente 1.
    auto blocks = descin::db::read_all_blocks(file_path.string());
    if (blocks.empty()) return std::nullopt;
    const auto& block = blocks[0];

    // Re-deriva a chave AES com a mesma senha + salt original.
    unsigned char aes_key[descin::db::KEY_SIZE];
    descin::db::derive_key(password, block.salt.data(), aes_key);

    // Tenta decifrar. Vetor vazio = senha errada ou dados corrompidos.
    auto decrypted = descin::db::decrypt(block.data, aes_key, block.iv.data());
    if (decrypted.empty()) return std::nullopt;

    // Converte os bytes em string PEM e retorna.
    return std::string(decrypted.begin(), decrypted.end());
}