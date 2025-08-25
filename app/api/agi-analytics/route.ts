/**
 * AGI Analytics API Routes
 * Professional analytics endpoints with TypeScript
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

import { NextRequest, NextResponse } from 'next/server'
import { agiAnalyticsEngine } from '../../../lib/agiAnalytics'

export async function POST(request: NextRequest) {
  try {
    const { action, category, value, metadata } = await request.json()

    switch (action) {
      case 'add_data_point':
        agiAnalyticsEngine.addDataPoint(category, value, metadata)
        return NextResponse.json({
          success: true,
          message: 'Data point added successfully',
          timestamp: new Date().toISOString()
        })

      case 'generate_report':
        const report = agiAnalyticsEngine.generateReport(category)
        return NextResponse.json({
          success: true,
          data: report,
          timestamp: new Date().toISOString()
        })

      case 'run_analysis':
        const analysis = agiAnalyticsEngine.runRealTimeAnalysis()
        return NextResponse.json({
          success: true,
          data: analysis,
          timestamp: new Date().toISOString()
        })

      case 'neural_forecast':
        const { hoursAhead = 24 } = await request.json()
        const forecast = agiAnalyticsEngine.generateNeuralForecast(category, hoursAhead)
        return NextResponse.json({
          success: true,
          data: forecast,
          timestamp: new Date().toISOString()
        })

      case 'export_data':
        const exportData = agiAnalyticsEngine.exportAnalyticsData()
        return NextResponse.json({
          success: true,
          data: exportData,
          timestamp: new Date().toISOString()
        })

      // NEW ADVANCED ANALYTICS FUNCTIONS
      case 'advanced_statistics':
        const { dataset: statsDataset } = await request.json()
        const stats = agiAnalyticsEngine.calculateAdvancedStatistics(statsDataset)
        return NextResponse.json({
          success: true,
          data: stats,
          timestamp: new Date().toISOString()
        })

      case 'correlation_analysis':
        const { datasetX, datasetY } = await request.json()
        const correlation = agiAnalyticsEngine.calculateCorrelation(datasetX, datasetY)
        return NextResponse.json({
          success: true,
          data: correlation,
          timestamp: new Date().toISOString()
        })

      case 'trend_detection':
        const { timeSeries, algorithm } = await request.json()
        const trends = agiAnalyticsEngine.detectTrends(timeSeries, algorithm)
        return NextResponse.json({
          success: true,
          data: trends,
          timestamp: new Date().toISOString()
        })

      case 'anomaly_detection':
        const { data, threshold } = await request.json()
        const anomalies = agiAnalyticsEngine.detectAnomalies(data, threshold)
        return NextResponse.json({
          success: true,
          data: anomalies,
          timestamp: new Date().toISOString()
        })

      case 'data_clustering':
        const { points, clusters } = await request.json()
        const clusterResult = agiAnalyticsEngine.performClustering(points, clusters)
        return NextResponse.json({
          success: true,
          data: clusterResult,
          timestamp: new Date().toISOString()
        })

      case 'regression_analysis':
        const { independentVar, dependentVar, type } = await request.json()
        const regression = agiAnalyticsEngine.performRegression(independentVar, dependentVar, type)
        return NextResponse.json({
          success: true,
          data: regression,
          timestamp: new Date().toISOString()
        })

      case 'data_visualization':
        const { chartData, chartType, options } = await request.json()
        const visualization = agiAnalyticsEngine.generateVisualization(chartData, chartType, options)
        return NextResponse.json({
          success: true,
          data: visualization,
          timestamp: new Date().toISOString()
        })

      case 'predictive_modeling':
        const { trainingData, modelType, features } = await request.json()
        const model = agiAnalyticsEngine.createPredictiveModel(trainingData, modelType, features)
        return NextResponse.json({
          success: true,
          data: model,
          timestamp: new Date().toISOString()
        })

      case 'data_profiling':
        const { dataSource } = await request.json()
        const profile = agiAnalyticsEngine.profileData(dataSource)
        return NextResponse.json({
          success: true,
          data: profile,
          timestamp: new Date().toISOString()
        })

      case 'sentiment_analysis':
        const { textData } = await request.json()
        const sentiment = agiAnalyticsEngine.analyzeSentiment(textData)
        return NextResponse.json({
          success: true,
          data: sentiment,
          timestamp: new Date().toISOString()
        })

      case 'time_series_analysis':
        const { timeSeriesData, analysisType } = await request.json()
        const timeAnalysis = agiAnalyticsEngine.analyzeTimeSeries(timeSeriesData, analysisType)
        return NextResponse.json({
          success: true,
          data: timeAnalysis,
          timestamp: new Date().toISOString()
        })

      case 'hypothesis_testing':
        const { sampleData, hypothesis, significanceLevel } = await request.json()
        const testResult = agiAnalyticsEngine.performHypothesisTest(sampleData, hypothesis, significanceLevel)
        return NextResponse.json({
          success: true,
          data: testResult,
          timestamp: new Date().toISOString()
        })

      case 'monte_carlo_simulation':
        const { parameters, iterations } = await request.json()
        const simulation = agiAnalyticsEngine.runMonteCarloSimulation(parameters, iterations)
        return NextResponse.json({
          success: true,
          data: simulation,
          timestamp: new Date().toISOString()
        })

      case 'optimization_analysis':
        const { objectiveFunction, constraints, variables } = await request.json()
        const optimization = agiAnalyticsEngine.performOptimization(objectiveFunction, constraints, variables)
        return NextResponse.json({
          success: true,
          data: optimization,
          timestamp: new Date().toISOString()
        })

      case 'data_mining':
        const { dataset: miningDataset, miningType, rules } = await request.json()
        const miningResult = agiAnalyticsEngine.performDataMining(miningDataset, miningType, rules)
        return NextResponse.json({
          success: true,
          data: miningResult,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified',
          timestamp: new Date().toISOString()
        }, { status: 400 })
    }

  } catch (error) {
    console.error('AGI Analytics API Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const category = searchParams.get('category')

    switch (action) {
      case 'get_models':
        const models = agiAnalyticsEngine.getPredictionModels()
        return NextResponse.json({
          success: true,
          data: models,
          timestamp: new Date().toISOString()
        })

      case 'get_status':
        const status = agiAnalyticsEngine.runRealTimeAnalysis()
        return NextResponse.json({
          success: true,
          data: status,
          timestamp: new Date().toISOString()
        })

      // NEW GET ENDPOINTS
      case 'get_analytics_dashboard':
        const dashboard = agiAnalyticsEngine.getAnalyticsDashboard()
        return NextResponse.json({
          success: true,
          data: dashboard,
          timestamp: new Date().toISOString()
        })

      case 'get_data_sources':
        const dataSources = agiAnalyticsEngine.getAvailableDataSources()
        return NextResponse.json({
          success: true,
          data: dataSources,
          timestamp: new Date().toISOString()
        })

      case 'get_algorithms':
        const algorithms = agiAnalyticsEngine.getAvailableAlgorithms()
        return NextResponse.json({
          success: true,
          data: algorithms,
          timestamp: new Date().toISOString()
        })

      case 'get_visualization_types':
        const visualizations = agiAnalyticsEngine.getSupportedVisualizations()
        return NextResponse.json({
          success: true,
          data: visualizations,
          timestamp: new Date().toISOString()
        })

      case 'get_system_metrics':
        const metrics = agiAnalyticsEngine.getSystemMetrics()
        return NextResponse.json({
          success: true,
          data: metrics,
          timestamp: new Date().toISOString()
        })

      case 'get_data_quality':
        const quality = agiAnalyticsEngine.assessDataQuality()
        return NextResponse.json({
          success: true,
          data: quality,
          timestamp: new Date().toISOString()
        })

      case 'get_model_performance':
        const modelId = searchParams.get('modelId')
        const performance = agiAnalyticsEngine.getModelPerformance(modelId)
        return NextResponse.json({
          success: true,
          data: performance,
          timestamp: new Date().toISOString()
        })

      case 'get_recommendations':
        const recommendations = agiAnalyticsEngine.getAnalyticsRecommendations()
        return NextResponse.json({
          success: true,
          data: recommendations,
          timestamp: new Date().toISOString()
        })

      case 'get_historical_trends':
        const period = searchParams.get('period') || '30d'
        const trends = agiAnalyticsEngine.getHistoricalTrends(period)
        return NextResponse.json({
          success: true,
          data: trends,
          timestamp: new Date().toISOString()
        })

      case 'get_benchmark_data':
        const benchmarks = agiAnalyticsEngine.getBenchmarkData()
        return NextResponse.json({
          success: true,
          data: benchmarks,
          timestamp: new Date().toISOString()
        })

      case 'get_export_formats':
        const formats = agiAnalyticsEngine.getSupportedExportFormats()
        return NextResponse.json({
          success: true,
          data: formats,
          timestamp: new Date().toISOString()
        })

      case 'health_check':
        const health = agiAnalyticsEngine.performHealthCheck()
        return NextResponse.json({
          success: true,
          data: health,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action specified',
          available_actions: [
            'get_models', 'get_status', 'get_analytics_dashboard',
            'get_data_sources', 'get_algorithms', 'get_visualization_types',
            'get_system_metrics', 'get_data_quality', 'get_model_performance',
            'get_recommendations', 'get_historical_trends', 'get_benchmark_data',
            'get_export_formats', 'health_check'
          ],
          timestamp: new Date().toISOString()
        }, { status: 400 })
    }

  } catch (error) {
    console.error('AGI Analytics GET Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
