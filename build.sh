#!/usr/bin/env bash
# Script de construcción automática para desplegar en Render de forma unificada (monolito)
# exit on error
set -o errexit

echo "📦 Iniciando construcción de UNAMConnect..."

# 1. Construir el Frontend
echo "🔹 Construyendo el Frontend de Angular..."
cd frontend
npm install --include=dev
npm run build
cd ..

# 2. Instalar dependencias del Backend
echo "🔹 Instalando dependencias del Backend..."
cd backend
npm install
cd ..

echo "✅ Construcción finalizada con éxito."
