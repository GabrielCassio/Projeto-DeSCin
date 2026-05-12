#include "wallets_controller.hpp"
#include "../exceptions/exceptions.hpp"

#include <crow.h>
#include <vector>

namespace {
    crow::json::wvalue token_to_json(const TokenBalance& t) {
        crow::json::wvalue j;
        j["id"]         = t.id;
        j["symbol"]     = t.symbol;
        j["amount"]     = t.amount;
        j["usd_value"]  = t.usd_value;
        j["created_at"] = t.created_at;
        j["updated_at"] = t.updated_at;
        return j;
    }

    crow::json::wvalue investment_to_json(const Investment& i) {
        crow::json::wvalue j;
        j["id"]              = i.id;
        j["project_id"]      = i.project_id;
        j["project_name"]    = i.project_name;
        j["amount_invested"] = i.amount_invested;
        j["current_value"]   = i.current_value;
        j["invested_at"]     = i.invested_at;
        j["status"]          = i.status;
        j["created_at"]      = i.created_at;
        j["updated_at"]      = i.updated_at;
        return j;
    }

    crow::json::wvalue wallet_to_json(const Wallet& w) {
        crow::json::wvalue j;
        j["id"]          = w.id;
        j["user_id"]     = w.user_id;
        j["address"]     = w.address;
        j["balance"]     = static_cast<int64_t>(w.balance);
        j["balance_usd"] = w.balance_usd;
        j["created_at"]  = w.created_at;
        j["updated_at"]  = w.updated_at;

        std::vector<crow::json::wvalue> tokens;
        for (const auto& t : w.tokens)
            tokens.push_back(token_to_json(t));
        j["tokens"] = std::move(tokens);

        std::vector<crow::json::wvalue> investments;
        for (const auto& inv : w.investments)
            investments.push_back(investment_to_json(inv));
        j["investments"] = std::move(investments);

        return j;
    }
}

crow::response WalletsController::get_by_id(const crow::request&, const std::string& id) const {
    try {
        auto wallet = service.get_by_id(id);
        return crow::response(200, wallet_to_json(*wallet));
    } catch (const NotFoundException& e) {
        return crow::response(404, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response WalletsController::get_all(const crow::request&) const {
    try {
        auto wallets = service.get_all();
        std::vector<crow::json::wvalue> arr;
        for (const auto& w : wallets)
            arr.push_back(wallet_to_json(w));
        crow::json::wvalue res;
        res["data"] = std::move(arr);
        return crow::response(200, res);
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

// GET /wallets/<id>/transactions via query param wallet_id
crow::response WalletsController::get_many(const crow::request& req) const {
    try {
        const char* wallet_id = req.url_params.get("wallet_id");
        if (!wallet_id) return crow::response(400, "Parâmetro obrigatório: wallet_id");
        auto wallet = service.get_by_id(wallet_id);
        std::vector<crow::json::wvalue> arr;
        for (const auto& inv : wallet->investments)
            arr.push_back(investment_to_json(inv));
        crow::json::wvalue res;
        res["data"] = std::move(arr);
        return crow::response(200, res);
    } catch (const NotFoundException& e) {
        return crow::response(404, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response WalletsController::post(const crow::request& req) {
    try {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "JSON inválido");

        auto wallet = service.create(body);
        return crow::response(201, wallet_to_json(wallet));
    } catch (const ValidationException& e) {
        return crow::response(400, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response WalletsController::put(const crow::request& req, const std::string& id) {
    try {
        auto body = crow::json::load(req.body);
        if (!body) return crow::response(400, "JSON inválido");

        auto wallet = service.update(body, id);
        return crow::response(200, wallet_to_json(wallet));
    } catch (const ValidationException& e) {
        return crow::response(400, e.what());
    } catch (const NotFoundException& e) {
        return crow::response(404, e.what());
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}
