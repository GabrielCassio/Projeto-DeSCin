#pragma once


#include <string>

// Forward declaration: evita incluir transaction.hpp neste header.
class Transaction;


class TransparencyLog {

private:
    // Caminho do arquivo de log (default: data/transparency.log).
    std::string _log_path;

public:
    // Constructor: garante que o diretório do arquivo exista.
    explicit TransparencyLog(const std::string& log_path = "data/transparency.log");

    // Destructor padrão.
    ~TransparencyLog() = default;

    // Adiciona uma transação ao log como nova linha JSON.
    // Retorna true em sucesso, false se não conseguiu abrir/escrever.
    bool append(const Transaction& tx);
};