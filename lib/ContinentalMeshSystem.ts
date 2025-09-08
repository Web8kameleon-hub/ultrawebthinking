/**
 * EuroWeb Continental Mesh System
 * Real hierarchical mesh network implementation
 * Based on industrial command structure
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

export interface NodeMetadata {
  created: number
  status: 'ON' | 'OFF' | 'PENDING' | 'ERROR'
  lastActivity: number
  messageCount: number
  performance: number
}

export interface MeshMessage {
  id: string
  from: string
  to: string
  content: string
  timestamp: number
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
}

export class MeshNode {
  public nodeId: string
  public role: string
  public parent: MeshNode | null
  public children: MeshNode[]
  public isActive: boolean
  public metadata: NodeMetadata
  private messageHandlers: Map<string, (message: MeshMessage) => Promise<void>>

  constructor(nodeId: string, role: string, parent: MeshNode | null = null) {
    this.nodeId = nodeId
    this.role = role
    this.parent = parent
    this.children = []
    this.isActive = true
    this.messageHandlers = new Map()
    this.metadata = {
      created: Date.now(),
      status: 'ON',
      lastActivity: Date.now(),
      messageCount: 0,
      performance: 100
    }
  }

  async executeTask(): Promise<void> {
    // Simulate real processing time
    const processingTime = Math.random() * 50 + 10 // 10-60ms
    await new Promise(resolve => setTimeout(resolve, processingTime))
    
    console.log(`[AUDIT] ${this.role} ${this.nodeId} completed task | Status: OFF | Performance: ${this.metadata.performance}%`)
    
    this.isActive = false
    this.metadata.status = 'OFF'
    this.metadata.lastActivity = Date.now()
    this.metadata.performance = Math.max(0, this.metadata.performance - Math.random() * 10)
  }

  async sendMessage(content: string, priority: MeshMessage['priority'] = 'MEDIUM'): Promise<void> {
    if (this.parent) {
      const message: MeshMessage = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        from: `${this.role}_${this.nodeId}`,
        to: `${this.parent.role}_${this.parent.nodeId}`,
        content,
        timestamp: Date.now(),
        priority
      }

      console.log(`[COMM] ${message.from} → ${message.to} | Message: ${content} | Priority: ${priority}`)
      
      this.metadata.messageCount++
      this.metadata.lastActivity = Date.now()
      
      await this.parent.receiveMessage(message)
    }
  }

  async receiveMessage(message: MeshMessage): Promise<void> {
    console.log(`[COMM] ${this.role} ${this.nodeId} received message: ${message.content} from ${message.from}`)
    
    this.metadata.messageCount++
    this.metadata.lastActivity = Date.now()

    // Handle message based on priority
    switch (message.priority) {
      case 'CRITICAL':
        await this.handleCriticalMessage(message)
        break
      case 'HIGH':
        await this.handleHighPriorityMessage(message)
        break
      default:
        await this.handleStandardMessage(message)
    }

    // Forward to parent if needed
    if (this.parent && message.priority === 'CRITICAL') {
      await this.sendMessage(`FORWARDED: ${message.content}`, 'CRITICAL')
    }
  }

  private async handleCriticalMessage(message: MeshMessage): Promise<void> {
    // Immediate response required
    console.log(`[CRITICAL] ${this.nodeId} handling critical message immediately`)
    this.metadata.performance = Math.min(100, this.metadata.performance + 5)
  }

  private async handleHighPriorityMessage(message: MeshMessage): Promise<void> {
    // High priority processing
    console.log(`[HIGH] ${this.nodeId} processing high priority message`)
    this.metadata.performance = Math.min(100, this.metadata.performance + 2)
  }

  private async handleStandardMessage(message: MeshMessage): Promise<void> {
    // Standard processing
    console.log(`[STANDARD] ${this.nodeId} processing standard message`)
  }

  addChild(child: MeshNode): void {
    this.children.push(child)
    child.parent = this
  }

  getNetworkStats(): {
    totalNodes: number
    activeNodes: number
    messageCount: number
    averagePerformance: number
  } {
    let totalNodes = 1
    let activeNodes = this.isActive ? 1 : 0
    let messageCount = this.metadata.messageCount
    let performanceSum = this.metadata.performance

    const traverse = (node: MeshNode): void => {
      for (const child of node.children) {
        totalNodes++
        if (child.isActive) activeNodes++
        messageCount += child.metadata.messageCount
        performanceSum += child.metadata.performance
        traverse(child)
      }
    }

    traverse(this)

    return {
      totalNodes,
      activeNodes,
      messageCount,
      averagePerformance: performanceSum / totalNodes
    }
  }
}

export class ContinentalMeshSystem {
  private commandCenter: MeshNode
  private continents: MeshNode[]
  private allSoldiers: MeshNode[]
  private isBuilt: boolean = false

  constructor() {
    this.commandCenter = new MeshNode('Komanda-Qendrore', 'HQ')
    this.continents = []
    this.allSoldiers = []
  }

  async buildContinentalMesh(): Promise<{
    commandCenter: MeshNode
    continents: MeshNode[]
    soldiers: MeshNode[]
  }> {
    console.log('🌍 Building Continental Mesh Network...')

    // Create continental command centers
    const continentNames = [
      'Komanda-Amerika',
      'Komanda-Europa', 
      'Komanda-Azia',
      'Komanda-Afrika',
      'Komanda-Oqeania',
      'Komanda-Antartida'
    ]

    this.continents = continentNames.map(name => {
      const continent = new MeshNode(name, 'Kontinent')
      this.commandCenter.addChild(continent)
      return continent
    })

    // Build hierarchical structure
    let currentLayer = this.continents
    const roles = ['Divizion', 'Brigade', 'Batalion', 'Kompani', 'Toge', 'Ushtar']

    for (const role of roles) {
      const nextLayer: MeshNode[] = []
      
      for (const node of currentLayer) {
        const child = new MeshNode(`${role}-${node.nodeId}`, role)
        node.addChild(child)
        nextLayer.push(child)
        
        if (role === 'Ushtar') {
          this.allSoldiers.push(child)
        }
      }
      
      currentLayer = nextLayer
    }

    // Execute tasks for all soldiers
    console.log(`⚔️ Executing tasks for ${this.allSoldiers.length} soldiers...`)
    await Promise.all(this.allSoldiers.map(soldier => soldier.executeTask()))

    // Test communication
    console.log('📡 Testing mesh communication...')
    await this.continents[1]?.sendMessage('Urdhër nga Komanda-Qendrore!', 'HIGH')

    this.isBuilt = true
    console.log('✅ Continental Mesh Network built successfully!')

    return {
      commandCenter: this.commandCenter,
      continents: this.continents,
      soldiers: this.allSoldiers
    }
  }

  async runIndustrialTests(): Promise<boolean> {
    if (!this.isBuilt) {
      await this.buildContinentalMesh()
    }

    console.log('🔧 Running Industrial Mesh Tests...')

    try {
      // Test 1: Verify continental structure
      if (this.commandCenter.children.length !== 6) {
        throw new Error(`Expected 6 continents, got ${this.commandCenter.children.length}`)
      }

      // Test 2: Verify hierarchical structure
      for (const continent of this.continents) {
        let node = continent
        for (let i = 0; i < 6; i++) {
          if (node.children.length !== 1) {
            throw new Error(`Role ${node.role} should have exactly 1 child, got ${node.children.length}`)
          }
          node = node.children[0]
        }
      }

      // Test 3: Verify soldier states
      for (const soldier of this.allSoldiers) {
        if (soldier.isActive) {
          throw new Error(`Soldier ${soldier.nodeId} should be inactive after task execution`)
        }
        if (soldier.metadata.status !== 'OFF') {
          throw new Error(`Soldier ${soldier.nodeId} metadata status should be OFF`)
        }
      }

      // Test 4: Performance metrics
      const stats = this.commandCenter.getNetworkStats()
      console.log('📊 Network Statistics:', stats)

      console.log('✅ All industrial mesh tests passed successfully!')
      return true

    } catch (error) {
      console.error('❌ Industrial mesh tests failed:', error)
      return false
    }
  }

  getSystemStatus(): {
    isBuilt: boolean
    totalNodes: number
    activeNodes: number
    continents: string[]
    performance: number
    lastActivity: number
  } {
    if (!this.isBuilt) {
      return {
        isBuilt: false,
        totalNodes: 0,
        activeNodes: 0,
        continents: [],
        performance: 0,
        lastActivity: 0
      }
    }

    const stats = this.commandCenter.getNetworkStats()
    
    return {
      isBuilt: this.isBuilt,
      totalNodes: stats.totalNodes,
      activeNodes: stats.activeNodes,
      continents: this.continents.map(c => c.nodeId),
      performance: stats.averagePerformance,
      lastActivity: Math.max(...this.allSoldiers.map(s => s.metadata.lastActivity))
    }
  }

  async sendGlobalMessage(message: string, priority: MeshMessage['priority'] = 'MEDIUM'): Promise<void> {
    console.log(`🌍 Broadcasting global message: ${message}`)
    
    await Promise.all(
      this.continents.map(continent => 
        continent.sendMessage(`GLOBAL: ${message}`, priority)
      )
    )
  }

  getContinentalStats(): Array<{
    continent: string
    nodes: number
    active: number
    messages: number
    performance: number
  }> {
    return this.continents.map(continent => {
      const stats = continent.getNetworkStats()
      return {
        continent: continent.nodeId,
        nodes: stats.totalNodes,
        active: stats.activeNodes,
        messages: stats.messageCount,
        performance: stats.averagePerformance
      }
    })
  }
}

// Export singleton instance
export const globalMeshSystem = new ContinentalMeshSystem()
