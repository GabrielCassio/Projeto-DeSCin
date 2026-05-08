#include "projects_routes.hpp"
#include <crow.h>

/*
 * 
 */
void ProjectsRoutes::setup_routes(crow::App& app) {
    CREATE_ROUTE(app, "/projects").methods("GET"_method)
    ([](){
        try{
            
        }
        catch(const std::exception& e){
            response = crow::response(500, e.what());
        }
    });
    
    CREATE_ROUTE(app, "/projects").methods("POST"_method)
    ([](){
        try{
            
        }
        catch(const std::exception& e){
            response = crow::response(500, e.what());
        }
    });
    CREATE_ROUTE(app, "/projects").methods("PUT"_method)
    ([](){
        try{
            
        }
        catch(const std::exception& e){
            response = crow::response(500, e.what());
        }
    });
    CREATE_ROUTE(app, "/projects").methods("DELETE"_method)
    ([](){
        try{
            
        }
        catch(const std::exception& e){
            response = crow::response(500, e.what());
        }
    });
}
