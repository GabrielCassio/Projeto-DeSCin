#ifndef AUTH_CONTROLLER_HPP
#define AUTH_CONTROLLER_HPP

#include "controller.hpp"

class AuthController : public Controller {
public:
    AuthController() = default;
    ~AuthController() = default;
    
    crow::response login(const crow::request& req) override;
    crow::response logout(const crow::request& req) override;
    
};

#endif // AUTH_CONTROLLER_HPP