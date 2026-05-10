#include "transparency_log.hpp"

// Aqui SIM incluímos o header completo da Transaction —
// agora vamos usar tx.get_body(), tx.get_sender(), etc.
#include "../backend/blockchain-core/src/transaction.hpp"

#include <fstream>      // ofstream pra append no arquivo
#include <filesystem>   // criar diretório pai se não existir
#include <nlohmann/json.hpp>  // montar JSON sem fazer escape na mão



//  Constructor
TransparencyLog::TransparencyLog(const std::string& log_path)
    : _log_path(log_path)
{
    // Extrai o diretório pai do arquivo. Ex: "data/transparency.log" -> "data".
    std::filesystem::path full = log_path;
    std::filesystem::path parent = full.parent_path();

    // Se houver pasta pai, garante que ela exista.
    // Caminhos como "transparency.log" (sem pasta) não precisam.
    if (!parent.empty()) {
        std::error_code ec;
        std::filesystem::create_directories(parent, ec);
        // Ignoramos 'ec' — falhas viram 'false' no append.
    }
}

//  append: recebe uma Transaction, extrai os campos, monta um JSON e escreve no arquivo.
bool TransparencyLog::append(const Transaction& tx) {
    // Pega todos os campos da transação de uma vez.
    TransactionBody body = tx.get_body();

    // Monta o objeto JSON. nlohmann/json cuida do escape automaticamente.
    nlohmann::json entry;
    entry["sender"]     = body.sender_key;
    entry["project_id"] = body.receiver_key;   // receiver na blockchain = projeto aqui
    entry["amount"]     = body.amount;
    entry["timestamp"]  = body.timestamp;
    entry["signature"]  = body.signature;
    entry["tx_hash"]    = body.transaction_hash;

    // Abre o arquivo em modo APPEND (não trunca o que já tem).
    std::ofstream out(_log_path, std::ios::app);
    if (!out.is_open()) return false;

    // Escreve a linha JSON terminada com \n (formato JSONL).
    out << entry.dump() << "\n";

    // out fecha sozinho ao sair de escopo (RAII).
    return true;
}