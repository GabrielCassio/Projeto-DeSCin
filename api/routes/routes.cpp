#include "routes.hpp"

Routes::Routes(crow::SimpleApp& app, DescinNode& node)
    : app(app), node(node)
{
    setup_routes();
}

void Routes::setup_routes() {
    CROW_ROUTE(app, "/api/health")
    ([] {
        return crow::response(200, "{\"status\":\"ok\"}");
    });
}