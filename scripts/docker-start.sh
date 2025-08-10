#!/bin/sh

# EuroWeb Platform Docker Startup Script
# Starts both frontend and backend services

echo "🚀 Starting EuroWeb Platform..."
echo "📊 Version: $WEB8_VERSION"
echo "🌐 Frontend Port: $PORT"
echo "🔧 Backend Port: $BACKEND_PORT"

# Start backend server in background
echo "🔧 Starting AGI Backend Server..."
yarn tsx backend/server.ts &
BACKEND_PID=$!

# Start frontend server
echo "🌐 Starting Web8 Frontend..."
node server.js &
FRONTEND_PID=$!

# Function to handle shutdown
shutdown() {
    echo "🛑 Shutting down EuroWeb Platform..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    wait $BACKEND_PID 2>/dev/null
    wait $FRONTEND_PID 2>/dev/null
    echo "✅ EuroWeb Platform stopped gracefully"
    exit 0
}

# Trap signals for graceful shutdown
trap shutdown SIGTERM SIGINT

# Wait for processes
wait $FRONTEND_PID
wait $BACKEND_PID
