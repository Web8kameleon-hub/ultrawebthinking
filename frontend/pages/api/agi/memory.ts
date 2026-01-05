// pages/api/agi/memory.ts
import fs from "fs"
import path from "path"

const filePath = path.join(process.cwd(), "memory.json")

export default function handler(req: any, res: any) {
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
