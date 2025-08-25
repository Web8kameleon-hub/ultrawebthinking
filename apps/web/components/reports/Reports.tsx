/**
 * Reports Component - Advanced Reporting System
 * Comprehensive reporting with data export and visualization
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic
 * @license MIT
 */

'use client'

import { useState, useEffect } from 'react'

interface ReportData {
  id: string
  name: string
  type: 'financial' | 'performance' | 'user' | 'system' | 'custom'
  status: 'generating' | 'ready' | 'error' | 'scheduled'
  lastGenerated: Date
  size: number
  downloads: number
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  type: string
  fields: string[]
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom'
}

interface ReportsProps {
  reports?: ReportData[]
  templates?: ReportTemplate[]
  autoRefresh?: boolean
  className?: string
}

export function Reports({
  reports,
  templates,
  autoRefresh = true,
  className = ''
}: ReportsProps) {
  const [currentReports, setCurrentReports] = useState<ReportData[]>(
    reports ?? [
      {
        id: '1',
        name: 'Monthly Financial Report',
        type: 'financial',
        status: 'ready',
        lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 2),
        size: 2.4,
        downloads: 47
      },
      {
        id: '2',
        name: 'User Engagement Analytics',
        type: 'user',
        status: 'generating',
        lastGenerated: new Date(Date.now() - 1000 * 60 * 30),
        size: 1.8,
        downloads: 23
      },
      {
        id: '3',
        name: 'System Performance Report',
        type: 'performance',
        status: 'ready',
        lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 6),
        size: 3.2,
        downloads: 156
      },
      {
        id: '4',
        name: 'Weekly Sales Report',
        type: 'financial',
        status: 'scheduled',
        lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24),
        size: 0.9,
        downloads: 89
      },
      {
        id: '5',
        name: 'Security Audit Report',
        type: 'system',
        status: 'error',
        lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 12),
        size: 5.1,
        downloads: 12
      }
    ]
  )

  const [availableTemplates] = useState<ReportTemplate[]>(
    templates ?? [
      {
        id: 't1',
        name: 'Financial Summary',
        description: 'Comprehensive financial overview with revenue, expenses, and profit analysis',
        type: 'financial',
        fields: ['revenue', 'expenses', 'profit', 'growth'],
        frequency: 'monthly'
      },
      {
        id: 't2',
        name: 'User Activity Report',
        description: 'Detailed user engagement and behavior analytics',
        type: 'user',
        fields: ['active_users', 'sessions', 'page_views', 'bounce_rate'],
        frequency: 'weekly'
      },
      {
        id: 't3',
        name: 'Performance Metrics',
        description: 'System performance, uptime, and response time analysis',
        type: 'performance',
        fields: ['uptime', 'response_time', 'error_rate', 'throughput'],
        frequency: 'daily'
      }
    ]
  )

  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [filterType, setFilterType] = useState<string>('all')

  // Simulate auto-refresh
  useEffect(() => {
    if (!autoRefresh) {return}

    const interval = setInterval(() => {
      setCurrentReports(prev => prev.map(report => {
        if (report.status === 'generating') {
          const random = Math.random()
          if (random < 0.3) {
            return { ...report, status: 'ready' as const, lastGenerated: new Date() }
          }
        }
        return report
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'text-green-400 bg-green-400/20'
      case 'generating': return 'text-yellow-400 bg-yellow-400/20'
      case 'error': return 'text-red-400 bg-red-400/20'
      case 'scheduled': return 'text-blue-400 bg-blue-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'financial':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
        )
      case 'user':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )
      case 'performance':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        )
      case 'system':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
    }
  }

  const formatFileSize = (sizeMB: number): string => {
    return `${sizeMB.toFixed(1)} MB`
  }

  const formatLastGenerated = (date: Date): string => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m ago`
    }
    return `${minutes}m ago`
  }

  const generateReport = async (templateId: string) => {
    setIsGenerating(true)
    const template = availableTemplates.find(t => t.id === templateId)
    
    if (template) {
      const newReport: ReportData = {
        id: `r${Date.now()}`,
        name: `${template.name} - ${new Date().toLocaleDateString()}`,
        type: template.type as any,
        status: 'generating',
        lastGenerated: new Date(),
        size: Math.random() * 5 + 0.5,
        downloads: 0
      }
      
      setCurrentReports(prev => [newReport, ...prev])
      
      // Simulate generation time
      setTimeout(() => {
        setCurrentReports(prev => prev.map(report => 
          report.id === newReport.id 
            ? { ...report, status: 'ready' as const }
            : report
        ))
        setIsGenerating(false)
      }, 3000)
    }
  }

  const filteredReports = filterType === 'all' 
    ? currentReports 
    : currentReports.filter(report => report.type === filterType)

  const ReportCard = ({ report }: { report: ReportData }) => (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 hover:border-blue-500/30 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-blue-400">
            {getTypeIcon(report.type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{report.name}</h3>
            <p className="text-gray-400 text-sm capitalize">{report.type} Report</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
          {report.status === 'generating' && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
              <span>Generating</span>
            </div>
          )}
          {report.status !== 'generating' && report.status}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-gray-400 text-xs">Last Generated</p>
          <p className="text-white text-sm font-medium">{formatLastGenerated(report.lastGenerated)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Size</p>
          <p className="text-white text-sm font-medium">{formatFileSize(report.size)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Downloads</p>
          <p className="text-white text-sm font-medium">{report.downloads}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {report.status === 'ready' && (
          <>
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Download
            </button>
            <button className="px-4 py-2 border border-gray-600 hover:border-gray-500 text-gray-300 rounded-lg text-sm font-medium transition-colors">
              View
            </button>
          </>
        )}
        {report.status === 'generating' && (
          <div className="flex-1 bg-gray-700 text-gray-400 px-4 py-2 rounded-lg text-sm font-medium text-center">
            Generating...
          </div>
        )}
        {report.status === 'error' && (
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Retry
          </button>
        )}
      </div>
    </div>
  )

  const TemplateCard = ({ template }: { template: ReportTemplate }) => (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="text-blue-400">
            {getTypeIcon(template.type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">{template.name}</h3>
            <p className="text-gray-400 text-sm capitalize">{template.frequency}</p>
          </div>
        </div>
      </div>

      <p className="text-gray-300 text-sm mb-4">{template.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {template.fields.slice(0, 3).map(field => (
          <span key={field} className="px-2 py-1 bg-gray-700/50 text-gray-300 rounded-md text-xs">
            {field.replace('_', ' ')}
          </span>
        ))}
        {template.fields.length > 3 && (
          <span className="px-2 py-1 bg-gray-700/50 text-gray-400 rounded-md text-xs">
            +{template.fields.length - 3} more
          </span>
        )}
      </div>

      <button
        onClick={() => generateReport(template.id)}
        disabled={isGenerating}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
      >
        {isGenerating ? 'Generating...' : 'Generate Report'}
      </button>
    </div>
  )

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Reports</h1>
            <p className="text-gray-400 mt-1">Generate and manage comprehensive reports</p>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-gray-800 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Types</option>
              <option value="financial">Financial</option>
              <option value="user">User</option>
              <option value="performance">Performance</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Recent Reports</h2>
            <div className="text-sm text-gray-400">
              {filteredReports.length} reports
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        </div>

        {/* Templates */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Report Templates</h2>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Create Template
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTemplates.map(template => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reports
