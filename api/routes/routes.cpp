#include "routes.hpp"

Routes::Routes(crow::App& app) : app(app) {
    setup_routes();
}