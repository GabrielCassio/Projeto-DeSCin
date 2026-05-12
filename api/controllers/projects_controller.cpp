#include "projects_controller.hpp"
#include "../exceptions/exceptions.hpp"

#include <crow.h>
#include <vector>

namespace {
    crow::json::wvalue project_to_json(const Project& p) {
        crow::json::wvalue j;
        j["id"]                   = p.id;
        j["name"]                 = p.name;
        j["knowledge_area"]       = p.knowledge_area;
        j["institution"]          = p.institution;
        j["resume"]               = p.resume;
        j["description"]          = p.description;
        j["status"]               = p.status;
        j["initial_token_price"]  = p.initial_token_price;
        j["total_funding"]        = p.total_funding;
        j["target_funding"]       = p.target_funding;
        j["founders_percentage"]  = p.founders_percentage;
        j["community_percentage"] = p.community_percentage;
        j["liquidity_percentage"] = p.liquidity_percentage;
        j["reserved_percentage"]  = p.reserved_percentage;
        j["investors_count"]      = static_cast<int64_t>(p.investors_count);
        j["roi_estimate"]         = p.roi_estimate;
        j["created_at"]           = p.created_at;
        j["updated_at"]           = p.updated_at;
        return j;
    }
}

crow::response ProjectsController::get_by_id(const crow::request&, const std::string& id) const {
    try {
        auto project = service.get_by_id(id);
        return crow::response(200, project_to_json(*project));
    } catch (const NotFoundException& e) {
        return crow::response(404, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response ProjectsController::get_all(const crow::request&) const {
    try {
        auto projects = service.get_all();
        std::vector<crow::json::wvalue> arr;
        for (const auto& p : projects)
            arr.push_back(project_to_json(p));
        crow::json::wvalue res;
        res["data"] = std::move(arr);
        return crow::response(200, res);
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

// GET /projects?status=open&knowledge_area=biologia
crow::response ProjectsController::get_many(const crow::request& req) const {
    try {
        std::string status         = req.url_params.get("status")         ? req.url_params.get("status")         : "";
        std::string knowledge_area = req.url_params.get("knowledge_area") ? req.url_params.get("knowledge_area") : "";

        auto projects = service.get_by_filters(status, knowledge_area);
        std::vector<crow::json::wvalue> arr;
        for (const auto& p : projects)
            arr.push_back(project_to_json(p));
        crow::json::wvalue res;
        res["data"] = std::move(arr);
        return crow::response(200, res);
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response ProjectsController::post(const crow::request& req) {
    try {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "JSON inválido");

        auto project = service.create(body);
        return crow::response(201, project_to_json(project));
    } catch (const ValidationException& e) {
        return crow::response(400, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response ProjectsController::put(const crow::request& req, const std::string& id) {
    try {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "JSON inválido");

        auto project = service.update(body, id);
        return crow::response(200, project_to_json(project));
    } catch (const ValidationException& e) {
        return crow::response(400, e.what());
    } catch (const NotFoundException& e) {
        return crow::response(404, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response ProjectsController::del(const crow::request&, const std::string& id) {
    try {
        service.destroy(id);
        return crow::response(204);
    } catch (const NotFoundException& e) {
        return crow::response(404, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}
