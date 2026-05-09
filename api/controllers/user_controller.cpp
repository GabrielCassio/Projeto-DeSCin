#include "user_controller.hpp"
#include <crow.h>

crow::response UserController::get_by_id(crow::request& req, const std::string& id) const {
    try {
        return crow::response(200, "Usuário Encontrado!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::get_many(crow::request& req) const {
    try {
        return crow::response(200, "Usuários Encontrados!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::get_all(crow::request& req) const {
    try {
        return crow::response(200, "Todos os Usuários foram Encontrados!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::post(crow::request& req, const crow::json::body& body) {
    try {
        return crow::response(200, "Usuário Criado!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::put(crow::request& req, const std::string& id) {
    try {
        return crow::response(200, "Usuário Atualizado!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }   
}

crow::response UserController::del(crow::request& req, const std::string& id) {
    try {
        return crow::response(200, "Usuário Deletado!");
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}
