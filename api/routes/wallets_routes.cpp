#include "wallets_routes.hpp"
#include <crow.h>

void WalletsRoutes::setup_routes() {
    CROW_ROUTE(app, "/wallets")
        .methods("GET"_method)
        .handler([&controller](const crow::request& req, const crow::response& res){
            try {
                res.code = 200;
                res.body = "Successful!";
                return res;
            }
            catch(const std::exception& e){
                res.code = 500;
                res.body = e.what();
                return res;
            }
        });

    CROW_ROUTE(app, "/wallets")
        .methods("POST"_method)
        .handler([&controller](const crow::request& req, const crow::response& res){
            try {
                res.code = 200;
                res.body = "Successful!";
                return res;
            }
            catch(const std::exception& e){
                res.code = 500;
                res.body = e.what();
                return res;
            }
        });
}