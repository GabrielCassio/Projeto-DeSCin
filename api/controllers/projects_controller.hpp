#ifndef PROJECTS_CONTROLLER_HPP
#define PROJECTS_CONTROLLER_HPP

#include "controller.hpp"

class ProjectsController : public Controller {
public:
    ProjectsController() = default;
    ~ProjectsController() = default;
    
    crow::response (const crow::request& req) override;
};

#endif // PROJECTS_CONTROLLER_HPP