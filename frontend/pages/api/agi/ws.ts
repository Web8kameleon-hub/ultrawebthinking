// pages/api/agi/ws.ts
import { WebSocketServer } from "ws"
import { createServer } from "http"

const server = createServer()
const wss = new WebSocketServer({ server })

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    try {
      const { query } = JSON.parse(data.toString())
      const answer = `Përgjigjja për: ${query}`

      let index = 0
      const interval = setInterval(() => {
        if (index < answer.length) {
          ws.send(answer[index])
          index++
        } else {
          clearInterval(interval)
          ws.close()
        }
      }, 50)
    } catch (e) {
      ws.send("[error] Invalid input")
      ws.close()
    }
  })
})

export default function handler(req: any, res: any) {
  if (res.socket.server.wss) {
    res.end()
    return
  }
  server.listen(3000, () => {
    console.log("WebSocket server running on ws://localhost:3000/api/agi/ws")
  })
  res.socket.server.wss = wss
  res.end()
}

export const config = {
  api: {
    bodyParser: false,
  },
}


// pages/api/agi/suggest.ts
export default async function handler(req, res) {
  const { query } = req.body
  const base = query.toLowerCase()

  const suggestions = [
    "sa është ora?",
    "hap navigatorin",
    "gjej dokumentin tim",
    "ndihmë për projektin Web8",
    "aktivizo modalitetin etik",
  ].filter((s) => s.toLowerCase().includes(base))

  res.status(200).json({ suggestions })
}


// pages/api/agi/memory.ts
import fs from "fs"
import path from "path"

const filePath = path.join(process.cwd(), "memory.json")

export default function handler(req, res) {
  if (req.method === "GET") {
    if (!fs.existsSync(filePath)) return res.status(200).json({ history: [] })
    const raw = fs.readFileSync(filePath, "utf-8")
    return res.status(200).json(JSON.parse(raw))
  }

  if (req.method === "POST") {
    const { input, output } = req.body
    const newEntry = `> ${input}\nAGI: ${output}`
    const current = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf-8")).history || []
      : []

    const updated = [...current, newEntry].slice(-50)
    fs.writeFileSync(filePath, JSON.stringify({ history: updated }, null, 2))
    return res.status(200).json({ success: true })
  }

  res.status(405).end()
}
