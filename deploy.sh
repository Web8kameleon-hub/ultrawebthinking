#!/bin/bash

# EuroWeb Ultra Deployment Script
# Run this script to deploy EuroWeb with multi-language AGI support

echo "🚀 EuroWeb Ultra Deployment Starting..."
echo "🌍 Multi-language support: 13 languages"
echo "🤖 AGI Backend: Instance-based modular system"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Build and deploy
echo "🔨 Building and deploying EuroWeb Ultra..."
docker-compose up --build -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Health check
echo "🔍 Performing health check..."
if curl -f http://localhost:3001/api/health > /dev/null 2>&1; then
    echo "✅ EuroWeb Ultra is running successfully!"
    echo "📊 Dashboard: http://localhost:3001"
    echo "🌍 Multi-language support active"
    echo "🤖 AGI modules loaded"
    echo "🔒 Guardian middleware protecting"
else
    echo "❌ Health check failed. Checking logs..."
    docker-compose logs
fi

echo "📋 Available API endpoints:"
echo "  GET  /api/agi/core/status"
echo "  POST /api/agi/semantic/analyze"
echo "  GET  /api/agi/economics/analyze"
echo "  GET  /api/agi/crypto/portfolio"
echo "  GET  /sq/dashboard (Albanian)"
echo "  GET  /en/dashboard (English)"
echo "  GET  /zh/仪表板 (Chinese)"
echo "  GET  /ar/لوحة-التحكم (Arabic)"

echo "🎉 Deployment complete! Faleminderit për punën!"
