#include "auth_controller.hpp"
#include "../exceptions/exceptions.hpp"

#include <crow.h>

crow::response AuthController::login(const crow::request& req) {
    try {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "JSON inválido");

        if (!body.has("email") || !body.has("password"))
            return crow::response(400, "Campos obrigatórios: email, password");
        if (!body.has("role"))
            return crow::response(400, "Campo obrigatório: role");

        std::string email    = body["email"].s();
        std::string password = body["password"].s();
        std::string role     = body["role"].s();

        auto result = auth_service.login(email, password, role);

        crow::json::wvalue res;
        res["token"]    = result.token;
        res["user_id"]  = result.user_id;
        res["username"] = result.username;
        res["email"]    = result.email;
        return crow::response(200, res);

    } catch (const ValidationException& e) {
        return crow::response(401, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response AuthController::logout(const crow::request& req) {
    try {
        auto auth_header = req.get_header_value("Authorization");
        if (auth_header.size() < 8 || auth_header.substr(0, 7) != "Bearer ")
            return crow::response(400, "Token ausente");

        auth_service.logout(auth_header.substr(7));
        return crow::response(204);

    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response AuthController::login_google(const crow::request&) {
    return crow::response(501, "Não implementado");
}

crow::response AuthController::callback_google(const crow::request&) {
    return crow::response(501, "Não implementado");
}

crow::response AuthController::login_github(const crow::request&) {
    return crow::response(501, "Não implementado");
}

crow::response AuthController::callback_github(const crow::request&) {
    return crow::response(501, "Não implementado");
}
