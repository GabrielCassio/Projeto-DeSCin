// Importing our hpp libraries
#include "block.hpp"
#include "blockchain.hpp"
#include "utils/hash.hpp"
// Importing built in libraries
#include <iostream>

#define endl '\n'

int main(void) {
    std::string mensagem = "Ola, OpenSSL em C++!";

    try {
        std::string hash_result = hash(mensagem);
        std::cout << "Mensagem: " << mensagem << "\n";
        std::cout << "SHA-256:  " << hash_result << "\n";
    } catch (const std::exception& e) {
        std::cerr << "Erro: " << e.what() << "\n";
        return 1;
    }

  // int difficulty = 4; // Dificuldade para quebrar o hash do bloco
  // // Instancing base block of the blockchain
  // Blockchain *blockchain = new Blockchain(difficulty);
  // blockchain->create_genesis_block();
  // std::cout << "" << std::endl;

  // // Num blocks of the chain
  // int num_blocks = 10;
  // vector<Block *> chain = blockchain->get_chain();

  // for (int i = 0; i <= num_blocks; i++) {
  //   Block block = blockchain->new_block(i);
  //   long long mine_info = blockchain->mining_block(block);
  //   chain = blockchain->send_block(mine_info.mined_block);
  // }

  // std::cout << "---------- INITIAL BLOCKCHAIN -----------" << std::endl << chain <<
  // std::endl;
  return 0;
}
