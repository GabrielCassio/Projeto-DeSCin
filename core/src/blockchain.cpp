#include "blockchain.hpp"

// Defining constructor
Blockchain::Blockchain(int diff) : difficulty(diff) {
  // chain.push_back(this->create_genesis_block())
}

// Base block
const Block& Blockchain::create_genesis_block() {

    // Carrying infos by initial block of the chain
    Payload payload;
    payload.sequence = 0;
    payload.timestamp = time(nullptr);
    payload.data = "Bloco Inicial";
    payload.prev_hash = "";

    // Instantiate the genesis block
    Block *genesis_block = new Block(payload);

    genesis_block->display();

  return *genesis_block;
}
