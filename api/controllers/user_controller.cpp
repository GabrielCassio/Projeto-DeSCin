#include "user_controller.hpp"
#include <crow.h>

crow::response UserController::get_by_id(crow::request& req, const std::string& id) const {
    try {
        
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::get_many(crow::request& req) const {
    try {
        
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::get_all(crow::request& req) const {
    try {
        
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::post(crow::request& req) {
    try {
        
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}

crow::response UserController::put(crow::request& req, const std::string& id) {
    try {
        
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }   
}

crow::response UserController::del(crow::request& req, const std::string& id) {
    try {
        
    } catch (const std::exception& e) {
        return crow::response(500, e.what());
    }
}
