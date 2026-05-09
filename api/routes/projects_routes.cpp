#include "projects_routes.hpp"
#include <crow.h>

//Include do Json, registro de informações
#include <nlohmann/json.hpp>  

/*
 * 
 */
void ProjectsRoutes::setup_routes(){

CROW_ROUTE(app, "/projects").methods("GET"_method)
([this](const crow::request& req){
    try {
        auto projects = node.get_projects();
        nlohmann::json response = nlohmann::json::array();
        
        for (const auto& p : projects) {
            response.push_back({
                {"project_id",      p.project_id},
                {"name",            p.name},
                {"description",     p.description},
                {"category",        p.category},
                {"total_funding",   p.total_funding},
                {"target_funding",  p.target_funding},
                {"investors_count", p.investors_count},
                {"status",          p.status},
                {"created_at",      p.created_at},
                {"roi_estimate",    p.roi_estimate}
            });
        }
        
        return crow::response(200, response.dump());
    }
    catch(const std::exception& e){
        return crow::response(500, e.what());
    }
});



    CROW_ROUTE(app, "/projects").methods("POST"_method)
    ([](const crow::request& req){
        try{
            return crow::response(200, "Sucess");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });
    CROW_ROUTE(app, "/projects").methods("PUT"_method)
    ([](const crow::request& req){
        try{
            return crow::response(200, "Sucess");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });
    CROW_ROUTE(app, "/projects").methods("DELETE"_method)
    ([](const crow::request& req){
        try{
            return crow::response(200, "Sucess");
        }
        catch(const std::exception& e){
            return crow::response(500, e.what());
        }
    });
}
