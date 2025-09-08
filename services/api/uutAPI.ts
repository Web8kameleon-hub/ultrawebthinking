/**
 * Real UUT (Unit Under Test) API Service
 * Connects to live testing equipment and test data
 */

export interface TestCase {
  id: string
  name: string
  description: string
  category: 'functional' | 'performance' | 'environmental' | 'safety' | 'compliance'
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped'
  priority: 'low' | 'medium' | 'high' | 'critical'
  duration: number
  startTime?: string
  endTime?: string
  parameters: Record<string, any>
  results?: TestResult[]
  timestamp: string
}

export interface TestResult {
  id: string
  testCaseId: string
  parameter: string
  expectedValue: any
  actualValue: any
  status: 'pass' | 'fail' | 'warning'
  tolerance: number
  deviation: number
  unit: string
  timestamp: string
}

export interface UUTSession {
  id: string
  name: string
  deviceSerial: string
  deviceModel: string
  operator: string
  status: 'setup' | 'testing' | 'completed' | 'aborted'
  progress: number
  totalTests: number
  passedTests: number
  failedTests: number
  startTime: string
  endTime?: string
  environment: {
    temperature: number
    humidity: number
    pressure: number
  }
  timestamp: string
}

export interface TestEquipment {
  id: string
  name: string
  type: 'multimeter' | 'oscilloscope' | 'power_supply' | 'signal_generator' | 'spectrum_analyzer'
  model: string
  status: 'idle' | 'busy' | 'error' | 'maintenance'
  connection: 'usb' | 'ethernet' | 'gpib' | 'serial'
  address: string
  calibrationDate: string
  nextCalibration: string
  timestamp: string
}

class UUTAPI {
  private baseUrl: string
  
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_UUT_API || 'https://test.ultrawebthinking.com'
  }

  /**
   * Get current UUT testing sessions
   */
  async getTestSessions(): Promise<UUTSession[]> {
    try {
      const response = await fetch(`${this.baseUrl}/sessions`, {
        headers: {
          'Authorization': `Bearer ${process.env.UUT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Sessions API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Sessions API error:', error)
      return this.getLiveSessionsFallback()
    }
  }

  /**
   * Get test cases for a specific session
   */
  async getTestCases(sessionId?: string): Promise<TestCase[]> {
    try {
      const url = sessionId ? 
        `${this.baseUrl}/sessions/${sessionId}/tests` : 
        `${this.baseUrl}/tests`
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${process.env.UUT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Test cases API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Test cases API error:', error)
      return this.getLiveTestCasesFallback()
    }
  }

  /**
   * Get test results for a specific test case
   */
  async getTestResults(testCaseId: string): Promise<TestResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tests/${testCaseId}/results`, {
        headers: {
          'Authorization': `Bearer ${process.env.UUT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Test results API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Test results API error:', error)
      return this.getLiveResultsFallback(testCaseId)
    }
  }

  /**
   * Get available test equipment
   */
  async getTestEquipment(): Promise<TestEquipment[]> {
    try {
      const response = await fetch(`${this.baseUrl}/equipment`, {
        headers: {
          'Authorization': `Bearer ${process.env.UUT_API_KEY}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Equipment API error: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Equipment API error:', error)
      return this.getLiveEquipmentFallback()
    }
  }

  /**
   * Start a new test session
   */
  async startTestSession(deviceSerial: string, deviceModel: string, operator: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.UUT_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deviceSerial,
          deviceModel,
          operator,
          timestamp: new Date().toISOString()
        })
      })
      
      if (!response.ok) {
        throw new Error(`Start session API error: ${response.status}`)
      }
      
      const result = await response.json()
      return result.sessionId
    } catch (error) {
      console.error('Start session error:', error)
      return crypto.randomUUID()
    }
  }

  /**
   * Execute a test case
   */
  async executeTest(sessionId: string, testCaseId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/sessions/${sessionId}/execute/${testCaseId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.UUT_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ timestamp: new Date().toISOString() })
      })
      
      return response.ok
    } catch (error) {
      console.error('Execute test error:', error)
      return false
    }
  }

  /**
   * Subscribe to real-time test updates
   */
  subscribeToTestUpdates(sessionId: string, callback: (data: any) => void): WebSocket | null {
    try {
      const ws = new WebSocket(`${process.env.WEBSOCKET_URL || 'wss://ws.ultrawebthinking.com'}/uut/${sessionId}`)
      
      ws.onopen = () => {
        console.log('UUT WebSocket connected')
        ws.send(JSON.stringify({ 
          action: 'subscribe', 
          sessionId 
        }))
      }
      
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data)
        callback(data)
      }
      
      ws.onerror = (error) => {
        console.error('UUT WebSocket error:', error)
      }
      
      return ws
    } catch (error) {
      console.error('WebSocket connection failed:', error)
      return null
    }
  }

  /**
   * Live test sessions fallback - returns no data when API unavailable
   */
  private getLiveSessionsFallback(): UUTSession[] {
    // Return empty array when real UUT session API is unavailable
    return []
  }

  /**
   * Live test cases fallback - returns no data when API unavailable
   */
  private getLiveTestCasesFallback(): TestCase[] {
    // Return empty array when real test case API is unavailable
    return []
  }

  /**
   * Live test results fallback - returns no data when API unavailable
   */
  private getLiveResultsFallback(testCaseId: string): TestResult[] {
    // Return empty array when real test results API is unavailable
    return []
  }

  /**
   * Live equipment fallback - returns no data when API unavailable
   */
  private getLiveEquipmentFallback(): TestEquipment[] {
    // Return empty array when real equipment API is unavailable
    return []
  }

  private getExpectedValue(parameter: string): number {
    switch (parameter) {
      case 'Voltage': return 3.3
      case 'Current': return 0.150
      case 'Frequency': return 100000000
      case 'Temperature': return 25
      case 'Resistance': return 1000
      default: return 100
    }
  }

  private getTolerance(parameter: string): number {
    switch (parameter) {
      case 'Voltage': return 0.1
      case 'Current': return 0.01
      case 'Frequency': return 1000000
      case 'Temperature': return 2
      case 'Resistance': return 50
      default: return 5
    }
  }

  private getUnit(parameter: string): string {
    switch (parameter) {
      case 'Voltage': return 'V'
      case 'Current': return 'A'
      case 'Frequency': return 'Hz'
      case 'Temperature': return '°C'
      case 'Resistance': return 'Ω'
      default: return ''
    }
  }
}

export const uutAPI = new UUTAPI()
