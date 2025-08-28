/**
 * Professional Tools Suite - Complete Office & Technical Tools
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-PROFESSIONAL
 */

'use client'

import React, { useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface DocumentTemplate {
  id: string
  name: string
  type: 'excel' | 'word' | 'powerpoint' | 'pdf' | 'autocad' | 'technical'
  profession: string
  description: string
  template: string
}

interface ToolCategory {
  id: string
  name: string
  icon: string
  tools: DocumentTemplate[]
}

export const ProfessionalToolsSuite: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('office')
  const [selectedTool, setSelectedTool] = useState<DocumentTemplate | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedFiles, setGeneratedFiles] = useState<string[]>([])

  const toolCategories: ToolCategory[] = [
    {
      id: 'office',
      name: 'Office Suite',
      icon: '📊',
      tools: [
        {
          id: 'excel-engineering',
          name: 'Excel - Engineering Calculations',
          type: 'excel',
          profession: 'Inxhinierë',
          description: 'Llogaritje të avancuara inxhinierike me formula dhe grafike',
          template: 'excel_engineering_calculations'
        },
        {
          id: 'word-reports',
          name: 'Word - Technical Reports',
          type: 'word',
          profession: 'Teknikë',
          description: 'Raporte teknike me format profesional',
          template: 'word_technical_report'
        },
        {
          id: 'powerpoint-presentations',
          name: 'PowerPoint - Project Presentations',
          type: 'powerpoint',
          profession: 'Specialistë',
          description: 'Prezantime profesionale për projekte',
          template: 'powerpoint_project_presentation'
        }
      ]
    },
    {
      id: 'architecture',
      name: 'Architecture & Design',
      icon: '🏛️',
      tools: [
        {
          id: 'autocad-drawings',
          name: 'AutoCAD - Architectural Drawings',
          type: 'autocad',
          profession: 'Arkitektë',
          description: 'Vizatime arkitektonike dhe plane ndërtimi',
          template: 'autocad_architectural_drawing'
        },
        {
          id: 'structural-analysis',
          name: 'Structural Analysis Templates',
          type: 'excel',
          profession: 'Inxhinierë Strukturorë',
          description: 'Analiza strukturore dhe llogaritje rezistence',
          template: 'excel_structural_analysis'
        },
        {
          id: 'material-specs',
          name: 'Material Specifications',
          type: 'word',
          profession: 'Arkitektë',
          description: 'Specifikimet e materialeve dhe standarde',
          template: 'word_material_specifications'
        }
      ]
    },
    {
      id: 'surveying',
      name: 'Surveying & Topology',
      icon: '🗺️',
      tools: [
        {
          id: 'topographic-maps',
          name: 'Topographic Survey Templates',
          type: 'excel',
          profession: 'Topografë',
          description: 'Llogaritje topografike dhe hartim i terrenit',
          template: 'excel_topographic_survey'
        },
        {
          id: 'land-survey-report',
          name: 'Land Survey Reports',
          type: 'word',
          profession: 'Vrojtues',
          description: 'Raporte vrojtime dhe matje toke',
          template: 'word_land_survey_report'
        },
        {
          id: 'gps-data-analysis',
          name: 'GPS Data Analysis',
          type: 'excel',
          profession: 'Vrojtues',
          description: 'Analiza e të dhënave GPS dhe koordinatat',
          template: 'excel_gps_data_analysis'
        }
      ]
    },
    {
      id: 'quality-control',
      name: 'Quality Control & Inspection',
      icon: '🔍',
      tools: [
        {
          id: 'inspection-checklist',
          name: 'Quality Inspection Checklists',
          type: 'excel',
          profession: 'Kontrollues',
          description: 'Lista kontrolli për cilësi dhe standardet',
          template: 'excel_quality_inspection'
        },
        {
          id: 'audit-reports',
          name: 'Audit & Compliance Reports',
          type: 'word',
          profession: 'Kontrollues',
          description: 'Raporte auditimi dhe përputhshmërie',
          template: 'word_audit_report'
        },
        {
          id: 'test-procedures',
          name: 'Testing Procedures Manual',
          type: 'word',
          profession: 'Studiues',
          description: 'Udhëzime dhe procedura testimi',
          template: 'word_testing_procedures'
        }
      ]
    },
    {
      id: 'research',
      name: 'Research & Development',
      icon: '🔬',
      tools: [
        {
          id: 'research-methodology',
          name: 'Research Methodology Templates',
          type: 'word',
          profession: 'Studiues',
          description: 'Metodologji kërkimi dhe studimi',
          template: 'word_research_methodology'
        },
        {
          id: 'data-analysis',
          name: 'Scientific Data Analysis',
          type: 'excel',
          profession: 'Studiues',
          description: 'Analiza statistikore dhe shkencëtare',
          template: 'excel_scientific_analysis'
        },
        {
          id: 'research-presentation',
          name: 'Research Presentations',
          type: 'powerpoint',
          profession: 'Studiues',
          description: 'Prezantime kërkimi dhe gjetje',
          template: 'powerpoint_research_presentation'
        }
      ]
    },
    {
      id: 'electrical',
      name: 'Electrical Engineering',
      icon: '⚡',
      tools: [
        {
          id: 'electrical-calculations',
          name: 'Electrical Load Calculations',
          type: 'excel',
          profession: 'Inxhinierë Elektrikë',
          description: 'Llogaritje ngarkese elektrike dhe rrjeti',
          template: 'excel_electrical_calculations'
        },
        {
          id: 'wiring-diagrams',
          name: 'Wiring Diagram Templates',
          type: 'autocad',
          profession: 'Inxhinierë Elektrikë',
          description: 'Skema dhe diagrame instalimesh elektrike',
          template: 'autocad_wiring_diagrams'
        }
      ]
    },
    {
      id: 'mechanical',
      name: 'Mechanical Engineering',
      icon: '⚙️',
      tools: [
        {
          id: 'mechanical-design',
          name: 'Mechanical Design Calculations',
          type: 'excel',
          profession: 'Inxhinierë Mekanikë',
          description: 'Llogaritje dizajni dhe analiza mekanike',
          template: 'excel_mechanical_design'
        },
        {
          id: 'maintenance-schedule',
          name: 'Equipment Maintenance Schedules',
          type: 'excel',
          profession: 'Teknikë Mirëmbajtje',
          description: 'Orare mirëmbajtje dhe kontrolli pajisjesh',
          template: 'excel_maintenance_schedule'
        }
      ]
    },
    {
      id: 'environmental',
      name: 'Environmental & Safety',
      icon: '🌱',
      tools: [
        {
          id: 'environmental-impact',
          name: 'Environmental Impact Assessment',
          type: 'word',
          profession: 'Specialistë Mjedisi',
          description: 'Vlerësim ndikimi në mjedis dhe masat',
          template: 'word_environmental_impact'
        },
        {
          id: 'safety-procedures',
          name: 'Safety Procedures Manual',
          type: 'word',
          profession: 'Specialistë Sigurie',
          description: 'Udhëzime sigurie dhe emergjence',
          template: 'word_safety_procedures'
        }
      ]
    }
  ]

  const generateDocument = useCallback(async (tool: DocumentTemplate) => {
    setIsGenerating(true)
    setSelectedTool(tool)
    
    try {
      const response = await fetch('/api/professional-tools/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolId: tool.id,
          template: tool.template,
          type: tool.type,
          profession: tool.profession
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Create downloadable file
        let mimeType = 'application/octet-stream'
        let extension = '.txt'
        
        switch (tool.type) {
          case 'excel':
            mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            extension = '.xlsx'
            break
          case 'word':
            mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            extension = '.docx'
            break
          case 'powerpoint':
            mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
            extension = '.pptx'
            break
          case 'pdf':
            mimeType = 'application/pdf'
            extension = '.pdf'
            break
          case 'autocad':
            mimeType = 'application/acad'
            extension = '.dwg'
            break
        }
        
        const blob = new Blob([result.content], { type: mimeType })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${tool.name}${extension}`
        a.click()
        URL.revokeObjectURL(url)
        
        setGeneratedFiles(prev => [...prev, `${tool.name}${extension}`])
      }
    } catch (error) {
      console.error('Document generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [])

  const renderToolGrid = () => {
    const currentCategory = toolCategories.find(cat => cat.id === activeCategory)
    if (!currentCategory) return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentCategory.tools.map((tool) => (
          <motion.div
            key={tool.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 cursor-pointer"
            onClick={() => generateDocument(tool)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-2xl">
                {tool.type === 'excel' && '📊'}
                {tool.type === 'word' && '📄'}
                {tool.type === 'powerpoint' && '📽️'}
                {tool.type === 'pdf' && '📋'}
                {tool.type === 'autocad' && '📐'}
                {tool.type === 'technical' && '🔧'}
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {tool.type.toUpperCase()}
              </span>
            </div>
            
            <h3 className="font-bold text-lg text-gray-800 mb-2">{tool.name}</h3>
            <p className="text-sm text-blue-600 mb-2 font-medium">{tool.profession}</p>
            <p className="text-gray-600 text-sm">{tool.description}</p>
            
            <div className="mt-4 flex justify-between items-center">
              <button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all"
                disabled={isGenerating}
              >
                {isGenerating && selectedTool?.id === tool.id ? 'Generating...' : 'Generate'}
              </button>
              <span className="text-xs text-gray-500">Ready to use</span>
            </div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                🛠️ Professional Tools Suite
              </h1>
              <p className="text-gray-600 mt-2">
                Vegla profesionale për inxhinierë, arkitektë, teknikë, specialistë dhe më shumë
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Generated Files: {generatedFiles.length}</div>
              <div className="text-lg font-bold text-blue-600">{toolCategories.reduce((acc, cat) => acc + cat.tools.length, 0)} Tools Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto py-4">
            {toolCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
                <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                  {category.tools.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {toolCategories.find(cat => cat.id === activeCategory)?.name} Tools
          </h2>
          <p className="text-gray-600">
            Zgjidhni veglën që dëshironi të krijoni. Çdo vegël krijon dokumente të gatshme për përdorim profesional.
          </p>
        </div>

        {renderToolGrid()}

        {/* Generated Files List */}
        {generatedFiles.length > 0 && (
          <div className="mt-12 bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">📁 Generated Files</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-green-600">✅</div>
                  <span className="text-sm font-medium text-green-800">{file}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Generating Document...</h3>
              <p className="text-gray-600">Creating professional {selectedTool?.type} file</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfessionalToolsSuite
