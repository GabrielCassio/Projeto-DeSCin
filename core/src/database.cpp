#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <openssl/evp.h> // "A caixa de ferramentas" principal do OpenSSl
#include <openssl/rand.h> // Usada para gerar números verdadeiramente aleatórios SALT
#include <openssl/aes.h>

using namespace std;

// No AES-256, a chave precisa ter exatamente 32 bytes(256bits)
const int TAMANHO_CHAVE = 32;
// O vetor de inicialização (IV) precisa de 16 bytes
const int TAMANHO_IV = 16;
// Em SI usamos o padrão PBKDF2
// O Salt é uma sequência de bytes aleatórios adicionada à senha antes de embaralhá-la.

void derivarChave(const string& senha, const unsigned char* salt, unsigned char* chaveFinal) {
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

int main() {
    string senhaUsuario = "minha_senha_123";

    // Espaços na memória
    unsigned char meuSalt[TAMANHO_IV];
    unsigned char meuIV[TAMANHO_IV];
    unsigned char minhaChave[TAMANHO_CHAVE];


    // Preenhce os espações com numeros aleatórios
    RAND_bytes(meuSalt, TAMANHO_IV);
    RAND_bytes(meuIV, TAMANHO_IV);

    // Gera a Chave Final
    derivarChave(senhaUsuario, meuSalt, minhaChave);

    cout << "Chave gerada com sucesso!" << endl;

    return 0;
}









