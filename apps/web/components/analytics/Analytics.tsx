/**
 * Analytics Component - Advanced Analytics and Reporting
 * Comprehensive analytics dashboard with charts and insights
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 2.0.0 Dynamic
 * @license MIT
 */

'use client'

import { useState, useEffect } from 'react'

interface AnalyticsData {
  pageViews: number[]
  users: number[]
  revenue: number[]
  conversion: number[]
  labels: string[]
}

interface AnalyticsMetrics {
  totalPageViews: number
  uniqueUsers: number
  avgSessionDuration: number
  bounceRate: number
  conversionRate: number
  topPages: Array<{ page: string; views: number }>
  trafficSources: Array<{ source: string; percentage: number }>
}

interface AnalyticsProps {
  data?: AnalyticsData
  metrics?: AnalyticsMetrics
  timeRange?: '7d' | '30d' | '90d' | '1y'
  realTime?: boolean
  className?: string
}

export function Analytics({
  data,
  metrics,
  timeRange = '30d',
  realTime = true,
  className = ''
}: AnalyticsProps) {
  const [currentMetrics, setCurrentMetrics] = useState<AnalyticsMetrics>(
    metrics ?? {
      totalPageViews: 145892,
      uniqueUsers: 28547,
      avgSessionDuration: 245,
      bounceRate: 32.5,
      conversionRate: 4.8,
      topPages: [
        { page: '/dashboard', views: 12847 },
        { page: '/products', views: 9234 },
        { page: '/analytics', views: 7891 },
        { page: '/settings', views: 5632 },
        { page: '/profile', views: 4521 }
      ],
      trafficSources: [
        { source: 'Direct', percentage: 42.3 },
        { source: 'Search', percentage: 28.7 },
        { source: 'Social', percentage: 15.2 },
        { source: 'Referral', percentage: 13.8 }
      ]
    }
  )

  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRange)
  const [isLoading, setIsLoading] = useState(false)

  // Simulate real-time updates
  useEffect(() => {
    if (!realTime) {return}

    const interval = setInterval(() => {
      setCurrentMetrics(prev => ({
        ...prev,
        totalPageViews: prev.totalPageViews + Math.floor(Math.random() * 10),
        uniqueUsers: prev.uniqueUsers + Math.floor(Math.random() * 5),
        conversionRate: Math.max(0, Math.min(10, prev.conversionRate + (Math.random() - 0.5) * 0.2))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [realTime])

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    suffix = '', 
    isPositive = true 
  }: {
    title: string
    value: string | number
    change?: number
    suffix?: string
    isPositive?: boolean
  }) => (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50 shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">
            {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
          </p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 text-sm ${
              (isPositive && change >= 0) ?? (!isPositive && change <= 0)
                ? 'text-green-400' 
                : 'text-red-400'
            }`}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d={change >= 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
              </svg>
              {Math.abs(change).toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const TrafficChart = () => (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
      <h3 className="text-lg font-semibold text-white mb-4">Traffic Sources</h3>
      
      <div className="space-y-4">
        {currentMetrics.trafficSources.map((source, index) => (
          <div key={source.source} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className={`w-3 h-3 rounded-full ${
                  index === 0 ? 'bg-blue-500' :
                  index === 1 ? 'bg-green-500' :
                  index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                }`}
              />
              <span className="text-gray-300">{source.source}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-yellow-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${source.percentage}%` }}
                />
              </div>
              <span className="text-white font-medium w-12 text-right">
                {source.percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const TopPages = () => (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Top Pages</h3>
        <button className="text-blue-400 text-sm hover:text-blue-300 transition-colors">
          View All
        </button>
      </div>
      
      <div className="space-y-3">
        {currentMetrics.topPages.map((page, index) => (
          <div key={page.page} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/30 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-xs font-bold">
                {index + 1}
              </div>
              <span className="text-gray-300 font-mono text-sm">{page.page}</span>
            </div>
            <span className="text-white font-medium">{page.views.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  )

  const TimeRangeSelector = () => (
    <div className="flex items-center space-x-2">
      {['7d', '30d', '90d', '1y'].map((range) => (
        <button
          key={range}
          onClick={() => setSelectedTimeRange(range as any)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
            selectedTimeRange === range
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {range}
        </button>
      ))}
    </div>
  )

  const RealTimeIndicator = () => (
    <div className="flex items-center space-x-2 text-sm text-gray-400">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span>Live data</span>
    </div>
  )

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-gray-400 mt-1">Comprehensive insights and performance metrics</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <TimeRangeSelector />
            {realTime && <RealTimeIndicator />}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <MetricCard
            title="Page Views"
            value={currentMetrics.totalPageViews}
            change={12.5}
            isPositive={true}
          />
          
          <MetricCard
            title="Unique Users"
            value={currentMetrics.uniqueUsers}
            change={8.2}
            isPositive={true}
          />
          
          <MetricCard
            title="Avg. Session"
            value={formatDuration(currentMetrics.avgSessionDuration)}
            change={-3.1}
            isPositive={true}
          />
          
          <MetricCard
            title="Bounce Rate"
            value={currentMetrics.bounceRate}
            change={-2.4}
            suffix="%"
            isPositive={false}
          />
          
          <MetricCard
            title="Conversion"
            value={currentMetrics.conversionRate.toFixed(1)}
            change={0.3}
            suffix="%"
            isPositive={true}
          />
        </div>

        {/* Charts and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrafficChart />
          <TopPages />
        </div>

        {/* Additional Insights */}
        <div className="mt-8 bg-gray-800/50 backdrop-blur-xl rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Key Insights</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">+15.2%</div>
              <p className="text-gray-300 text-sm">User Growth</p>
              <p className="text-gray-500 text-xs mt-1">vs last period</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">2.4x</div>
              <p className="text-gray-300 text-sm">Mobile Traffic</p>
              <p className="text-gray-500 text-xs mt-1">year over year</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">$2.8M</div>
              <p className="text-gray-300 text-sm">Revenue Impact</p>
              <p className="text-gray-500 text-xs mt-1">from optimizations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
