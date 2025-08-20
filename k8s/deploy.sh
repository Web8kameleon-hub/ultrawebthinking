#!/bin/bash
# k8s/deploy.sh
# EuroWeb Ultra Kubernetes Deployment Script
# © Web8 UltraThinking – Ledjan Ahmati

echo "🚀 Starting EuroWeb Ultra Kubernetes Deployment..."

# Create namespace
echo "📦 Creating namespace..."
kubectl apply -f namespace.yaml

# Apply configuration
echo "⚙️  Applying configuration..."
kubectl apply -f configmap.yaml

# Deploy Redis cache
echo "🔴 Deploying Redis cache..."
kubectl apply -f redis-deployment.yaml

# Wait for Redis to be ready
echo "⏳ Waiting for Redis to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/redis -n euroweb-ultra

# Deploy backend
echo "🧠 Deploying AGI Backend..."
kubectl apply -f backend-deployment.yaml

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/euroweb-backend -n euroweb-ultra

# Deploy frontend
echo "🌐 Deploying Frontend..."
kubectl apply -f frontend-deployment.yaml

# Wait for frontend to be ready
echo "⏳ Waiting for frontend to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/euroweb-frontend -n euroweb-ultra

# Apply ingress
echo "🌍 Setting up Ingress..."
kubectl apply -f ingress.yaml

# Apply autoscaling
echo "📈 Setting up Auto-scaling..."
kubectl apply -f hpa.yaml

echo ""
echo "✅ EuroWeb Ultra deployment completed!"
echo ""
echo "📊 Deployment Status:"
kubectl get pods -n euroweb-ultra
echo ""
echo "🌐 Services:"
kubectl get services -n euroweb-ultra
echo ""
echo "📡 Ingress:"
kubectl get ingress -n euroweb-ultra
echo ""
echo "🎯 Access your application:"
echo "Frontend: http://euroweb-ultra.local"
echo "API: http://api.euroweb-ultra.local"
echo ""
echo "🔍 Monitor with:"
echo "kubectl logs -f deployment/euroweb-frontend -n euroweb-ultra"
echo "kubectl logs -f deployment/euroweb-backend -n euroweb-ultra"
