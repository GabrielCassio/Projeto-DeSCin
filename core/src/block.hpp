/*
 *   block.hpp Estruturando a classe bloco/base para todo o sistema de
 * blockchain
 *
 */

#ifndef BLOCK_HPP
#define BLOCK_HPP

// Importing default libraries
#include <string>
#include <chrono>
#include <iostream>

// Data structs to the clss
struct Header {
long nonce;
std::string hash_block;
};

struct Payload {
long sequence;
time_t timestamp;
std::string data; // Ainda não defini o tipo de data
std::string prev_hash;
};

  class Block {
private:
  Header header;
  Payload payload;
  // Private Methods
  void set_timestamp(void);

public:
  // Constrcutor and destructor
  Block(const Payload& ps);
  ~Block() {};
  time_t get_timestamp(void) const { return payload.timestamp; }
  void display(void) const;
};

#endif
