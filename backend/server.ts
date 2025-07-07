import express from "express"
import cors from "cors"
import helmet from "helmet"
import bodyParser from "body-parser"
import morgan from "morgan"
import { createServer } from "http"
import { Server as SocketIO } from "socket.io"
import { loadMemory } from "./core/memory"
import { AGICore } from "./core/core"
import { monitor } from "./core/monitor"

const app = express()
const server = createServer(app)
const io = new SocketIO(server, {
  cors: { origin: "*" }
})

const PORT = process.env.PORT || 5000

// 🔒 Middleware sigurie dhe log
app.use(helmet())
app.use(cors())
app.use(bodyParser.json())
app.use(morgan("dev"))

// 🌐 API AGI
app.post("/api/agi", async (req, res) => {
  try {
    const { input } = req.body
    if (!input) {
      return res.status(400).json({ success: false, error: "Mungon input" })
    }

    const agi = new AGICore()
    const output = await agi.run({ message: input })

    monitor.log("Layer1", "Kërkesë e suksesshme në /api/agi", { input, output })
    res.json({ success: true, output })
  } catch (error) {
    monitor.error("Layer1", "Gabim në /api/agi", error)
    res.status(500).json({ success: false, error: "Gabim i brendshëm i serverit" })
  }
})

// 📡 Socket.IO për ndërveprim live
io.on("connection", socket => {
  console.log("🔗 Klient u lidh me SocketIO")

  socket.on("agi-input", async (input: string) => {
    try {
      const agi = new AGICore()
      const response = await agi.run({ message: input })
      socket.emit("agi-response", response)
    } catch (error) {
      monitor.error("Layer2", "Gabim në socket agi-input", error)
      socket.emit("agi-error", "Gabim gjatë përpunimit")
    }
  })
})

// 🧠 Ngarko kujtesën dhe monitoro
loadMemory()
monitor.log("Layer0", "Monitor i aktivizuar nga server.ts", { type: "startup" })

// 🚀 Start server
server.listen(PORT, () => {
  console.log(`✅ WEB8-Server aktiv në portën ${PORT}`)
})
