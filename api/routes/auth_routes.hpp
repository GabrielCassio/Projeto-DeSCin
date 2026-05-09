#ifndef AUTH_ROUTES_HPP
#define AUTH_ROUTES_HPP

// Include libraries
#include <crow.h>
// Include routes class
#include <routes.hpp>

class AuthRoutes: public Routes {
public:
    void auth_routes(crow::App<>& app);
};

#endif // AUTH_ROUTES_HPP
