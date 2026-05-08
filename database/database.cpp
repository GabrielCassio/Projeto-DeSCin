#include "database.hpp"
#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <openssl/evp.h> // "A caixa de ferramentas" principal do OpenSSl
#include <openssl/rand.h> // Usada para gerar números verdadeiramente aleatórios SALT
#include <openssl/aes.h>


// No AES-256, a chave precisa ter exatamente 32 bytes(256bits)
const int TAMANHO_CHAVE = 32;
// O vetor de inicialização (IV) precisa de 16 bytes
const int TAMANHO_IV = 16;
// Em SI usamos o padrão PBKDF2
// O Salt é uma sequência de bytes aleatórios adicionada à senha antes de embaralhá-la.

void derivarChave(const std::string& senha, const unsigned char* salt, unsigned char* chaveFinal) {
    int iteracoes = 10000; // Quanto mais interações mais difícil de quebrar
    // Esta função do OpenSSL faz todo o trabalho matemático
    PKCS5_PBKDF2_HMAC_SHA1(
        senha.c_str(),    // A senha convertida para estilo C
        senha.length(),   // O tamanho da senha
        salt,             // O sal aleatório
        TAMANHO_IV,       // Usamos 16 bytes para o salt também
        iteracoes,        // O número de rodadas de embaralhamento
        TAMANHO_CHAVE,    // Quanto queremos no final (32 bytes)
        chaveFinal        // Onde o resultado será guardado
    );

}

std::vector<unsigned char> encriptor(std::string texto, unsigned char* chave, unsigned char* iv) {
    // 1. O "Cérebro" da Operação (Contexto)
    // EVP_CIPHER_CTX é uma estrutura que guarda o estado da nossa encriptação.
    // Usamos um ponteiro (*) porque o OpenSSL gerencia essa memória internamente.
    EVP_CIPHER_CTX *ctx = EVP_CIPHER_CTX_new();

    // 2. Preparando o "balde" para o resultado
    // O texto secreto pode ser um pouco maior que o original (por causa do padding).
    // Reservamos o tamanho do texto + 16 bytes (tamanho de um bloco AES).
    std::vector<unsigned char> textoEncriptado(texto.length() + 16);

    int len;          // Quantos bytes foram processados agora
    int tamanhoTotal; // Total de bytes encriptados no final

    // 3. ESTÁGIO: INIT (O Início)
    // Aqui dizemos: "Use o algoritmo AES-256 no modo CBC com esta chave e este IV".
    EVP_EncryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, chave, iv);

    EVP_EncryptUpdate(ctx, 
                 textoEncriptado.data(), // Onde os dados cifrados serão salvos
                 &len,                   // Recebe quantos bytes foram gerados agora
                 (unsigned char*)texto.c_str(), // O texto puro em formato de bytes
                 texto.length());        // O tamanho original

    EVP_EncryptFinal_ex(ctx, textoEncriptado.data() + tamanhoTotal, &len);
    tamanhoTotal += len; // Agora temos o tamanho final real de tudo o que foi trancado!
    
    // Limpando a "Bancada de trabalho"/ Estrutura de dados que lida com a encriptação
    EVP_CIPHER_CTX_free(ctx);

    textoEncriptado.resize(tamanhoTotal);
    // Para termos um vetor de tamanho adequado ao numero de bits ocupados
    return textoEncriptado;

}

std::vector<unsigned char> decriptor(const std::vector<unsigned char>& dadosCifrados, const unsigned char* chave, const unsigned char* iv) {
    EVP_CIPHER_CTX* ctx = EVP_CIPHER_CTX_new();
    int len;
    int tamanhoTotal;

    // Cria um vetor para o resultado (mesmo tamanho do cifrado)
    std::vector<unsigned char> dadosLimpos(dadosCifrados.size());

    // Inicializa o motor de decriptação para AES-256 em modo CBC
    EVP_DecryptInit_ex(ctx, EVP_aes_256_cbc(), NULL, chave, iv);

    // Processa os blocos de dados
    EVP_DecryptUpdate(ctx, dadosLimpos.data(), &len, dadosCifrados.data(), dadosCifrados.size());
    tamanhoTotal = len;

    // Finaliza e remove o padding (aqui é onde a senha errada é detectada!)
    if (EVP_DecryptFinal_ex(ctx, dadosLimpos.data() + len, &len) <= 0) {
        EVP_CIPHER_CTX_free(ctx);
        return {}; // Retorna vazio se a senha estiver incorreta ou dados corrompidos
    }
    tamanhoTotal += len;

    EVP_CIPHER_CTX_free(ctx);

    // Ajusta o vetor para o tamanho real sem o padding
    dadosLimpos.resize(tamanhoTotal);

    return dadosLimpos;
}

void SalvarNoBancoDeDados(unsigned char* salt, unsigned char* iv, std::vector<unsigned char>& dadoEncriptado, std::string destinoFinal) {

    // Abrindo o ficheiro para a escrita
    std::ofstream ficheiro(destinoFinal, std::ios::binary | std::ios::app);

    if (ficheiro.is_open()){
    // Primeiro argumento do .write é onde o dado começa e o outro é o quão grande ele é
    // Gravando o Salt ( sempre 16 byes )
    ficheiro.write((char*)salt, 16);



    // gravando o IV ( sempre 16 byes)
    ficheiro.write((char*)iv, 16);

    // Gravando o tamanho do próximo block, para que o programa saiba quando o dado acaba e possa começar a ler outro dado no mesmo cicli, salt, iv, tamanho, dado, salt, iv, tamanho, dado...
    // Gravamos isso para que o programa fique previsível e consiga avanaçar entre os blocos.
    size_t tamanho = dadoEncriptado.size();
    ficheiro.write((char*)&tamanho, sizeof(tamanho));

    // Gravando os Dados
    ficheiro.write((char*)dadoEncriptado.data(), dadoEncriptado.size());

    ficheiro.close();
    std::cout << "Bloco guardado com sucesso em: " << destinoFinal << " 📁" << std::endl;
    }
}



