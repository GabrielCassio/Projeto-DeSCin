/*
 *   block.hpp Estruturando a classe bloco/base para todo o sistema de
 * blockchain
 *
 */

#ifndef BLOCK_HPP
#define BLOCK_HPP

// Importing default libraries
#include <string>

class Block {
private:
  // Data structs to the clss
  struct Header {
    long nonce;
    std::string hash_block;
  };

  struct Payload {
    long sequence;
    long timestamp;
    // Data data; // Ainda não defini o tipo de data
    std::string before_hashing;
  };
  Header header;
  Payload payload;

public:
  // Constrcutor and destructor
  Block();
  virtual ~Block();
};

#endif
