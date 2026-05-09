// Include API routes
#include "api/routes/projects_routes.hpp"
#include "api/routes/wallets_routes.hpp"
#include "api/descin_node.hpp"
// Include libraries
#include <crow.h>

/*
 * Initialize the API
 */

int main(){
    crow::App<> app;
    DescinNode node;

    ProjectsRoutes projects_routes(app, node);
    projects_routes.setup_routes();

    WalletsRoutes wallets_routes(app, node);
    wallets_routes.setup_routes();

    app.bindaddr("0.0.0.0");
    app.port(18080).multithreaded().run();
}