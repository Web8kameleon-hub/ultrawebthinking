#!/bin/bash

set -e  # Ndalo ekzekutimin nëse ka një gabim

echo "🚀 Nisja e konfigurimit të mjedisit ultra-optimizuar..."

# 1️⃣ Përditësimi i sistemit
sudo apt update && sudo apt upgrade -y

# 2️⃣ Instalimi i WSL dependencies
sudo apt install -y build-essential curl file git

# 3️⃣ Instalimi i Python dhe pip
sudo apt install -y python3 python3-pip

# 4️⃣ Instalimi i Rust + Cargo
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env

# 5️⃣ Instalimi i Docker dhe Docker Compose
sudo apt install -y docker.io docker-compose
sudo usermod -aG docker $USER

# 6️⃣ Instalimi i Node.js, npm dhe Next.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
npm install -g yarn

# 7️⃣ Instalimi i VS Code Extensions për WSL
code --install-extension ms-vscode-remote.remote-wsl
code --install-extension rust-lang.rust-analyzer
code --install-extension esbenp.prettier-vscode

# 8️⃣ Instalimi i TensorFlow.js dhe librarive AI
npm install @tensorflow/tfjs

# 9️⃣ Konfigurimi i Git dhe sinkronizimi me GitHub
if [ ! -f "$HOME/.ssh/id_rsa" ]; then
    ssh-keygen -t rsa -b 4096 -C "your_email@example.com" -f $HOME/.ssh/id_rsa -N ""
    echo "🔑 Kopjo këtë çelës në GitHub:"
    cat $HOME/.ssh/id_rsa.pub
fi

git config --global user.name "Ultrawebthinking"
git config --global user.email "your_email@example.com"
git config --global core.editor "code --wait"

echo "✅ Konfigurimi i mjedisit përfundoi me sukses! Restartoni kompjuterin për ndryshimet."
