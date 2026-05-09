#include "auth_routes.hpp"

void AuthRoutes::setup_routes(crow::App<>& app) {
    CROW_ROUTE(app, "/auth/google/url")
        .methods("GET"_method)
        .handler([&controller](const crow::Request&, crow::Response& res) {
            try{
                
            }
            catch (const std::exception& e) {
                res.code = 500;
                res.end(e.what());
            }
        });
}
