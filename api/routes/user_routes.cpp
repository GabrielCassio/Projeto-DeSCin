#include "user_routes.hpp"
#include <crow.h>

void UserRoutes::setup_routes(crow::App& app) {
    CROW_ROUTE(app, "/users")
        .methods("GET"_method)([](const crow::request& req) {
            try {
                
                return crow::response(200, "");
            } catch (const std::exception& e) {
                return crow::response(500, e.what());
            }
        });
}
