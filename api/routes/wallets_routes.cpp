#include "wallets_routes.hpp"
#include <crow.h>

void WalletsRoutes::setup_routes() {
    CROW_ROUTE(app, "/wallets").methods("GET"_method)
    ([](const crow::request& req){
        try {
            return crow::response(200, "ok");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });

    CROW_ROUTE(app, "/wallets").methods("POST"_method)
    ([](const crow::request& req){
        try {
            return crow::response(200, "ok");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });
}