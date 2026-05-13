#include "user_routes.hpp"
#include <crow.h>
#include <string>

void UserRoutes::setup_routes() {
    CROW_ROUTE(app, "/users/")
        .methods("GET"_method)
        ([this](const crow::request& req) -> crow::response {
            try { return this->controller.get_all(req); }
            catch (const std::exception& e) { return crow::response(500, e.what()); }
        });

    CROW_ROUTE(app, "/users/<string>")
        .methods("GET"_method)
        ([this](const crow::request& req, const std::string& id) -> crow::response {
            try { return this->controller.get_by_id(req, id); }
            catch (const std::exception& e) { return crow::response(500, e.what()); }
        });

    CROW_ROUTE(app, "/users/")
        .methods("POST"_method)
        ([this](const crow::request& req) -> crow::response {
            try { return this->controller.post(req); }
            catch (const std::exception& e) { return crow::response(500, e.what()); }
        });

    CROW_ROUTE(app, "/users/<string>")
        .methods("PUT"_method)
        ([this](const crow::request& req, const std::string& id) -> crow::response {
            try { return this->controller.put(req, id); }
            catch (const std::exception& e) { return crow::response(500, e.what()); }
        });

    CROW_ROUTE(app, "/users/<string>")
        .methods("DELETE"_method)
        ([this](const crow::request& req, const std::string& id) -> crow::response {
            try { return this->controller.del(req, id); }
            catch (const std::exception& e) { return crow::response(500, e.what()); }
        });

    CROW_ROUTE(app, "/users/<string>/positions")
        .methods("GET"_method)
        ([this](const crow::request& req, const std::string& id) -> crow::response {
            try { return this->controller.get_positions(req, id); }
            catch (const std::exception& e) { return crow::response(500, e.what()); }
        });

    CROW_ROUTE(app, "/users/<string>/deposit")
        .methods("POST"_method)
        ([this](const crow::request& req, const std::string& id) -> crow::response {
            try { return this->controller.deposit(req, id); }
            catch (const std::exception& e) { return crow::response(500, e.what()); }
        });
}
