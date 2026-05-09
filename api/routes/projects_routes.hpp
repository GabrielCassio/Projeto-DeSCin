#ifndef PROJECTS_ROUTES_HPP
#define PROJECTS_ROUTES_HPP

// Include Base class
#include "routes.hpp"
// Include libraries
#include <crow.h>

/* 
 * Routes for projects in DeSCin
 */
class ProjectsRoutes : public Routes {
private:
        
public:
    ProjectsRoutes(crow::App<>& app, DescinNode& node) : Routes(app, node) {}
    void setup_routes() override;
};

#endif // PROJECTS_ROUTES_HPP