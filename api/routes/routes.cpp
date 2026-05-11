#include "routes.hpp"
#include "../middleware/auth_middleware.hpp"
#include <nlohmann/json.hpp>

Routes::Routes(crow::SimpleApp& app, DescinNode& node)
    : app(app), node(node)
{
    setup_routes();
}

void Routes::setup_routes() {
    // Health check
    CROW_ROUTE(app, "/api/health")
    ([] {
        return crow::response(200, "{\"status\":\"ok\"}");
    });

    // Lista todos os projetos
    CROW_ROUTE(app, "/api/projects")
    ([this] {
        auto projects = node.get_projects();

        crow::json::wvalue::list arr;
        for (const auto& p : projects) {
            crow::json::wvalue item;
            item["project_id"]       = p.project_id;
            item["name"]             = p.name;
            item["description"]      = p.description;
            item["category"]         = p.category;
            item["total_funding"]    = p.total_funding;
            item["target_funding"]   = p.target_funding;
            item["investors_count"]  = p.investors_count;
            item["status"]           = p.status;
            item["created_at"]       = p.created_at;
            item["roi_estimate"]     = p.roi_estimate;
            arr.push_back(std::move(item));
        }

        crow::json::wvalue response;
        response["projects"] = std::move(arr);
        return crow::response(200, response);
    });
    // Detalhe de um projeto específico
    CROW_ROUTE(app, "/api/projects/<string>")
    ([this](const std::string& id) {
        auto project = node.get_project_by_id(id);
        if (!project) {
            return crow::response(404, "{\"error\":\"project not found\"}");
        }

        crow::json::wvalue body;
        body["project_id"]       = project->project_id;
        body["name"]             = project->name;
        body["description"]      = project->description;
        body["category"]         = project->category;
        body["total_funding"]    = project->total_funding;
        body["target_funding"]   = project->target_funding;
        body["investors_count"]  = project->investors_count;
        body["status"]           = project->status;
        body["created_at"]       = project->created_at;
        body["roi_estimate"]     = project->roi_estimate;

        return crow::response(200, body);

    }
    );

    // Cadastro de usuário
CROW_ROUTE(app, "/api/auth/register").methods(crow::HTTPMethod::POST)
([this](const crow::request& req) {
    // 1. Parseia o body JSON
    nlohmann::json body;
    try {
        body = nlohmann::json::parse(req.body);
    } catch (const std::exception&) {
        return crow::response(400, "{\"error\":\"invalid JSON\"}");
    }

    // 2. Valida campos obrigatórios
    if (!body.contains("name") || !body.contains("email") || !body.contains("password")) {
        return crow::response(400, "{\"error\":\"missing required fields: name, email, password\"}");
    }

    std::string name     = body["name"];
    std::string email    = body["email"];
    std::string password = body["password"];

    // 3. Chama o nó pra registrar
    auto wallet_address = node.register_user(name, email, password);
    if (!wallet_address) {
        // Pode ser email duplicado ou falha de I/O. Por simplicidade, 409.
        return crow::response(409, "{\"error\":\"could not register (email may already exist)\"}");
    }

    // 4. Cria sessão automaticamente (login depois do cadastro)
    std::string token = SessionStore::instance().create_session(*wallet_address, *wallet_address);

    // 5. Retorna sucesso
    crow::json::wvalue response;
    response["wallet_address"] = *wallet_address;
    response["token"]          = token;
    return crow::response(201, response);
});

    // Login de usuário
CROW_ROUTE(app, "/api/auth/login").methods(crow::HTTPMethod::POST)
([this](const crow::request& req) {
    // 1. Parseia o body
    nlohmann::json body;
    try {
        body = nlohmann::json::parse(req.body);
    } catch (const std::exception&) {
        return crow::response(400, "{\"error\":\"invalid JSON\"}");
    }

    // 2. Valida campos
    if (!body.contains("email") || !body.contains("password")) {
        return crow::response(400, "{\"error\":\"missing required fields: email, password\"}");
    }

    std::string email    = body["email"];
    std::string password = body["password"];

    // 3. Valida credenciais
    auto wallet_address = node.login_user(email, password);
    if (!wallet_address) {
        // Mesma resposta pra "email não existe" e "senha errada" (anti-enumeração).
        return crow::response(401, "{\"error\":\"invalid credentials\"}");
    }

    // 4. Cria sessão
    std::string token = SessionStore::instance().create_session(*wallet_address, *wallet_address);

    // 5. Retorna sucesso
    crow::json::wvalue response;
    response["wallet_address"] = *wallet_address;
    response["token"]          = token;
    return crow::response(200, response);
});

    CROW_ROUTE(app, "/api/invest").methods(crow::HTTPMethod::POST)
([this](const crow::request& req) {
    // 1. Valida token de autenticação
    auto auth_header = req.get_header_value("Authorization");
    if (auth_header.empty() || auth_header.substr(0, 7) != "Bearer ") {
        return crow::response(401, "{\"error\":\"missing or malformed token\"}");
    }
    std::string token = auth_header.substr(7);

    auto session = SessionStore::instance().get_session(token);
    if (!session) {
        return crow::response(401, "{\"error\":\"invalid or expired token\"}");
    }
    std::string sender_wallet = session->wallet_address;

    // 2. Parseia body
    nlohmann::json body;
    try {
        body = nlohmann::json::parse(req.body);
    } catch (const std::exception&) {
        return crow::response(400, "{\"error\":\"invalid JSON\"}");
    }

    // 3. Valida campos (agora 'password' em vez de 'signature')
    if (!body.contains("project_id") || !body.contains("amount") || !body.contains("password")) {
        return crow::response(400, "{\"error\":\"missing required fields: project_id, amount, password\"}");
    }

    std::string project_id = body["project_id"];
    unsigned long amount   = body["amount"];
    std::string password   = body["password"];

    // 4. Processa investimento (o nó vai decifrar a chave e assinar internamente)
    bool ok = node.process_investment(sender_wallet, project_id, amount, password);
    if (!ok) {
        return crow::response(400, "{\"error\":\"investment failed (wrong password, project not active, or other error)\"}");
    }

    // 5. Sucesso
    crow::json::wvalue response;
    response["status"]     = "ok";
    response["sender"]     = sender_wallet;
    response["project_id"] = project_id;
    response["amount"]     = amount;
    return crow::response(200, response);
});

}