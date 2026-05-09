#ifndef ROUTES_HPP
#define ROUTES_HPP

// Includes
#include <crow.h>
#include "../descin_node.hpp"

class Routes {
    protected:
        crow::App<>& app;
        DescinNode& node;

    public:
    
    // Constructor and destructor
        Routes(crow::App<>& app, DescinNode& node);
        ~Routes() = default;

        virtual void setup_routes() = 0;
};

#endif