#include "blockchain.hpp"

// Defining constructor
Blockchain::Blockchain(int diff) : difficulty(diff) {
  // chain.push_back(this->create_genesis_block())
}

Block Blockchain::create_genesis_block() {
  auto current = std::chrono::system_clock::now();
  std::time_t cur_time = std::chrono::system_clock::to_time_t(current);
  std::cout << std::ctime(&cur_time);
  return Block();
}
