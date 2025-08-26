import { NextRequest, NextResponse } from 'next/server'

// UTT Billing System API
// Handles usage-based billing, metered charging, and cost analytics

interface UTTUsage {
    clientId: string
    operation: string
    endpoint: string
    bytesOut: number
    tier: string
    timestamp: string
}

interface BillingMetrics {
    balance: number
    monthlySpend: number
    requestsThisMonth: number
    bytesOut: string
    activeAirports: number
    tier: string
    requestsRemaining: number
    projectedCost: number
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const operation = searchParams.get('operation') || 'metrics'

        if (operation === 'metrics') {
            const mockMetrics: BillingMetrics = {
                balance: 245.67,
                monthlySpend: 87.34 + Math.random() * 5,
                requestsThisMonth: 125670 + Math.floor(Math.random() * 100),
                bytesOut: '2.4 TB',
                activeAirports: 15,
                tier: 'Enterprise',
                requestsRemaining: 374330 - Math.floor(Math.random() * 100),
                projectedCost: 92.15
            }

            const usageData = [
                { endpoint: '/api/aviation/metar', requests: 89234, cost: 45.67, percentage: 52.3 },
                { endpoint: '/api/aviation/nowcast', requests: 23456, cost: 28.90, percentage: 33.1 },
                { endpoint: '/api/aviation/taf', requests: 8967, cost: 8.45, percentage: 9.7 },
                { endpoint: '/api/edge/ingest', requests: 3456, cost: 3.12, percentage: 3.6 },
                { endpoint: '/api/alerts/webhook', requests: 557, cost: 1.20, percentage: 1.4 }
            ]

            const billingHistory = [
                { date: '2025-08-01', amount: 87.34, description: 'Monthly API Usage', status: 'paid' },
                { date: '2025-07-01', amount: 92.15, description: 'Monthly API Usage', status: 'paid' },
                { date: '2025-06-01', amount: 78.92, description: 'Monthly API Usage', status: 'paid' },
                { date: '2025-05-15', amount: 150.00, description: 'Enterprise Plan Upgrade', status: 'paid' },
                { date: '2025-05-01', amount: 45.67, description: 'Monthly API Usage', status: 'paid' }
            ]

            return NextResponse.json({
                success: true,
                data: {
                    metrics: mockMetrics,
                    usage: usageData,
                    history: billingHistory,
                    lastUpdate: new Date().toISOString()
                }
            })
        }

        return NextResponse.json({ success: false, error: 'Invalid operation' }, { status: 400 })

    } catch (error) {
        console.error('UTT billing API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch billing data'
            },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { clientId, operation, endpoint, bytesOut, tier } = body

        // Calculate cost based on tier and operation
        const tierRates = {
            'starter': 0.001,    // $0.001 per request
            'professional': 0.0008, // $0.0008 per request
            'enterprise': 0.0005    // $0.0005 per request
        }

        const rate = tierRates[tier?.toLowerCase() as keyof typeof tierRates] || tierRates.starter
        const cost = rate + (bytesOut * 0.000001) // Base rate + $0.000001 per byte

        // Simulate current balance
        const currentBalance = 245.67
        const newBalance = Math.max(0, currentBalance - cost)

        const chargeResult = {
            success: true,
            clientId,
            operation,
            endpoint,
            bytesOut,
            tier,
            timestamp: new Date().toISOString(),
            billing: {
                balanceBefore: currentBalance,
                chargeAmount: cost,
                balanceAfter: newBalance,
                rate,
                currency: 'USD'
            }
        }

        console.log(`UTT Charge: ${operation} - $${cost.toFixed(4)} for client ${clientId}`)

        return NextResponse.json(chargeResult)

    } catch (error) {
        console.error('UTT charging error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process UTT charge'
            },
            { status: 500 }
        )
    }
}
