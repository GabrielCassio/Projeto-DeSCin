#ifndef ROUTES_HPP
#define ROUTES_HPP

#include <crow.h>

// Precisa do DescinNode pra delegar lógica nas rotas
#include "../descin_node.hpp"

/*
 * Classe para configurar as rotas da aplicação.
 * Recebe a app Crow e o nó DeSCin por referência.
 */
class Routes {
    private:
        crow::SimpleApp& app;
        DescinNode& node;   // referência ao nó (dependency injection)
        
    public:
        Routes(crow::SimpleApp& app, DescinNode& node);
        ~Routes() = default;
    
        void setup_routes();
};

#endif