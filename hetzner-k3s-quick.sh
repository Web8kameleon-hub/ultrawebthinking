#!/bin/bash
# JONA - Hetzner K3s Ultra-Fast Setup for Ubuntu 24.04
# Optimized for quick deployment

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  JONA - Hetzner K3s Setup (Ubuntu 24.04)                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

# Step 1: System Update
echo -e "\n${YELLOW}[1/5] System Update...${NC}"
apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq curl wget git vim htop net-tools
echo -e "${GREEN}✓ System updated${NC}"

# Step 2: Install K3s (skip Docker - K3s uses containerd)
echo -e "\n${YELLOW}[2/5] Installing K3s...${NC}"
curl -sfL https://get.k3s.io | K3S_KUBECONFIG_MODE="644" sh -
sleep 5
echo -e "${GREEN}✓ K3s installed${NC}"

# Step 3: Verify K3s
echo -e "\n${YELLOW}[3/5] Verifying K3s...${NC}"
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
/usr/local/bin/kubectl version --short
/usr/local/bin/kubectl get nodes
echo -e "${GREEN}✓ K3s verified${NC}"

# Step 4: Setup kubeconfig for local access
echo -e "\n${YELLOW}[4/5] Setting up kubeconfig...${NC}"
mkdir -p ~/.kube
cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
chmod 600 ~/.kube/config

# Show kubeconfig for copying
echo -e "\n${BLUE}📋 Save this kubeconfig on your LOCAL machine:${NC}"
echo "scp root@46.224.203.89:/etc/rancher/k3s/k3s.yaml ~/.kube/hetzner-config"
echo -e "\n${BLUE}Then merge with:${NC}"
echo "export KUBECONFIG=~/.kube/config:~/.kube/hetzner-config"

# Step 5: Install Helm
echo -e "\n${YELLOW}[5/5] Installing Helm...${NC}"
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash -s -- --silent
echo -e "${GREEN}✓ Helm installed${NC}"

# Final verification
echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  K3s Setup Complete!                                       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}Cluster Status:${NC}"
/usr/local/bin/kubectl get nodes -o wide
/usr/local/bin/kubectl get pods -A

echo -e "\n${BLUE}Next Step:${NC}"
echo -e "${YELLOW}bash <(curl -fsSL https://raw.githubusercontent.com/Web8kameleon-hub/ultrawebthinking/master/hetzner-ingress.sh) jona.yourdomain.com admin@yourdomain.com${NC}"
