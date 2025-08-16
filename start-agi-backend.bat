@echo off
echo 🚀 Starting EuroWeb AGI Real-Time Backend Server...
echo.

cd /d "c:\Users\pc\UltraBuild\ultrawebthinking"

echo 📡 Initializing Real-Time AGI Data Transmission...
echo ⚡ Server will run on http://localhost:4000
echo 🔌 WebSocket endpoint: ws://localhost:4000
echo.

echo 🔧 Starting TypeScript backend server...
yarn tsx backend/src/realtime-server.ts

pause
