#include "password.hpp"

#include <openssl/evp.h>
#include <openssl/rand.h>
#include <sstream>
#include <iomanip>
#include <vector>
#include <stdexcept>

namespace {
    constexpr int ITERATIONS = 10000;
    constexpr int KEY_LEN    = 32;
    constexpr int SALT_LEN   = 16;

    std::string to_hex(const std::vector<unsigned char>& data) {
        std::ostringstream oss;
        for (auto b : data)
            oss << std::hex << std::setw(2) << std::setfill('0') << static_cast<int>(b);
        return oss.str();
    }

    std::vector<unsigned char> from_hex(const std::string& hex) {
        std::vector<unsigned char> result;
        for (size_t i = 0; i + 1 < hex.size(); i += 2) {
            unsigned int byte;
            std::istringstream ss(hex.substr(i, 2));
            ss >> std::hex >> byte;
            result.push_back(static_cast<unsigned char>(byte));
        }
        return result;
    }

    std::vector<unsigned char> pbkdf2(const std::string& pwd,
                                       const std::vector<unsigned char>& salt) {
        std::vector<unsigned char> key(KEY_LEN);
        if (PKCS5_PBKDF2_HMAC(pwd.c_str(), static_cast<int>(pwd.size()),
                               salt.data(), static_cast<int>(salt.size()),
                               ITERATIONS, EVP_sha256(),
                               KEY_LEN, key.data()) != 1) {
            throw std::runtime_error("PBKDF2 falhou");
        }
        return key;
    }
}

namespace password {
    std::string hash(const std::string& plaintext) {
        std::vector<unsigned char> salt(SALT_LEN);
        RAND_bytes(salt.data(), SALT_LEN);
        auto key = pbkdf2(plaintext, salt);
        return to_hex(salt) + ":" + to_hex(key);
    }

    bool verify(const std::string& plaintext, const std::string& stored) {
        auto sep = stored.find(':');
        if (sep == std::string::npos) return false;
        auto salt     = from_hex(stored.substr(0, sep));
        auto expected = from_hex(stored.substr(sep + 1));
        auto actual   = pbkdf2(plaintext, salt);
        if (actual.size() != expected.size()) return false;
        unsigned char diff = 0;
        for (size_t i = 0; i < actual.size(); i++)
            diff |= actual[i] ^ expected[i];
        return diff == 0;
    }
}
