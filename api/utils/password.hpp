#ifndef PASSWORD_HPP
#define PASSWORD_HPP

#include <string>

namespace password {
    std::string hash(const std::string& plaintext);
    bool verify(const std::string& plaintext, const std::string& stored_hash);
}

#endif // PASSWORD_HPP
