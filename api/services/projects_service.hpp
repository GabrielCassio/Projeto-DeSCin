#ifndef PROJECTS_SERVICE_HPP
#define PROJECTS_SERVICE_HPP

// Include libraries
#include <string>
#include <optional>
#include <vector>
#include <pqxx/pqxx>

// Include the base Service class
#include "service.hpp"
#include "../models/model.hpp"

class ProjectsService : public Service<Project> {
public:
    ProjectsService(pqxx::connection& conn) : Service<Project>(conn) {}
    ~ProjectsService() = default;

    std::optional<Project> get_by_id(const std::string id) const override;
    std::vector<Project> get_all() const override;
    void buy_tokens(const std::string& project_id, int user_id, int tokens, double total) const;
    std::vector<Project> get_by_filters(const std::string& status,
                                        const std::string& knowledge_area) const;
    Project create(const crow::json::rvalue& body) override;
    Project update(const crow::json::rvalue& body, const std::string id) override;
    Project destroy(const std::string id) override;
};

#endif // PROJECTS_SERVICE_HPP