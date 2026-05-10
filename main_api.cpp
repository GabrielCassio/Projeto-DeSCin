#include "api/routes/routes.hpp"
#include "api/descin_node.hpp"

#include <crow.h>


int main() {
    // Instancia o nó DeSCin com dificuldade de mineração 4.
    DescinNode node(4);

    crow::SimpleApp app;
    Routes routes(app, node);

    app.bindaddr("0.0.0.0");
    app.port(18080).multithreaded().run();
}