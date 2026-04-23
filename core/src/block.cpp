#include "block.hpp"

Block::Block(const Payload& ps) : payload(ps) {
    set_timestamp(); // Setting create time block
}

void Block::set_timestamp(void) {
    auto current = std::chrono::system_clock::now();
    std::time_t cur_time = std::chrono::system_clock::to_time_t(current);

    this->payload.timestamp = cur_time;
}

void Block::display(void) const {
    std::cout << "Timestamp: " << std::ctime(&this->payload.timestamp);
}
