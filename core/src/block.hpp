#ifndef BLOCK_HPP
#define BLOCK_HPP

class Block {
private:
  int difficulty = 0;
  long long timestamp = 0;
  long long nonce = 0;

public:
  // Constrcutor and destructor
  Block(int diff = 4) : difficulty(diff) {};
  ~Block();
  void calculateHash() {}
};

#endif
