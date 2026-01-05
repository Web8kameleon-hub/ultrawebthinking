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

