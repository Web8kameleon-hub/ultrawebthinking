/**
 * ALB Security Dashboard Test Page
 * EuroWeb Platform - Test ALB Dashboard in isolation
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.1.0 Ultra
 * @license MIT
 */

'use client'

import ALBSecurityDashboard from '../../components/ALBSecurityDashboard'

export default function TestALBPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          ALB Security Dashboard Test
        </h1>
        
        <ALBSecurityDashboard />
      </div>
    </div>
  )
}
