#ifndef USER_CONTROLLER_HPP
#define USER_CONTROLLER_HPP
#include <crow.h>
#include <string>
#include "controller.hpp"
#include "../services/user_service.hpp"
class UserController : public Controller<UserService> {
public:
    UserController(UserService& service) : Controller<UserService>(service) {}
    ~UserController() = default;
    crow::response get_by_id(const crow::request& req, const std::string& id) const override;
    crow::response get_many(const crow::request& req) const override;
    crow::response get_all(const crow::request& req) const override;
    crow::response post(const crow::request& req) override;
    crow::response put(const crow::request& req, const std::string& id) override;
    crow::response del(const crow::request& req, const std::string& id) override;
    crow::response deposit(const crow::request& req, const std::string& id);
    crow::response get_positions(const crow::request& req, const std::string& id);
};
#endif // USER_CONTROLLER_HPP
