#include "projects_routes.hpp"
#include <crow.h>

/*
 * 
 */
void ProjectsRoutes::setup_routes(){
    CROW_ROUTE(app, "/projects").methods("GET"_method)
    ([](const crow::request& req){
        try{
            return crow::response(200, "ok");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });
    
    CROW_ROUTE(app, "/projects").methods("POST"_method)
    ([](const crow::request& req){
        try{
            return crow::response(200, "ok");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });
    CROW_ROUTE(app, "/projects").methods("PUT"_method)
    ([](const crow::request& req){
        try{
            return crow::response(200, "ok");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });
    CROW_ROUTE(app, "/projects").methods("DELETE"_method)
    ([](const crow::request& req){
        try{
            return crow::response(200, "ok");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });
}
