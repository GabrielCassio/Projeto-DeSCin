// Include API routes
#include "api/routes/projects_routes.hpp"
#include "api/routes/wallets_routes.hpp"
// Include libraries
#include <crow.h>

/*
 * Initialize the API
 */

 int main(){
    crow::App<> app;

    ProjectsRoutes projects_routes(app);
    projects_routes.setup_routes();

    WalletsRoutes wallets_routes(app);
    wallets_routes.setup_routes();

    app.bindaddr("0.0.0.0");
    
    // Run Server
    app.port(18080).multithreaded().run();
}