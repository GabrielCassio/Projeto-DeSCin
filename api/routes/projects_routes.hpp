#ifndef PROJECTS_ROUTES_HPP
#define PROJECTS_ROUTES_HPP

// Include Base class
#include 'routes.hpp'
// Include libraries
#include <crow.h>

/* 
 * Routes for projects in DeSCin
 */
class ProjectsRoutes : public Routes {
private:
        
public:
    void setup_routes(crow::App& app) override;
};

#endif // PROJECTS_ROUTES_HPP