import express from 'express'
import cors from 'cors'

const app = express()
const port = 3001

app.use(cors())
app.use(express.json())

app.get('/api/agi', (req, res) => {
  res.json({ status: 'OK', message: 'AGI Backend funksional!' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

app.listen(port, () => {
  console.log(`🚀 Backend running on http://localhost:${port}`)
})
