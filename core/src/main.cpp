// Importing our hpp libraries
#include "block.hpp"
#include "blockchain.hpp"
// Importing built in libraries
#include <iostream>

using namespace std;
#define endl '\n'

int main(void) {

  int difficulty = 4; // Dificuldade para quebrar o hash do bloco
  // Instancing base block of the blockchain
  Blockchain *blockchain = new Blockchain(difficulty);
  blockchain->create_genesis_block();
  // cout << "" << endl;

  // // Num blocks of the chain
  // int num_blocks = 10;
  // vector<Block *> chain = blockchain->get_chain();

  // for (int i = 0; i <= num_blocks; i++) {
  //   Block block = blockchain->new_block(i);
  //   long long mine_info = blockchain->mining_block(block);
  //   chain = blockchain->send_block(mine_info.mined_block);
  // }

  // cout << "---------- INITIAL BLOCKCHAIN -----------" << endl << chain <<
  // endl;
  return 0;
}
