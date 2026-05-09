#include "projects_routes.hpp"
#include <crow.h>

/*
 * Define routes for projects
 */
void ProjectsRoutes::setup_routes(crow::App<>& app){
    CROW_ROUTE(app, "/projects")
        .methods("GET"_method)
        .handler([&controller](const crow::request& req, const crow::response& res){
            try{
                res.code = 200;
                res.body = "Sucess";
                return res;
            }
            catch(const std::exception& e){
                res.code = 500;
                res.body = e.what();
                return res;
            }
    });
    
    CROW_ROUTE(app, "/projects")
        .methods("POST"_method)
        .handler([&controller](const crow::request& req, const crow::response& res){
            try{
                res.code = 200;
                res.body = "Sucessful!";
                return res;
            }
            catch(const std::exception& e){
                res.code = 500;
                res.body = e.what();
                return res;
            }
        });
    CROW_ROUTE(app, "/projects")
        .methods("PUT"_method)
        .handler([&controller](const crow::request& req, const crow::response& res){
            try{
                res.code = 200;
                res.body = "Successful!";
                return res;
            }
            catch(const std::exception& e){
                res.code = 500;
                res.body = e.what();
                return res;
            }
        });
    CROW_ROUTE(app, "/projects")
        .methods("DELETE"_method)
        .handler([&controller](const crow::request& req, const crow::response& res){
            try{
                res.code = 200;
                res.body = "Sucessful!";
                return res;
            }
            catch(const std::exception& e){
                res.code = 500;
                res.body = e.what();
                return res;
            }
    });
}
