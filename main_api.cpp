// Include API routes
#include "api/routes/auth_routes.hpp"
#include "api/routes/projects_routes.hpp"
#include "api/routes/wallets_routes.hpp"

// Include Controllers
#include "api/controllers/auth_controller.hpp"
#include "api/controllers/projects_controller.hpp"
#include "api/controllers/wallets_controller.hpp"

// Include Services
#include "api/services/user_service.hpp"
#include "api/services/projects_service.hpp"
#include "api/services/wallets_service.hpp"

// Include libraries
#include <crow.h>

/*
 * Initialize the DeSCin API
 */

 int main(){
    // Initialize App
    crow::App<> app;
    
    // Initialize Services
    UserService user_service;
    ProjectsService projects_service;
    WalletsService wallets_service;
    
    // Initialize Controllers
    AuthController auth_controller(user_service);
    ProjectsController projects_controller(projects_service);
    WalletsController wallets_controller(wallets_service);
    
    // Initialize Routes
    AuthRoutes auth_routes(app, auth_controller);
    auth_routes.setup_routes();

    ProjectsRoutes projects_routes(app, projects_controller);
    projects_routes.setup_routes();

    WalletsRoutes wallets_routes(app, wallets_controller);
    wallets_routes.setup_routes();

    app.bindaddr("0.0.0.0");
    
    // Run Server
    app.port(18080).multithreaded().run();
}