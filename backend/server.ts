/**
 * EuroWeb Platform Backend Server
 * Industrial-grade server për Web8 AGI Platform
 */

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import winston from 'winston'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'euroweb-backend' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
})

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
    }
  }
}))

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    platform: 'EuroWeb',
    version: process.env.WEB8_VERSION || '1.0.0',
    uptime: process.uptime()
  })
})

// AGI Status endpoint
app.get('/api/agi/status', (req, res) => {
  res.json({
    agi: {
      status: 'active',
      layers: 7,
      processing_speed: '2500 THz',
      memory_usage: '100% optimal',
      connections: 3500
    },
    timestamp: new Date().toISOString()
  })
})

// AGISheet endpoint
app.get('/api/agisheet/info', (req, res) => {
  res.json({
    name: 'AGISheet Kameleon',
    version: '1.0.0',
    modes: ['analysis', 'decision', 'planning', 'control', 'task', 'admin', 'industrial'],
    active_sheets: 24847,
    agi_bound_cells: 8947563
  })
})

// Socket.IO for real-time communication
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`)
  
  socket.emit('welcome', {
    message: 'Connected to EuroWeb Platform',
    server: 'AGI-Core Backend',
    timestamp: new Date().toISOString()
  })

  // AGISheet real-time updates
  socket.on('agisheet:subscribe', (data) => {
    socket.join(`agisheet:${data.sheetId}`)
    logger.info(`Client ${socket.id} subscribed to AGISheet ${data.sheetId}`)
  })

  // AGI layer updates
  socket.on('agi:layer:update', (data) => {
    socket.broadcast.emit('agi:layer:updated', data)
    logger.info(`AGI Layer ${data.layerId} updated`)
  })

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`)
  })
})

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error(err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'AGI Module not found',
    path: req.originalUrl
  })
})

const PORT = process.env.PORT || 8080

server.listen(PORT, () => {
  logger.info(`🚀 EuroWeb Backend Server started on port ${PORT}`)
  logger.info(`🧠 AGI Core initialized`)
  logger.info(`📋 AGISheet Kameleon ready`)
  logger.info(`🌐 Socket.IO server active`)
})

export default app
