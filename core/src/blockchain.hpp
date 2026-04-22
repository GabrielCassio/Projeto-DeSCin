#ifndef BLOCKCHAIN_HPP
#define BLOCKCHAIN_HPP

// Importing hpps
#include "block.hpp"
// Importing standard libraries
#include <chrono>
#include <iostream>
#include <vector>

class Blockchain {
private:
  int difficulty;
  char pow_prefix = '0';
  std::vector<Block *> chain;

public:
  Blockchain(int diff = 4);
  std::vector<Block *> get_chain(void) const { return chain; }
  Block create_genesis_block();
};

#endif // BLOCKCHAIN_HPP
