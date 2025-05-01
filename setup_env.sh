#!/bin/bash
echo "🚀 Fillimi i konfigurimit të Ultrawebthinking..."

# 1️⃣ Përditësimi i paketave dhe instalimi i mjeteve bazë
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git unzip build-essential 

# 2️⃣ Instalimi i **Python, Rust dhe Node.js**
sudo apt install -y python3 python3-pip
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source $HOME/.cargo/env
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3️⃣ Instalimi i **Docker dhe Kubernetes**
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
sudo apt install -y kubeadm kubectl kubelet
sudo systemctl enable --now kubelet

# 4️⃣ Konfigurimi i **GitHub**
git config --global user.name "Web8kameleon"
git config --global user.email "deealjona@gmail.com"
git clone https://github.com/Web8kameleon-hub/ultrawebthinking.git ~/ultrawebthinking

# 5️⃣ Instalimi i **VS Code dhe ESLint**
sudo apt install -y code
npm install -g eslint prettier

# 6️⃣ Instalimi i **Postman**
sudo snap install postman

# 7️⃣ Konfigurimi i Firewall-it dhe sigurisë
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

echo "✅ Konfigurimi i Ultrawebthinking përfundoi me sukses!"
