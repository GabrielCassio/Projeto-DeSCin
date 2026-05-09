#ifndef ROUTES_HPP
#define ROUTES_HPP

#include <crow.h>

/*
 * Classe para configurar as rotas da aplicação.
 * Define
 */

class Routes {
    protected:
        crow::App<>& app;
        
    public:
        // Constructor and Destructor
        Routes(crow::App<>& app);
        ~Routes() = default;
    
        // Routes Methods
        virtual void setup_routes() = 0;
};


#endif