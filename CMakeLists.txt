# Definindo a versão mínima requerida do CMAKE pelo projeto
cmake_minimum_required(VERSION 4.0)

# Definindo informações básicas sorbe o projeto
project(Projeto_DeSCin VERSION 1.0.0)

# Definindo as variáveis de proejto referentes à versão do c++ utilizado
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Ferramentas do Projeto -------
# Incluindo o fetch content que gerencia e faz catching das dependências direto do GitHub
include(FetchContent)

message(STATUS "Baixando nlohmann/json...")
FetchContent_Declare(json
    URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
)
FetchContent_MakeAvailable(json)

message(STATUS "Baixando Crow...")
FetchContent_Declare(crow
    URL https://github.com/CrowCpp/Crow/releases/download/v1.0+5/crow-v1.0+5.zip
)
FetchContent_MakeAvailable(crow)

# Para Edísio e os demais, a Biblioteca do OpenSSl é a única que não baixa via protocolo http
# pois ela já pode existir em sistema linux/mac, então aqui é procurado apenas no sistema local
find_package(OpenSSL REQUIRED)

# -------------------------------

# Definindo o nome do arquivo executável do Projeto_DeSCin
add_executable(descin_blockchain)

# Atribuindo arquivos correspondentes a criação do executável
target_sources(descin_blockchain PRIVATE
    core/src/main.cpp
    #core/src/block.cpp
)

# Atribuindo as bibliotecas ao programa
target_link_libraries(descin_blockchain PRIVATE
    nlohmann_json::nlohmann_json
    Crow::Crow
    OpenSSL::SSL
    OpenSSL::Crypto
    pthread
)
