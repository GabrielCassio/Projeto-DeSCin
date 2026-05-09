#ifndef USER_CONTROLLER_HPP
#define USER_CONTROLLER_HPP

#include <crow.h>
#include "controller.hpp"

class UserController : public Controller {
public:
    // Default constructor and destructor
    UserController() = default;
    ~UserController() = default;

    // Methods
    crow::response get_by_id (crow::request& req, const std::string& id) const override;
    crow::response get_many (crow::request& req, const std::string& ids) const override;
    crow::response get_all (crow::request& req) const override;
    crow::response post (crow::request& req) override;
    crow::response put (crow::request& req, const std::string& id) override;
    crow::response del (crow::request& req, const std::string& id) override;
};

#endif // USER_CONTROLLER_HPP