#pragma once
// Serve para o arquivo não ficar lendo sempre o arquivo

#include <iostream>
#include <fstream>
#include <string>
#include <vector>

void derivarChave(const std::string& senha, const unsigned char* salt, unsigned char* chaveFinal);

std::vector<unsigned char> encriptor(std::string texto, unsigned char* chave, unsigned char* iv);


std::vector<unsigned char> decriptor(const std::vector<unsigned char>& dadosCifrados, const unsigned char* chave, const unsigned char* iv);

void SalvarNoBancoDeDados(unsigned char* salt, unsigned char* iv, std::vector<unsigned char>& dadoEncriptado, std::string destinoFinal);

