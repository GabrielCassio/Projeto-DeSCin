#!/bin/bash
echo "🚀 Subindo DeSCin..."

# Mata processos anteriores
pkill -f descin_api 2>/dev/null
pkill -f vite 2>/dev/null
sleep 1

# Sobe backend
cd /home/edisio/Projeto-DeSCin/build
./descin_api &
echo "✅ Backend rodando em http://localhost:8080"

# Sobe frontend
cd /home/edisio/Projeto-DeSCin/frontend
npx --yes vite --host &
echo "✅ Frontend rodando em http://localhost:5173"

echo "🎉 DeSCin online!"
wait
