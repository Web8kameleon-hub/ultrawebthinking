/**
 * EuroWeb Ultra - UTT/ALB Billing Engine
 * Automatic billing system for sensors, gateways, and AI reports
 * 
 * @author Ledjan Ahmati
 * @version Ultra 2.0.0 Billing
 * @license MIT
 */

export interface BillingConfig {
    currency: 'UTT' | 'ALB' | 'EURC'
    rates: {
        sensorPerMonth: number
        gatewayPerMonth: number
        blockchainTxFee: number
        aiReportBasic: number
        aiReportAdvanced: number
        enterpriseSubscription: number
    }
    billing: {
        cycleDays: number
        gracePeriodDays: number
        autoSuspendEnabled: boolean
        reminderDays: number[]
    }
    solana: {
        rpcEndpoint: string
        programId: string
        treasuryWallet: string
    }
}

export interface BillingItem {
    id: string
    type: 'sensor' | 'gateway' | 'transaction' | 'ai_report' | 'subscription'
    resourceId: string
    description: string
    quantity: number
    unitPrice: number
    totalPrice: number
    timestamp: number
    metadata?: Record<string, any>
}

export interface Invoice {
    id: string
    customerId: string
    customerWallet: string
    periodStart: number
    periodEnd: number
    items: BillingItem[]
    subtotal: number
    taxes: number
    total: number
    currency: string
    status: 'pending' | 'paid' | 'overdue' | 'cancelled'
    dueDate: number
    paidAt?: number
    transactionHash?: string
    createdAt: number
}

export interface Customer {
    id: string
    walletAddress: string
    email: string
    company?: string
    billingAddress?: {
        name: string
        street: string
        city: string
        country: string
        vatNumber?: string
    }
    subscription: {
        plan: 'basic' | 'professional' | 'enterprise'
        status: 'active' | 'suspended' | 'cancelled'
        startDate: number
        endDate?: number
    }
    paymentMethod: 'crypto' | 'fiat' | 'hybrid'
    autoPayEnabled: boolean
    createdAt: number
}

export interface UsageMetrics {
    customerId: string
    period: string // YYYY-MM
    sensors: {
        count: number
        activeHours: number
        dataPoints: number
    }
    gateways: {
        count: number
        uptime: number
        dataTransferred: number
    }
    blockchain: {
        transactions: number
        gasUsed: number
    }
    ai: {
        basicReports: number
        advancedReports: number
        gpuHours: number
    }
}

export class BillingEngine {
    private config: BillingConfig
    private customers: Map<string, Customer>
    private invoices: Map<string, Invoice>
    private usage: Map<string, UsageMetrics>

    constructor(config: BillingConfig) {
        this.config = config
        this.customers = new Map()
        this.invoices = new Map()
        this.usage = new Map()

        // Start billing cycles
        this.startBillingCycle()
        this.startUsageCollection()
    }

    /**
     * Register new customer
     */
    async registerCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Promise<Customer> {
        const customerId = this.generateCustomerId()
        const newCustomer: Customer = {
            ...customer,
            id: customerId,
            createdAt: Date.now()
        }

        this.customers.set(customerId, newCustomer)

        // Initialize usage tracking
        const currentPeriod = this.getCurrentPeriod()
        this.usage.set(`${customerId}:${currentPeriod}`, {
            customerId,
            period: currentPeriod,
            sensors: { count: 0, activeHours: 0, dataPoints: 0 },
            gateways: { count: 0, uptime: 0, dataTransferred: 0 },
            blockchain: { transactions: 0, gasUsed: 0 },
            ai: { basicReports: 0, advancedReports: 0, gpuHours: 0 }
        })

        return newCustomer
    }

    /**
     * Track sensor usage
     */
    async trackSensorUsage(
        customerId: string,
        sensorId: string,
        dataPoints: number,
        activeHours: number
    ): Promise<void> {
        const period = this.getCurrentPeriod()
        const usageKey = `${customerId}:${period}`
        let usage = this.usage.get(usageKey)

        if (!usage) {
            usage = this.initializeUsage(customerId, period)
            this.usage.set(usageKey, usage)
        }

        usage.sensors.dataPoints += dataPoints
        usage.sensors.activeHours += activeHours

        // Count unique sensors
        const uniqueSensors = new Set()
        // In production, track sensor IDs properly
        usage.sensors.count = uniqueSensors.size
    }

    /**
     * Track gateway usage
     */
    async trackGatewayUsage(
        customerId: string,
        gatewayId: string,
        uptime: number,
        dataTransferred: number
    ): Promise<void> {
        const period = this.getCurrentPeriod()
        const usageKey = `${customerId}:${period}`
        let usage = this.usage.get(usageKey)

        if (!usage) {
            usage = this.initializeUsage(customerId, period)
            this.usage.set(usageKey, usage)
        }

        usage.gateways.uptime += uptime
        usage.gateways.dataTransferred += dataTransferred
        usage.gateways.count = Math.max(usage.gateways.count, 1)
    }

    /**
     * Track blockchain transaction
     */
    async trackBlockchainTransaction(
        customerId: string,
        transactionHash: string,
        gasUsed: number
    ): Promise<void> {
        const period = this.getCurrentPeriod()
        const usageKey = `${customerId}:${period}`
        let usage = this.usage.get(usageKey)

        if (!usage) {
            usage = this.initializeUsage(customerId, period)
            this.usage.set(usageKey, usage)
        }

        usage.blockchain.transactions += 1
        usage.blockchain.gasUsed += gasUsed

        // Create immediate billing item for blockchain fee
        await this.createBillingItem(customerId, {
            id: this.generateItemId(),
            type: 'transaction',
            resourceId: transactionHash,
            description: `Blockchain transaction fee`,
            quantity: 1,
            unitPrice: this.config.rates.blockchainTxFee,
            totalPrice: this.config.rates.blockchainTxFee,
            timestamp: Date.now(),
            metadata: { gasUsed, transactionHash }
        })
    }

    /**
     * Track AI report generation
     */
    async trackAIReport(
        customerId: string,
        reportId: string,
        type: 'basic' | 'advanced',
        gpuHours: number
    ): Promise<void> {
        const period = this.getCurrentPeriod()
        const usageKey = `${customerId}:${period}`
        let usage = this.usage.get(usageKey)

        if (!usage) {
            usage = this.initializeUsage(customerId, period)
            this.usage.set(usageKey, usage)
        }

        if (type === 'basic') {
            usage.ai.basicReports += 1
        } else {
            usage.ai.advancedReports += 1
        }
        usage.ai.gpuHours += gpuHours

        // Create billing item
        const unitPrice = type === 'basic'
            ? this.config.rates.aiReportBasic
            : this.config.rates.aiReportAdvanced

        await this.createBillingItem(customerId, {
            id: this.generateItemId(),
            type: 'ai_report',
            resourceId: reportId,
            description: `AI Report (${type})`,
            quantity: 1,
            unitPrice,
            totalPrice: unitPrice,
            timestamp: Date.now(),
            metadata: { type, gpuHours, reportId }
        })
    }

    /**
     * Generate monthly invoice
     */
    async generateMonthlyInvoice(customerId: string, period: string): Promise<Invoice> {
        const customer = this.customers.get(customerId)
        if (!customer) {
            throw new Error(`Customer ${customerId} not found`)
        }

        const usage = this.usage.get(`${customerId}:${period}`)
        if (!usage) {
            throw new Error(`No usage data for customer ${customerId} in period ${period}`)
        }

        const items: BillingItem[] = []

        // Sensor fees
        if (usage.sensors.count > 0) {
            items.push({
                id: this.generateItemId(),
                type: 'sensor',
                resourceId: 'sensors',
                description: `Sensor monitoring (${usage.sensors.count} sensors)`,
                quantity: usage.sensors.count,
                unitPrice: this.config.rates.sensorPerMonth,
                totalPrice: usage.sensors.count * this.config.rates.sensorPerMonth,
                timestamp: Date.now(),
                metadata: {
                    count: usage.sensors.count,
                    dataPoints: usage.sensors.dataPoints,
                    activeHours: usage.sensors.activeHours
                }
            })
        }

        // Gateway fees
        if (usage.gateways.count > 0) {
            items.push({
                id: this.generateItemId(),
                type: 'gateway',
                resourceId: 'gateways',
                description: `Gateway services (${usage.gateways.count} gateways)`,
                quantity: usage.gateways.count,
                unitPrice: this.config.rates.gatewayPerMonth,
                totalPrice: usage.gateways.count * this.config.rates.gatewayPerMonth,
                timestamp: Date.now(),
                metadata: {
                    count: usage.gateways.count,
                    uptime: usage.gateways.uptime,
                    dataTransferred: usage.gateways.dataTransferred
                }
            })
        }

        // Subscription fee
        if (customer.subscription.status === 'active') {
            items.push({
                id: this.generateItemId(),
                type: 'subscription',
                resourceId: 'subscription',
                description: `${customer.subscription.plan} subscription`,
                quantity: 1,
                unitPrice: this.config.rates.enterpriseSubscription,
                totalPrice: this.config.rates.enterpriseSubscription,
                timestamp: Date.now(),
                metadata: { plan: customer.subscription.plan }
            })
        }

        // Calculate totals
        const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0)
        const taxes = subtotal * 0.19 // 19% VAT for EU
        const total = subtotal + taxes

        // Create invoice
        const invoice: Invoice = {
            id: this.generateInvoiceId(),
            customerId,
            customerWallet: customer.walletAddress,
            periodStart: this.getPeriodStart(period),
            periodEnd: this.getPeriodEnd(period),
            items,
            subtotal,
            taxes,
            total,
            currency: this.config.currency,
            status: 'pending',
            dueDate: Date.now() + (this.config.billing.cycleDays * 24 * 60 * 60 * 1000),
            createdAt: Date.now()
        }

        this.invoices.set(invoice.id, invoice)

        // Send payment request if auto-pay enabled
        if (customer.autoPayEnabled) {
            await this.processAutoPayment(invoice)
        }

        return invoice
    }

    /**
     * Process automatic payment
     */
    private async processAutoPayment(invoice: Invoice): Promise<void> {
        try {
            // In production, integrate with Solana wallet and smart contracts
            const transactionHash = await this.sendSolanaPayment(
                invoice.customerWallet,
                this.config.solana.treasuryWallet,
                invoice.total,
                invoice.currency
            )

            // Update invoice
            invoice.status = 'paid'
            invoice.paidAt = Date.now()
            invoice.transactionHash = transactionHash

            console.log(`Auto-payment processed for invoice ${invoice.id}: ${transactionHash}`)
        } catch (err) {
            console.error(`Auto-payment failed for invoice ${invoice.id}:`, err)
            // Send payment reminder
            await this.sendPaymentReminder(invoice)
        }
    }

    /**
     * Send Solana payment (mock implementation)
     */
    private async sendSolanaPayment(
        fromWallet: string,
        toWallet: string,
        amount: number,
        currency: string
    ): Promise<string> {
        // In production, use @solana/web3.js and @solana/spl-token
        // for actual blockchain transactions

        console.log(`Sending ${amount} ${currency} from ${fromWallet} to ${toWallet}`)

        // Mock transaction hash
        return `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    /**
     * Send payment reminder
     */
    private async sendPaymentReminder(invoice: Invoice): Promise<void> {
        const customer = this.customers.get(invoice.customerId)
        if (!customer) {return}

        console.log(`Sending payment reminder to ${customer.email} for invoice ${invoice.id}`)

        // In production, integrate with email service
        // Send email with payment link and invoice details
    }

    /**
     * Start billing cycle (runs monthly)
     */
    private startBillingCycle(): void {
        setInterval(async () => {
            const currentPeriod = this.getCurrentPeriod()
            const previousPeriod = this.getPreviousPeriod()

            // Generate invoices for all customers
            for (const [customerId, customer] of this.customers.entries()) {
                if (customer.subscription.status === 'active') {
                    try {
                        await this.generateMonthlyInvoice(customerId, previousPeriod)
                    } catch (err) {
                        console.error(`Failed to generate invoice for customer ${customerId}:`, err)
                    }
                }
            }
        }, 24 * 60 * 60 * 1000) // Daily check
    }

    /**
     * Start usage collection
     */
    private startUsageCollection(): void {
        // Real-time usage collection would be implemented here
        // This runs continuously to track sensor, gateway, and AI usage
    }

    /**
     * Create billing item
     */
    private async createBillingItem(customerId: string, item: BillingItem): Promise<void> {
        // In production, store in database
        console.log(`Billing item created for customer ${customerId}:`, item)
    }

    /**
     * Utility methods
     */
    private generateCustomerId(): string {
        return `cust_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    private generateInvoiceId(): string {
        return `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    private generateItemId(): string {
        return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    private getCurrentPeriod(): string {
        const now = new Date()
        return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
    }

    private getPreviousPeriod(): string {
        const now = new Date()
        const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        return `${previous.getFullYear()}-${(previous.getMonth() + 1).toString().padStart(2, '0')}`
    }

    private getPeriodStart(period: string): number {
        const [year, month] = period.split('-').map(Number)
        return new Date(year, month - 1, 1).getTime()
    }

    private getPeriodEnd(period: string): number {
        const [year, month] = period.split('-').map(Number)
        return new Date(year, month, 0, 23, 59, 59, 999).getTime()
    }

    private initializeUsage(customerId: string, period: string): UsageMetrics {
        return {
            customerId,
            period,
            sensors: { count: 0, activeHours: 0, dataPoints: 0 },
            gateways: { count: 0, uptime: 0, dataTransferred: 0 },
            blockchain: { transactions: 0, gasUsed: 0 },
            ai: { basicReports: 0, advancedReports: 0, gpuHours: 0 }
        }
    }

    /**
     * Get billing dashboard data
     */
    getBillingDashboard(customerId: string): {
        customer: Customer | undefined
        currentUsage: UsageMetrics | undefined
        recentInvoices: Invoice[]
        totalSpent: number
        upcomingCharges: number
    } {
        const customer = this.customers.get(customerId)
        const currentPeriod = this.getCurrentPeriod()
        const currentUsage = this.usage.get(`${customerId}:${currentPeriod}`)

        const customerInvoices = Array.from(this.invoices.values())
            .filter(inv => inv.customerId === customerId)
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 5)

        const totalSpent = customerInvoices
            .filter(inv => inv.status === 'paid')
            .reduce((sum, inv) => sum + inv.total, 0)

        // Calculate upcoming charges based on current usage
        let upcomingCharges = 0
        if (currentUsage) {
            upcomingCharges += currentUsage.sensors.count * this.config.rates.sensorPerMonth
            upcomingCharges += currentUsage.gateways.count * this.config.rates.gatewayPerMonth
            if (customer?.subscription.status === 'active') {
                upcomingCharges += this.config.rates.enterpriseSubscription
            }
        }

        return {
            customer,
            currentUsage,
            recentInvoices: customerInvoices,
            totalSpent,
            upcomingCharges
        }
    }
}

// Default production configuration
export const DEFAULT_BILLING_CONFIG: BillingConfig = {
    currency: 'ALB',
    rates: {
        sensorPerMonth: 1.5, // €1.50 per sensor/month
        gatewayPerMonth: 35, // €35 per gateway/month
        blockchainTxFee: 0.10, // €0.10 per transaction
        aiReportBasic: 75, // €75 per basic report
        aiReportAdvanced: 150, // €150 per advanced report
        enterpriseSubscription: 500 // €500 per month
    },
    billing: {
        cycleDays: 30,
        gracePeriodDays: 7,
        autoSuspendEnabled: true,
        reminderDays: [7, 3, 1] // Days before due date
    },
    solana: {
        rpcEndpoint: 'https://api.mainnet-beta.solana.com',
        programId: 'UTT7VXeKBGKwLSuoSbVKgqWXNJWzPKETt4pNBkqCwgD',
        treasuryWallet: 'EuroWeb8TreasuryWalletAddressHere123456789'
    }
}

// Export main billing engine
export const billingEngine = new BillingEngine(DEFAULT_BILLING_CONFIG)
