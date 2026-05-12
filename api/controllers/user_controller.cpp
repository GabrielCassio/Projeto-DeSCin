#include "user_controller.hpp"
#include "../exceptions/exceptions.hpp"

#include <crow.h>
#include <vector>

namespace {
    crow::json::wvalue user_to_json(const User& u) {
        crow::json::wvalue j;
        j["id"]         = u.id;
        j["username"]   = u.username;
        j["email"]      = u.email;
        j["bio"]        = u.bio;
        j["created_at"] = u.created_at;
        j["updated_at"] = u.updated_at;
        std::vector<crow::json::wvalue> roles;
        for (const auto& r : u.role_choice)
            roles.emplace_back(r);
        j["roles"] = std::move(roles);
        return j;
    }
}

crow::response UserController::get_by_id(const crow::request&, const std::string& id) const {
    try {
        auto user = service.get_by_id(id);
        return crow::response(200, user_to_json(*user));
    } catch (const NotFoundException& e) {
        return crow::response(404, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::get_all(const crow::request&) const {
    try {
        auto users = service.get_all();
        std::vector<crow::json::wvalue> arr;
        for (const auto& u : users)
            arr.push_back(user_to_json(u));
        crow::json::wvalue res;
        res["data"] = std::move(arr);
        return crow::response(200, res);
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::get_many(const crow::request& req) const {
    return get_all(req);
}

crow::response UserController::post(const crow::request& req) {
    try {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "JSON inválido");

        auto user = service.create(body);
        return crow::response(201, user_to_json(user));
    } catch (const ValidationException& e) {
        return crow::response(400, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::put(const crow::request& req, const std::string& id) {
    try {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "JSON inválido");

        auto user = service.update(body, id);
        return crow::response(200, user_to_json(user));
    } catch (const ValidationException& e) {
        return crow::response(400, e.what());
    } catch (const NotFoundException& e) {
        return crow::response(404, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::del(const crow::request&, const std::string& id) {
    try {
        service.destroy(id);
        return crow::response(204);
    } catch (const NotFoundException& e) {
        return crow::response(404, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}
