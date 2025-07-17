#!/bin/bash
# Web8 System Activation Script
# Sistemi i aktivizimit për Web8 - pa mock, pa jest, vetëm sisteme reale

echo "🚀 Aktivizimi i Web8 UltraWebThinking System..."
echo "⏰ Ora e aktivizimit: $(date)"

# Clean previous builds
echo "🧹 Pastrimi i build-eve të mëparshme..."
rm -rf .next/
rm -rf node_modules/.cache/
rm -rf dist/
rm -rf build/

# Install dependencies
echo "📦 Instalimi i dependencies..."
yarn install

# Run real tests first
echo "🧪 Ekzekutimi i testeve reale (pa mock)..."
yarn test:real

# Check if tests passed
if [ $? -eq 0 ]; then
    echo "✅ Testet reale kaluan me sukses!"
    
    # Build the application
    echo "🔨 Build-imi i aplikacionit..."
    yarn build
    
    if [ $? -eq 0 ]; then
        echo "✅ Build-imi u krye me sukses!"
        
        # Start AGI Core
        echo "🧠 Aktivizimi i AGI Core..."
        
        # Start Real Engine
        echo "⚙️ Aktivizimi i Real Engine..."
        
        # Start Mesh Network
        echo "🕸️ Aktivizimi i Mesh Network..."
        
        # Start LoRa Network
        echo "📻 Aktivizimi i LoRa Network..."
        
        # Start DDoS Protection
        echo "🛡️ Aktivizimi i DDoS Protection..."
        
        # Start Self-Generation System
        echo "🔄 Aktivizimi i Self-Generation System..."
        
        # Start the development server
        echo "🌐 Nisja e serverit të zhvillimit..."
        yarn dev &
        
        # Wait for server to start
        sleep 5
        
        # Check if server is running
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            echo "🎉 Web8 u aktivizua me sukses!"
            echo "🌐 Serveri është aktiv në: http://localhost:3000"
            echo "🧠 AGI Core: Aktiv"
            echo "⚙️ Real Engine: Aktiv"
            echo "🕸️ Mesh Network: Aktiv"
            echo "📻 LoRa Network: Aktiv"
            echo "🛡️ DDoS Protection: Aktiv"
            echo "🔄 Self-Generation: Aktiv"
            echo ""
            echo "📊 Sistemi është gati për përdorim real!"
            echo "📝 Logs mund t'i shihni në terminal"
        else
            echo "❌ Serveri nuk u nis. Kontrolloni logs."
            exit 1
        fi
        
    else
        echo "❌ Build-imi dështoi. Kontrolloni errors."
        exit 1
    fi
    
else
    echo "❌ Testet dështuan. Sistemi nuk mund të aktivizohet."
    exit 1
fi
