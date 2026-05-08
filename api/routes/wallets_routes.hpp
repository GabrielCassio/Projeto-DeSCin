#ifndef WALLETS_ROUTES_HPP
#define WALLETS_ROUTES_HPP

#include 'routes.hpp'
#include <crow.h>

class WalletsRoutes : public Routes {
public:
    void setup_routes(crow::App& app);
};

#endif // WALLETS_ROUTES_HPP