#!/bin/bash
# JONA - Hetzner K3s Initial Setup Script
# Run this on the fresh Hetzner server (46.224.203.89)

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  JONA - Hetzner K3s Initial Setup                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

# Step 1: System Updates
echo -e "\n${YELLOW}[1/8] System Updates...${NC}"
apt-get update
apt-get upgrade -y
apt-get install -y curl wget git vim htop iotop net-tools

echo -e "${GREEN}✓ System updated${NC}"

# Step 2: Install Docker
echo -e "\n${YELLOW}[2/8] Installing Docker...${NC}"
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker root
docker --version
echo -e "${GREEN}✓ Docker installed${NC}"

# Step 3: Install K3s (lightweight Kubernetes)
echo -e "\n${YELLOW}[3/8] Installing K3s...${NC}"
export INSTALL_K3S_SKIP_DOWNLOAD=false
curl -sfL https://get.k3s.io | sh -s - --docker
sleep 10
echo -e "${GREEN}✓ K3s installed${NC}"

# Step 4: Setup kubeconfig
echo -e "\n${YELLOW}[4/8] Setting up kubeconfig...${NC}"
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
mkdir -p ~/.kube
cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
chmod 600 ~/.kube/config
kubectl version
echo -e "${GREEN}✓ kubeconfig ready${NC}"

# Step 5: Wait for K3s to be ready
echo -e "\n${YELLOW}[5/8] Waiting for K3s to be ready...${NC}"
kubectl wait --for=condition=Ready node --all --timeout=300s
kubectl get nodes
echo -e "${GREEN}✓ K3s nodes ready${NC}"

# Step 6: Setup storage
echo -e "\n${YELLOW}[6/8] Setting up local storage...${NC}"
mkdir -p /var/lib/rancher/k3s/server/manifests
cat > /var/lib/rancher/k3s/server/manifests/local-storage.yaml <<EOF
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: local-storage
provisioner: rancher.io/local-path
volumeBindingMode: WaitForFirstConsumer
EOF

sleep 10
kubectl get storageclass
echo -e "${GREEN}✓ Storage configured${NC}"

# Step 7: Install Helm
echo -e "\n${YELLOW}[7/8] Installing Helm...${NC}"
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version
echo -e "${GREEN}✓ Helm installed${NC}"

# Step 8: System tuning
echo -e "\n${YELLOW}[8/8] System tuning...${NC}"
sysctl -w vm.max_map_count=262144
sysctl -w fs.file-max=2097152
echo "vm.max_map_count=262144" >> /etc/sysctl.conf
echo "fs.file-max=2097152" >> /etc/sysctl.conf
sysctl -p
echo -e "${GREEN}✓ System tuned${NC}"

# Export kubeconfig for remote access
echo -e "\n${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}✓ K3s Setup Complete!${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}Export kubeconfig for local machine:${NC}"
echo -e "${YELLOW}scp root@46.224.203.89:/etc/rancher/k3s/k3s.yaml ~/.kube/hetzner-config${NC}"

echo -e "\n${BLUE}Then merge with:${NC}"
echo -e "${YELLOW}export KUBECONFIG=~/.kube/config:~/.kube/hetzner-config${NC}"

echo -e "\n${BLUE}Verify connection:${NC}"
echo -e "${YELLOW}kubectl cluster-info${NC}"

# Show cluster info
echo -e "\n${BLUE}Cluster Information:${NC}"
kubectl cluster-info
echo -e "\n${BLUE}Nodes:${NC}"
kubectl get nodes -o wide
echo -e "\n${BLUE}Storage Classes:${NC}"
kubectl get storageclass
