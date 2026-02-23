/**
 * EuroWeb Ultra - Observability Dashboard
 * Real-time monitoring, metrics, and analytics platform
 * 
 * @author Ledjan Ahmati
 * @version Ultra 2.0.0 Observability
 * @license MIT
 */

export interface MetricValue {
    timestamp: number
    value: number
    tags?: Record<string, string>
    metadata?: Record<string, any>
}

export interface MetricDefinition {
    name: string
    type: 'counter' | 'gauge' | 'histogram' | 'summary'
    unit: string
    description: string
    labels: string[]
    retention: number // days
    aggregations: ('sum' | 'avg' | 'min' | 'max' | 'p50' | 'p95' | 'p99')[]
}

export interface Alert {
    id: string
    name: string
    metric: string
    condition: {
        operator: '>' | '<' | '=' | '!=' | '>=' | '<='
        threshold: number
        duration: number // seconds
    }
    severity: 'info' | 'warning' | 'error' | 'critical'
    status: 'active' | 'resolved' | 'suppressed'
    channels: ('email' | 'slack' | 'sms' | 'webhook')[]
    lastTriggered?: number
    resolvedAt?: number
    message: string
}

export interface Dashboard {
    id: string
    name: string
    description: string
    tags: string[]
    panels: Panel[]
    timeRange: {
        from: string // relative time like "-1h" or absolute timestamp
        to: string
        refresh: number // seconds
    }
    variables: Record<string, any>
    createdBy: string
    createdAt: number
    updatedAt: number
}

export interface Panel {
    id: string
    title: string
    type: 'graph' | 'singlestat' | 'table' | 'heatmap' | 'gauge' | 'logs'
    position: { x: number, y: number, w: number, h: number }
    queries: Query[]
    visualization: {
        colors: string[]
        thresholds: Array<{ value: number, color: string }>
        yAxis: { min?: number, max?: number, unit: string }
        legend: boolean
    }
    alerts?: string[] // Alert IDs
}

export interface Query {
    id: string
    metric: string
    filters: Record<string, string>
    aggregation: string
    groupBy: string[]
    timeRange?: { from: string, to: string }
}

export interface LogEntry {
    timestamp: number
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal'
    message: string
    service: string
    component: string
    traceId?: string
    spanId?: string
    userId?: string
    sessionId?: string
    metadata: Record<string, any>
    tags: Record<string, string>
}

export interface Trace {
    traceId: string
    spans: Span[]
    duration: number
    startTime: number
    endTime: number
    services: string[]
    errors: number
    status: 'success' | 'error' | 'timeout'
}

export interface Span {
    spanId: string
    parentSpanId?: string
    operationName: string
    service: string
    startTime: number
    duration: number
    tags: Record<string, string>
    logs: Array<{ timestamp: number, fields: Record<string, any> }>
    status: 'ok' | 'error' | 'timeout'
}

export class ObservabilityEngine {
    private metrics: Map<string, MetricValue[]>
    private metricDefinitions: Map<string, MetricDefinition>
    private alerts: Map<string, Alert>
    private dashboards: Map<string, Dashboard>
    private logs: LogEntry[]
    private traces: Map<string, Trace>
    private activeAlerts: Set<string>

    // Storage and aggregation
    private aggregationIntervals: Map<string, NodeJS.Timeout>
    private retentionCleanup!: NodeJS.Timeout

    constructor() {
        this.metrics = new Map()
        this.metricDefinitions = new Map()
        this.alerts = new Map()
        this.dashboards = new Map()
        this.logs = []
        this.traces = new Map()
        this.activeAlerts = new Set()
        this.aggregationIntervals = new Map()

        this.initializeSystemMetrics()
        this.startAggregation()
        this.startRetentionCleanup()
        this.createDefaultDashboards()
    }

    /**
     * Initialize system metrics
     */
    private initializeSystemMetrics(): void {
        const systemMetrics: MetricDefinition[] = [
            {
                name: 'cpu_usage_percent',
                type: 'gauge',
                unit: 'percent',
                description: 'CPU usage percentage',
                labels: ['host', 'core'],
                retention: 30,
                aggregations: ['avg', 'max', 'p95']
            },
            {
                name: 'memory_usage_bytes',
                type: 'gauge',
                unit: 'bytes',
                description: 'Memory usage in bytes',
                labels: ['host', 'type'],
                retention: 30,
                aggregations: ['avg', 'max']
            },
            {
                name: 'network_bytes_total',
                type: 'counter',
                unit: 'bytes',
                description: 'Total network bytes transferred',
                labels: ['host', 'interface', 'direction'],
                retention: 90,
                aggregations: ['sum']
            },
            {
                name: 'http_requests_total',
                type: 'counter',
                unit: 'requests',
                description: 'Total HTTP requests',
                labels: ['method', 'status', 'endpoint'],
                retention: 90,
                aggregations: ['sum']
            },
            {
                name: 'http_request_duration_seconds',
                type: 'histogram',
                unit: 'seconds',
                description: 'HTTP request duration',
                labels: ['method', 'endpoint'],
                retention: 30,
                aggregations: ['avg', 'p50', 'p95', 'p99']
            },
            {
                name: 'database_connections_active',
                type: 'gauge',
                unit: 'connections',
                description: 'Active database connections',
                labels: ['database', 'pool'],
                retention: 30,
                aggregations: ['avg', 'max']
            },
            {
                name: 'mesh_nodes_active',
                type: 'gauge',
                unit: 'nodes',
                description: 'Active mesh network nodes',
                labels: ['mesh_id', 'node_type'],
                retention: 30,
                aggregations: ['sum', 'avg']
            },
            {
                name: 'agi_tasks_total',
                type: 'counter',
                unit: 'tasks',
                description: 'Total AGI tasks processed',
                labels: ['type', 'status', 'agent'],
                retention: 90,
                aggregations: ['sum']
            },
            {
                name: 'security_events_total',
                type: 'counter',
                unit: 'events',
                description: 'Security events detected',
                labels: ['type', 'severity', 'source'],
                retention: 365,
                aggregations: ['sum']
            }
        ]

        for (const metric of systemMetrics) {
            this.metricDefinitions.set(metric.name, metric)
            this.metrics.set(metric.name, [])
        }
    }

    /**
     * Record metric value
     */
    recordMetric(name: string, value: number, tags: Record<string, string> = {}): void {
        const definition = this.metricDefinitions.get(name)
        if (!definition) {
            console.warn(`Metric ${name} not defined`)
            return
        }

        const metricValue: MetricValue = {
            timestamp: Date.now(),
            value,
            tags,
            metadata: {}
        }

        const values = this.metrics.get(name) ?? []
        values.push(metricValue)
        this.metrics.set(name, values)

        // Check alerts
        this.checkAlertsForMetric(name, metricValue)
    }

    /**
     * Query metrics with time range and aggregation
     */
    queryMetrics(query: Query): MetricValue[] {
        const values = this.metrics.get(query.metric) ?? []

        // Apply time range filter
        let filtered = values
        if (query.timeRange) {
            const from = this.parseTimeRange(query.timeRange.from)
            const to = this.parseTimeRange(query.timeRange.to)
            filtered = values.filter(v => v.timestamp >= from && v.timestamp <= to)
        }

        // Apply tag filters
        if (Object.keys(query.filters).length > 0) {
            filtered = filtered.filter(value => {
                if (!value.tags) {return false}
                return Object.entries(query.filters).every(([key, val]) =>
                    value.tags![key] === val
                )
            })
        }

        // Group by labels if specified
        if (query.groupBy.length > 0) {
            // Implementation would group values by specified labels
            // For now, return filtered values
        }

        // Apply aggregation
        if (query.aggregation && query.aggregation !== 'none') {
            // Implementation would aggregate values
            // For now, return filtered values
        }

        return filtered
    }

    /**
     * Create alert
     */
    createAlert(alert: Omit<Alert, 'id' | 'status'>): string {
        const id = this.generateAlertId()
        const newAlert: Alert = {
            ...alert,
            id,
            status: 'active'
        }

        this.alerts.set(id, newAlert)
        console.log(`Alert ${alert.name} created with ID ${id}`)

        return id
    }

    /**
     * Check alerts for specific metric
     */
    private checkAlertsForMetric(metricName: string, value: MetricValue): void {
        for (const alert of this.alerts.values()) {
            if (alert.metric !== metricName || alert.status !== 'active') {continue}

            const shouldTrigger = this.evaluateAlertCondition(alert, value)

            if (shouldTrigger && !this.activeAlerts.has(alert.id)) {
                this.triggerAlert(alert, value)
            } else if (!shouldTrigger && this.activeAlerts.has(alert.id)) {
                this.resolveAlert(alert)
            }
        }
    }

    /**
     * Evaluate alert condition
     */
    private evaluateAlertCondition(alert: Alert, value: MetricValue): boolean {
        const { operator, threshold } = alert.condition

        switch (operator) {
            case '>': return value.value > threshold
            case '<': return value.value < threshold
            case '>=': return value.value >= threshold
            case '<=': return value.value <= threshold
            case '=': return value.value === threshold
            case '!=': return value.value !== threshold
            default: return false
        }
    }

    /**
     * Trigger alert
     */
    private async triggerAlert(alert: Alert, value: MetricValue): Promise<void> {
        this.activeAlerts.add(alert.id)
        alert.lastTriggered = Date.now()

        console.log(`🚨 ALERT TRIGGERED: ${alert.name}`)
        console.log(`Metric: ${alert.metric} = ${value.value}`)
        console.log(`Condition: ${alert.condition.operator} ${alert.condition.threshold}`)
        console.log(`Severity: ${alert.severity}`)

        // Send notifications
        for (const channel of alert.channels) {
            await this.sendNotification(channel, alert, value)
        }

        // Log alert event
        this.logEvent({
            timestamp: Date.now(),
            level: alert.severity === 'critical' ? 'error' : 'warn',
            message: `Alert triggered: ${alert.name}`,
            service: 'observability',
            component: 'alerting',
            metadata: {
                alertId: alert.id,
                metric: alert.metric,
                value: value.value,
                threshold: alert.condition.threshold
            },
            tags: {
                alert: alert.id,
                severity: alert.severity,
                metric: alert.metric
            }
        })
    }

    /**
     * Resolve alert
     */
    private resolveAlert(alert: Alert): void {
        this.activeAlerts.delete(alert.id)
        alert.resolvedAt = Date.now()

        console.log(`✅ ALERT RESOLVED: ${alert.name}`)

        this.logEvent({
            timestamp: Date.now(),
            level: 'info',
            message: `Alert resolved: ${alert.name}`,
            service: 'observability',
            component: 'alerting',
            metadata: {
                alertId: alert.id,
                duration: (alert.resolvedAt - (alert.lastTriggered ?? 0)) / 1000
            },
            tags: {
                alert: alert.id,
                status: 'resolved'
            }
        })
    }

    /**
     * Send notification
     */
    private async sendNotification(channel: string, alert: Alert, value: MetricValue): Promise<void> {
        switch (channel) {
            case 'email':
                console.log(`📧 Email notification: ${alert.name}`)
                break
            case 'slack':
                console.log(`💬 Slack notification: ${alert.name}`)
                break
            case 'sms':
                console.log(`📱 SMS notification: ${alert.name}`)
                break
            case 'webhook':
                console.log(`🔗 Webhook notification: ${alert.name}`)
                break
        }
    }

    /**
     * Log event
     */
    logEvent(entry: Omit<LogEntry, 'timestamp'> & { timestamp?: number }): void {
        const logEntry: LogEntry = {
            timestamp: Date.now(),
            ...entry
        }

        this.logs.push(logEntry)

        // Console output for development
        const timestamp = new Date(logEntry.timestamp).toISOString()
        const level = logEntry.level.toUpperCase().padEnd(5)
        console.log(`[${timestamp}] ${level} ${logEntry.service}:${logEntry.component} - ${logEntry.message}`)

        // Cleanup old logs (keep last 10000)
        if (this.logs.length > 10000) {
            this.logs = this.logs.slice(-10000)
        }
    }

    /**
     * Query logs
     */
    queryLogs(filters: {
        level?: string[]
        service?: string[]
        component?: string[]
        message?: string
        timeRange?: { from: string, to: string }
        limit?: number
    }): LogEntry[] {
        let filtered = [...this.logs]

        // Apply filters
        if (filters.level) {
            filtered = filtered.filter(log => filters.level!.includes(log.level))
        }

        if (filters.service) {
            filtered = filtered.filter(log => filters.service!.includes(log.service))
        }

        if (filters.component) {
            filtered = filtered.filter(log => filters.component!.includes(log.component))
        }

        if (filters.message) {
            filtered = filtered.filter(log =>
                log.message.toLowerCase().includes(filters.message!.toLowerCase())
            )
        }

        if (filters.timeRange) {
            const from = this.parseTimeRange(filters.timeRange.from)
            const to = this.parseTimeRange(filters.timeRange.to)
            filtered = filtered.filter(log => log.timestamp >= from && log.timestamp <= to)
        }

        // Sort by timestamp (newest first)
        filtered.sort((a, b) => b.timestamp - a.timestamp)

        // Apply limit
        if (filters.limit) {
            filtered = filtered.slice(0, filters.limit)
        }

        return filtered
    }

    /**
     * Start trace
     */
    startTrace(traceId: string, operationName: string, service: string): string {
        const spanId = this.generateSpanId()

        const span: Span = {
            spanId,
            operationName,
            service,
            startTime: Date.now(),
            duration: 0,
            tags: {},
            logs: [],
            status: 'ok'
        }

        const trace: Trace = {
            traceId,
            spans: [span],
            duration: 0,
            startTime: Date.now(),
            endTime: 0,
            services: [service],
            errors: 0,
            status: 'success'
        }

        this.traces.set(traceId, trace)
        return spanId
    }

    /**
     * Finish trace
     */
    finishTrace(traceId: string, status: 'success' | 'error' | 'timeout' = 'success'): void {
        const trace = this.traces.get(traceId)
        if (!trace) {return}

        const now = Date.now()
        trace.endTime = now
        trace.duration = now - trace.startTime
        trace.status = status

        // Update all spans
        for (const span of trace.spans) {
            if (span.duration === 0) {
                span.duration = now - span.startTime
            }
        }

        // Record trace metrics
        this.recordMetric('trace_duration_seconds', trace.duration / 1000, {
            service: trace.services[0],
            status
        })

        this.recordMetric('trace_spans_total', trace.spans.length, {
            service: trace.services[0],
            status
        })
    }

    /**
     * Create dashboard
     */
    createDashboard(dashboard: Omit<Dashboard, 'id' | 'createdAt' | 'updatedAt'>): string {
        const id = this.generateDashboardId()
        const newDashboard: Dashboard = {
            ...dashboard,
            id,
            createdAt: Date.now(),
            updatedAt: Date.now()
        }

        this.dashboards.set(id, newDashboard)
        return id
    }

    /**
     * Get dashboard data
     */
    getDashboardData(dashboardId: string): any {
        const dashboard = this.dashboards.get(dashboardId)
        if (!dashboard) {return null}

        const data = {
            dashboard,
            panels: dashboard.panels.map(panel => ({
                ...panel,
                data: panel.queries.map(query => ({
                    query,
                    values: this.queryMetrics(query)
                }))
            }))
        }

        return data
    }

    /**
     * Create default dashboards
     */
    private createDefaultDashboards(): void {
        // System Overview Dashboard
        this.createDashboard({
            name: 'System Overview',
            description: 'High-level system metrics and health indicators',
            tags: ['system', 'overview'],
            panels: [
                {
                    id: 'cpu-usage',
                    title: 'CPU Usage',
                    type: 'graph',
                    position: { x: 0, y: 0, w: 6, h: 4 },
                    queries: [{
                        id: 'cpu-query',
                        metric: 'cpu_usage_percent',
                        filters: {},
                        aggregation: 'avg',
                        groupBy: ['host']
                    }],
                    visualization: {
                        colors: ['#1f77b4'],
                        thresholds: [
                            { value: 80, color: 'orange' },
                            { value: 90, color: 'red' }
                        ],
                        yAxis: { min: 0, max: 100, unit: '%' },
                        legend: true
                    }
                },
                {
                    id: 'memory-usage',
                    title: 'Memory Usage',
                    type: 'graph',
                    position: { x: 6, y: 0, w: 6, h: 4 },
                    queries: [{
                        id: 'memory-query',
                        metric: 'memory_usage_bytes',
                        filters: {},
                        aggregation: 'avg',
                        groupBy: ['host']
                    }],
                    visualization: {
                        colors: ['#ff7f0e'],
                        thresholds: [],
                        yAxis: { unit: 'bytes' },
                        legend: true
                    }
                }
            ],
            timeRange: {
                from: '-1h',
                to: 'now',
                refresh: 30
            },
            variables: {},
            createdBy: 'system'
        })

        // Application Performance Dashboard
        this.createDashboard({
            name: 'Application Performance',
            description: 'Application-specific metrics and performance indicators',
            tags: ['application', 'performance'],
            panels: [
                {
                    id: 'http-requests',
                    title: 'HTTP Requests/sec',
                    type: 'graph',
                    position: { x: 0, y: 0, w: 8, h: 4 },
                    queries: [{
                        id: 'http-query',
                        metric: 'http_requests_total',
                        filters: {},
                        aggregation: 'sum',
                        groupBy: ['method', 'status']
                    }],
                    visualization: {
                        colors: ['#2ca02c', '#d62728'],
                        thresholds: [],
                        yAxis: { unit: 'req/s' },
                        legend: true
                    }
                },
                {
                    id: 'response-time',
                    title: 'Response Time',
                    type: 'graph',
                    position: { x: 8, y: 0, w: 4, h: 4 },
                    queries: [{
                        id: 'response-query',
                        metric: 'http_request_duration_seconds',
                        filters: {},
                        aggregation: 'p95',
                        groupBy: ['endpoint']
                    }],
                    visualization: {
                        colors: ['#9467bd'],
                        thresholds: [
                            { value: 1, color: 'orange' },
                            { value: 5, color: 'red' }
                        ],
                        yAxis: { unit: 's' },
                        legend: true
                    }
                }
            ],
            timeRange: {
                from: '-1h',
                to: 'now',
                refresh: 30
            },
            variables: {},
            createdBy: 'system'
        })
    }

    /**
     * Start aggregation processes
     */
    private startAggregation(): void {
        // Aggregate metrics every minute
        const aggregationInterval = setInterval(() => {
            this.aggregateMetrics()
        }, 60000)

        this.aggregationIntervals.set('main', aggregationInterval)
    }

    /**
     * Aggregate metrics for better performance
     */
    private aggregateMetrics(): void {
        const now = Date.now()
        const oneHourAgo = now - 60 * 60 * 1000

        for (const [metricName, values] of this.metrics.entries()) {
            const definition = this.metricDefinitions.get(metricName)
            if (!definition) {continue}

            // Get values from last hour
            const recentValues = values.filter(v => v.timestamp >= oneHourAgo)

            // Group by 5-minute intervals
            const intervals = new Map<number, MetricValue[]>()
            for (const value of recentValues) {
                const intervalStart = Math.floor(value.timestamp / (5 * 60 * 1000)) * (5 * 60 * 1000)
                if (!intervals.has(intervalStart)) {
                    intervals.set(intervalStart, [])
                }
                intervals.get(intervalStart)!.push(value)
            }

            // Create aggregated values
            const aggregated: MetricValue[] = []
            for (const [intervalStart, intervalValues] of intervals.entries()) {
                if (intervalValues.length === 0) {continue}

                const avgValue = intervalValues.reduce((sum, v) => sum + v.value, 0) / intervalValues.length
                aggregated.push({
                    timestamp: intervalStart,
                    value: avgValue,
                    tags: { aggregated: 'true', interval: '5m' },
                    metadata: { originalCount: intervalValues.length }
                })
            }

            // Replace with aggregated values (keep original for recent data)
            const cutoff = now - 30 * 60 * 1000 // Keep last 30 minutes raw
            const filtered = values.filter(v => v.timestamp >= cutoff)
            const oldAggregated = aggregated.filter(v => v.timestamp < cutoff)

            this.metrics.set(metricName, [...oldAggregated, ...filtered])
        }
    }

    /**
     * Start retention cleanup
     */
    private startRetentionCleanup(): void {
        this.retentionCleanup = setInterval(() => {
            this.cleanupOldData()
        }, 24 * 60 * 60 * 1000) // Daily cleanup
    }

    /**
     * Cleanup old data based on retention policies
     */
    private cleanupOldData(): void {
        const now = Date.now()

        // Cleanup metrics
        for (const [metricName, values] of this.metrics.entries()) {
            const definition = this.metricDefinitions.get(metricName)
            if (!definition) {continue}

            const retentionMs = definition.retention * 24 * 60 * 60 * 1000
            const cutoff = now - retentionMs

            const filtered = values.filter(v => v.timestamp >= cutoff)
            this.metrics.set(metricName, filtered)
        }

        // Cleanup logs (keep last 7 days)
        const logCutoff = now - 7 * 24 * 60 * 60 * 1000
        this.logs = this.logs.filter(log => log.timestamp >= logCutoff)

        // Cleanup traces (keep last 3 days)
        const traceCutoff = now - 3 * 24 * 60 * 60 * 1000
        for (const [traceId, trace] of this.traces.entries()) {
            if (trace.startTime < traceCutoff) {
                this.traces.delete(traceId)
            }
        }
    }

    /**
     * Get system health summary
     */
    getHealthSummary(): {
        status: 'healthy' | 'warning' | 'critical'
        metrics: { name: string, value: number, status: string }[]
        alerts: { active: number, critical: number }
        uptime: number
        version: string
    } {
        const activeAlertCount = this.activeAlerts.size
        const criticalAlerts = Array.from(this.alerts.values())
            .filter(a => a.severity === 'critical' && this.activeAlerts.has(a.id)).length

        let status: 'healthy' | 'warning' | 'critical' = 'healthy'
        if (criticalAlerts > 0) {status = 'critical'}
        else if (activeAlertCount > 0) {status = 'warning'}

        return {
            status,
            metrics: [
                { name: 'Total Metrics', value: this.metrics.size, status: 'ok' },
                { name: 'Active Alerts', value: activeAlertCount, status: activeAlertCount > 0 ? 'warning' : 'ok' },
                { name: 'Log Entries', value: this.logs.length, status: 'ok' },
                { name: 'Active Traces', value: this.traces.size, status: 'ok' }
            ],
            alerts: {
                active: activeAlertCount,
                critical: criticalAlerts
            },
            uptime: process.uptime(),
            version: '2.0.0-ultra'
        }
    }

    /**
     * Utility methods
     */
    private parseTimeRange(timeRange: string): number {
        if (timeRange === 'now') {return Date.now()}

        const match = timeRange.match(/^-(\d+)([smhd])$/)
        if (!match) {return Date.now()}

        const [, amount, unit] = match
        const multipliers = { s: 1000, m: 60000, h: 3600000, d: 86400000 }
        return Date.now() - parseInt(amount) * multipliers[unit as keyof typeof multipliers]
    }

    private generateAlertId(): string {
        return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    }

    private generateDashboardId(): string {
        return `dashboard_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`
    }

    private generateSpanId(): string {
        return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
}

// Default observability instance
export const observability = new ObservabilityEngine()

// Convenience functions
export function recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    observability.recordMetric(name, value, tags)
}

export function logInfo(message: string, service: string, component: string, metadata?: Record<string, any>): void {
    observability.logEvent({
        level: 'info',
        message,
        service,
        component,
        metadata: metadata ?? {},
        tags: {}
    })
}

export function logError(message: string, service: string, component: string, error?: Error): void {
    observability.logEvent({
        level: 'error',
        message,
        service,
        component,
        metadata: error ? { error: error.message, stack: error.stack } : {},
        tags: {}
    })
}

export function createAlert(name: string, metric: string, threshold: number, severity: Alert['severity'] = 'warning'): string {
    return observability.createAlert({
        name,
        metric,
        condition: { operator: '>', threshold, duration: 60 },
        severity,
        channels: ['email'],
        message: `${metric} exceeded threshold of ${threshold}`
    })
}
