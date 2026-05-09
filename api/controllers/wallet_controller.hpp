#ifndef WALLET_CONTROLLER_HPP
#define WALLET_CONTROLLER_HPP

#include "controller.hpp"

class WalletController : public Controller {
public:
    WalletController() = default;
    ~WalletController() = default;
    
    crow::response (const crow::request& req) override;
};

#endif // WALLET_CONTROLLER_HPP