#ifndef AUTH_SERVICE_HPP
#define AUTH_SERVICE_HPP

#include "user_service.hpp"
#include "../middleware/auth_middleware.hpp"

#include <pqxx/pqxx>
#include <string>

struct LoginResult {
    std::string token;
    int         user_id;
    std::string username;
    std::string email;
};

class AuthService {
private:
    UserService&       user_service;
    pqxx::connection&  conn;
public:
    AuthService(UserService& user_service, pqxx::connection& conn)
        : user_service(user_service), conn(conn) {}
    ~AuthService() = default;

    LoginResult login(const std::string& email,
                      const std::string& password,
                      const std::string& role);

    void logout(const std::string& token);
};

#endif // AUTH_SERVICE_HPP
