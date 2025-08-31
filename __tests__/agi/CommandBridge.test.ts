/**
 * CommandBridge Real Test Suite
 * Teston integrimin real të CommandBridge me AGI sistemin backend
 * Pa mock, pa random, pa fake – Vetëm funksione reale
 * © Web8 UltraThinking – Ledjan Ahmati
 */

import { beforeEach, describe, expect, it } from '@jest/globals'
import { CommandBridge } from '../../backend/agi/CommandBridge'

// Këto janë importime reale – sigurohu që rrugët ekzistojnë dhe funksionojnë

let commandBridge: CommandBridge

describe('🧠 CommandBridge - Real Function Tests', () => {
  beforeEach(() => {
    commandBridge = new CommandBridge()
  })

  it('ANALYZE: përpunon inputin për analizë semantike', async () => {
    const payload = {
      id: 'real-001',
      command: 'ANALYZE' as const,
      input: 'Ky është një tekst për analizë.',
      context: { source: 'test-real' }
    }

    const result = await commandBridge.processCommand(payload)

    expect(result.success).toBe(true)
    expect(result.data?.keywords?.length).toBeGreaterThan(0)
  })

  it('CLASSIFY: klasifikon inputin në kategori reale', async () => {
    const payload = {
      id: 'real-002',
      command: 'CLASSIFY' as const,
      input: 'Ky është një mesazh i zakonshëm',
      context: {}
    }

    const result = await commandBridge.processCommand(payload)

    expect(result.success).toBe(true)
    expect(result.data?.category).toBeDefined()
  })

  it('PLAN: krijon plan real veprimi', async () => {
    const payload = {
      id: 'real-003',
      command: 'PLAN' as const,
      input: 'Krijo një plan për të analizuar të dhënat',
      context: { urgency: 'high' }
    }

    const result = await commandBridge.processCommand(payload)

    expect(result.success).toBe(true)
    expect(result.data?.steps?.length).toBeGreaterThan(0)
  })

  it('EXECUTE: ekzekuton komandë të planifikuar', async () => {
    const payload = {
      id: 'real-004',
      command: 'EXECUTE' as const,
      input: 'Krijo një plan dhe ekzekuto atë',
      context: {}
    }

    const result = await commandBridge.processCommand(payload)

    expect(result.success).toBe(true)
    expect(result.data?.executed).toBe(true)
  })

  it('STATUS: kthen gjendjen aktuale të AGI Core', async () => {
    const payload = {
      id: 'real-005',
      command: 'STATUS' as const,
      input: '',
      context: {}
    }

    const result = await commandBridge.processCommand(payload)

    expect(result.success).toBe(true)
    expect(result.data?.status).toBeDefined()
  })

  it('RESET: rivendos sistemin AGI', async () => {
    const payload = {
      id: 'real-006',
      command: 'RESET' as const,
      input: '',
      context: {}
    }

    const result = await commandBridge.processCommand(payload)

    expect(result.success).toBe(true)
  })

  it('GABIM: komanda e panjohur refuzohet', async () => {
    const payload = {
      id: 'real-error-001',
      command: 'PAKONFIGURUAR' as any,
      input: 'test',
      context: {}
    }

    const result = await commandBridge.processCommand(payload)

    expect(result.success).toBe(false)
    expect(result.error).toBeDefined()
  })
})