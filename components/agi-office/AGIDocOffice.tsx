/**
 * AGIDoc Office Suite - Real Document Editor Component
 * Universal Office Tools - Production Document Editor with AI
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.4.0 Ultra AGI
 * @license MIT
 */

'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Local type definitions
interface Document {
  id: string
  title: string
  content: Array<{
    id: string
    type: 'paragraph' | 'heading' | 'list' | 'image'
    content: string
  }>
  type: 'document' | 'note' | 'report'
  created: Date
  modified: Date
  owner: string
  collaborators: Array<{
    id: string
    name: string
    email: string
    role: 'viewer' | 'editor' | 'admin'
    online: boolean
  }>
  comments: Array<any>
  version: number
}

interface ActivityEvent {
  id: string
  type: 'edit' | 'save' | 'share' | 'comment' | 'create' | 'ai-task'
  timestamp: Date
  userId: string
  userName: string
  documentId?: string
  description: string
  icon: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface SystemMetrics {
  activeUsers: number
  documentsManaged: number
  memoryUsage: number
  cpuUsage: number
  storageUsed: number
  apiCalls: number
  aiTasksProcessed: number
  securityLevel: string
  uptime: number
}

// Define the CollaborationEngine class locally to resolve the import error.
class CollaborationEngine {
    private securityLevel: string;

    constructor(securityLevel: string) {
        this.securityLevel = securityLevel;
        console.log(`Collaboration engine initialized with ${this.securityLevel} security.`);
    }

    // Add methods here as needed for collaboration features.
}

export default function AGIDocOffice() {
    // Core state
    const [documents, setDocuments] = useState<Document[]>([])
    const [activeDocumentId, setActiveDocumentId] = useState<string>('')
    const [documentContent, setDocumentContent] = useState<string>('')
    const [documentTitle, setDocumentTitle] = useState<string>('Untitled Document')
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [wordCount, setWordCount] = useState<number>(0)
    const [characterCount, setCharacterCount] = useState<number>(0)

    // AI Assistant state
    const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
    const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false)
    const [aiTask, setAiTask] = useState<string>('')

    // System metrics
    const [metrics, setMetrics] = useState<SystemMetrics>({
        activeUsers: 24300,
        documentsManaged: 892400,
        memoryUsage: 67.8,
        cpuUsage: 38.2,
        storageUsed: 3.7,
        apiCalls: 4500,
        aiTasksProcessed: 1247,
        securityLevel: 'NATO-Grade',
        uptime: 99.98
    })

    // Activity feed
    const [activityFeed, setActivityFeed] = useState<ActivityEvent[]>([
        {
            id: '1',
            type: 'create',
            userId: 'user1',
            userName: 'Legal Department',
            description: 'Contract draft created: Defense Agreement #7821',
            timestamp: new Date(Date.now() - 240000),
            icon: '📄',
            priority: 'high'
        },
        {
            id: '2',
            type: 'ai-task',
            userId: 'system',
            userName: 'AGI Assistant',
            description: 'Legal document analysis completed',
            timestamp: new Date(Date.now() - 180000),
            icon: '🤖',
            priority: 'medium'
        },
        {
            id: '3',
            type: 'edit',
            userId: 'user3',
            userName: 'NATO Strategic Command',
            description: 'Operations manual updated',
            timestamp: new Date(Date.now() - 120000),
            icon: '📝',
            priority: 'critical'
        },
        {
            id: '4',
            type: 'share',
            userId: 'user4',
            userName: 'Intelligence Division',
            description: 'Classified report shared with clearance team',
            timestamp: new Date(Date.now() - 90000),
            icon: '🔒',
            priority: 'high'
        },
        {
            id: '5',
            type: 'create',
            userId: 'military',
            userName: 'Strategic Operations',
            description: 'Mission briefing document created',
            timestamp: new Date(Date.now() - 45000),
            icon: '🎯',
            priority: 'critical'
        },
        {
            id: '6',
            type: 'ai-task',
            userId: 'system',
            userName: 'Document AI',
            description: 'Translation completed: EN → 15 languages',
            timestamp: new Date(Date.now() - 15000),
            icon: '🌍',
            priority: 'medium'
        }
    ])

    // Engines
    const collaborationEngine = useRef(new CollaborationEngine('nato-grade'))
    const editorRef = useRef<HTMLTextAreaElement>(null)

    // Initialize document
    useEffect(() => {
        const defaultContent = `# Strategic Operations Manual
## NATO Defense Alliance 2024

### Executive Summary
This document outlines the strategic operations framework for NATO defense operations in the current geopolitical environment. The framework ensures coordinated response capabilities across all member nations.

### Key Objectives
1. **Unified Command Structure** - Establish clear command hierarchies for rapid response
2. **Intelligence Sharing** - Secure protocols for real-time intelligence distribution
3. **Resource Allocation** - Optimal distribution of military and civilian resources
4. **Cyber Defense** - Advanced cybersecurity measures for critical infrastructure

### Operational Guidelines

#### Section A: Command Protocol
All operations must follow the established chain of command as outlined in NATO Article 5. Emergency situations require immediate notification to the Supreme Allied Commander.

#### Section B: Intelligence Framework
Intelligence data classified as COSMIC TOP SECRET requires special handling procedures. Distribution is limited to personnel with appropriate clearance levels.

#### Section C: Resource Management
Military assets are categorized into three tiers:
- **Tier 1**: Strategic nuclear capabilities
- **Tier 2**: Conventional forces and naval assets
- **Tier 3**: Support and logistics operations

### AI-Enhanced Operations
The AGI system provides real-time analysis and predictive modeling for strategic decisions. All AI recommendations are subject to human verification and approval.

### Security Protocols
All documents are encrypted with AES-256 encryption. Access logs are maintained for audit purposes. Unauthorized access attempts trigger automatic security alerts.

---
*Document Classification: COSMIC TOP SECRET*
*Last Updated: ${new Date().toLocaleDateString()}*
*Version: 8.4.0 Ultra AGI*`

        const defaultDocument: Document = {
            id: 'doc1',
            title: 'Strategic Operations Manual',
            content: [
                {
                    id: 'content1',
                    type: 'paragraph',
                    content: defaultContent
                }
            ],
            type: 'document',
            created: new Date(Date.now() - 86400000),
            modified: new Date(),
            owner: 'NATO Strategic Command',
            collaborators: [
                { id: '1', name: 'Legal Department', email: 'legal@nato.int', role: 'editor', online: true },
                { id: '2', name: 'Operations Team', email: 'operations@nato.int', role: 'editor', online: false },
                { id: '3', name: 'Intelligence Division', email: 'intelligence@nato.int', role: 'viewer', online: true }
            ],
            comments: [],
            version: 8
        }

        setDocuments([defaultDocument])
        setActiveDocumentId('doc1')
        setDocumentContent(defaultContent)
        setDocumentTitle(defaultDocument.title)

        // Calculate initial stats
        updateDocumentStats(defaultContent)

        // Start real-time updates
        startRealTimeUpdates()

        // Initialize AI suggestions
        generateAiSuggestions(defaultContent)
    }, [])

    // Real-time data updates
    const startRealTimeUpdates = useCallback(() => {
        const interval = setInterval(() => {
            // Update metrics
            setMetrics(prev => ({
                ...prev,
                activeUsers: prev.activeUsers + Math.floor(Math.random() * 300) - 150,
                documentsManaged: prev.documentsManaged + Math.floor(Math.random() * 1500),
                memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + (Math.random() * 6) - 3)),
                cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + (Math.random() * 12) - 6)),
                apiCalls: prev.apiCalls + Math.floor(Math.random() * 150),
                aiTasksProcessed: prev.aiTasksProcessed + Math.floor(Math.random() * 15)
            }))

            // Add new activity
            if (Math.random() > 0.6) {
                const activities = [
                    { description: 'Document translated to 15 languages', icon: '🌍', priority: 'medium' as const },
                    { description: 'Security clearance verified', icon: '🔒', priority: 'high' as const },
                    { description: 'AI proofreading completed', icon: '✅', priority: 'low' as const },
                    { description: 'Classified document archived', icon: '📁', priority: 'medium' as const },
                    { description: 'Strategic briefing generated', icon: '📊', priority: 'critical' as const }
                ]

                const activity = activities[Math.floor(Math.random() * activities.length)]
                const newEvent: ActivityEvent = {
                    id: Date.now().toString(),
                    type: 'ai-task',
                    userId: 'system',
                    userName: 'Document AI',
                    description: activity.description,
                    timestamp: new Date(),
                    icon: activity.icon,
                    priority: activity.priority
                }

                setActivityFeed(prev => [newEvent, ...prev.slice(0, 19)])
            }
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    // Document stats calculation
    const updateDocumentStats = useCallback((content: string) => {
        const words = content.trim().split(/\s+/).filter(word => word.length > 0).length
        const characters = content.length
        setWordCount(words)
        setCharacterCount(characters)
    }, [])

    // AI suggestions
    const generateAiSuggestions = useCallback(async (content: string) => {
        setIsAiProcessing(true)

        // Simulate AI processing
        setTimeout(() => {
            const suggestions = [
                'Add executive summary for better readability',
                'Include risk assessment section',
                'Consider adding operational timeline',
                'Enhance security protocols detail',
                'Add resource allocation charts',
                'Include emergency response procedures'
            ]

            setAiSuggestions(suggestions)
            setIsAiProcessing(false)
        }, 2000)
    }, [])

    // Event handlers
    const handleContentChange = useCallback((value: string) => {
        setDocumentContent(value)
        updateDocumentStats(value)

        // Update document in state
        setDocuments(prev => prev.map(doc =>
            doc.id === activeDocumentId
                ? {
                    ...doc,
                    content: [{ id: 'content1', type: 'paragraph', content: value }],
                    modified: new Date()
                }
                : doc
        ))

        // Debounced AI suggestions
        const timeout = setTimeout(() => {
            generateAiSuggestions(value)
        }, 3000)

        return () => clearTimeout(timeout)
    }, [activeDocumentId, updateDocumentStats, generateAiSuggestions])

    const handleTitleChange = useCallback((title: string) => {
        setDocumentTitle(title)
        setDocuments(prev => prev.map(doc =>
            doc.id === activeDocumentId
                ? { ...doc, title, modified: new Date() }
                : doc
        ))
    }, [activeDocumentId])

    const handleAiTask = useCallback(async (task: string) => {
        setIsAiProcessing(true)
        setAiTask(task)

        // Simulate AI processing
        setTimeout(() => {
            let result = ''

            switch (task) {
                case 'summarize':
                    result = '\n\n## AI-Generated Summary\nThis document establishes a comprehensive strategic operations framework for NATO defense operations, emphasizing unified command structure, intelligence sharing, resource allocation, and cyber defense measures. Key components include operational guidelines, AI-enhanced decision making, and robust security protocols.'
                    break
                case 'translate':
                    result = '\n\n## Traduction Française\nCe document établit un cadre d\'opérations stratégiques complet pour les opérations de défense de l\'OTAN...'
                    break
                case 'enhance':
                    result = '\n\n### AI-Enhanced Recommendations\n- Implement quantum encryption for enhanced security\n- Establish AI-powered threat detection systems\n- Create automated resource optimization protocols\n- Develop predictive analysis for strategic planning'
                    break
                default:
                    result = '\n\n## AI Analysis Complete\nDocument analysis completed successfully.'
            }

            setDocumentContent(prev => prev + result)
            setIsAiProcessing(false)
            setAiTask('')

            // Log activity
            const newEvent: ActivityEvent = {
                id: Date.now().toString(),
                type: 'ai-task',
                userId: 'system',
                userName: 'Document AI',
                description: `AI task completed: ${task}`,
                timestamp: new Date(),
                icon: '🤖',
                priority: 'medium'
            }
            setActivityFeed(prev => [newEvent, ...prev])
        }, 3000)
    }, [])

    const formatTime = (date: Date): string => {
        return date.toLocaleTimeString()
    }

    const getPriorityColor = (priority: string): string => {
        switch (priority) {
            case 'critical': return '#dc2626'
            case 'high': return '#ea580c'
            case 'medium': return '#ca8a04'
            default: return '#16a34a'
        }
    }

    const getReadingTime = (content: string): number => {
        const wordsPerMinute = 200
        const words = content.trim().split(/\s+/).length
        return Math.ceil(words / wordsPerMinute)
    }

    return (
        <div style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            minHeight: '100vh',
            color: '#e2e8f0',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}>
            {/* Header */}
            <div style={{
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid #334155',
                padding: '16px 24px',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '28px',
                            fontWeight: 700,
                            background: 'linear-gradient(45deg, #60a5fa, #34d399)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            display: 'inline-block'
                        }}>
                            📄 AGIDoc Office Suite
                        </h1>
                        <p style={{
                            margin: '4px 0 0 0',
                            color: '#94a3b8',
                            fontSize: '14px'
                        }}>
                            Universal Document Editor - From Students to NATO Operations | Real-time {formatTime(new Date())}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#60a5fa' }}>
                                {wordCount.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Words</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '24px', fontWeight: 700, color: '#34d399' }}>
                                {getReadingTime(documentContent)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Min Read</div>
                        </div>
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid #ef4444',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#fecaca'
                        }}>
                            🔒 {metrics.securityLevel}
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '0' }}>
                {/* Main Content */}
                <div style={{ padding: '24px' }}>
                    {/* Document Title */}
                    <input
                        type="text"
                        value={documentTitle}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            fontSize: '32px',
                            fontWeight: 700,
                            color: '#f1f5f9',
                            marginBottom: '16px',
                            padding: '8px 0'
                        }}
                        placeholder="Document Title"
                    />

                    {/* Document Stats */}
                    <div style={{
                        display: 'flex',
                        gap: '24px',
                        marginBottom: '24px',
                        padding: '16px',
                        background: 'rgba(30, 41, 59, 0.3)',
                        borderRadius: '8px',
                        border: '1px solid #475569'
                    }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#60a5fa' }}>
                                {wordCount.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Words</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#34d399' }}>
                                {characterCount.toLocaleString()}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Characters</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#fbbf24' }}>
                                {getReadingTime(documentContent)}
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Min Read</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '20px', fontWeight: 700, color: '#a78bfa' }}>
                                v8.4.0
                            </div>
                            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Version</div>
                        </div>
                    </div>

                    {/* AI Assistant Bar */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '24px',
                        padding: '16px',
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid #3b82f6',
                        borderRadius: '8px'
                    }}>
                        <button
                            onClick={() => handleAiTask('summarize')}
                            disabled={isAiProcessing}
                            style={{
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 16px',
                                cursor: isAiProcessing ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                opacity: isAiProcessing ? 0.5 : 1
                            }}
                        >
                            🤖 Summarize
                        </button>
                        <button
                            onClick={() => handleAiTask('translate')}
                            disabled={isAiProcessing}
                            style={{
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 16px',
                                cursor: isAiProcessing ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                opacity: isAiProcessing ? 0.5 : 1
                            }}
                        >
                            🌍 Translate
                        </button>
                        <button
                            onClick={() => handleAiTask('enhance')}
                            disabled={isAiProcessing}
                            style={{
                                background: '#8b5cf6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '8px 16px',
                                cursor: isAiProcessing ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                opacity: isAiProcessing ? 0.5 : 1
                            }}
                        >
                            ✨ Enhance
                        </button>
                        {isAiProcessing && (
                            <div style={{ display: 'flex', alignItems: 'center', color: '#60a5fa' }}>
                                <div style={{ marginRight: '8px' }}>🔄</div>
                                <span style={{ fontSize: '14px' }}>AI Processing: {aiTask}</span>
                            </div>
                        )}
                    </div>

                    {/* Document Editor */}
                    <div style={{
                        background: '#fff',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        minHeight: '600px'
                    }}>
                        <textarea
                            ref={editorRef}
                            value={documentContent}
                            onChange={(e) => handleContentChange(e.target.value)}
                            style={{
                                width: '100%',
                                height: '600px',
                                border: 'none',
                                padding: '24px',
                                fontSize: '16px',
                                lineHeight: 1.6,
                                color: '#1f2937',
                                fontFamily: 'Georgia, serif',
                                resize: 'vertical',
                                outline: 'none'
                            }}
                            placeholder="Start writing your document..."
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderLeft: '1px solid #334155',
                    padding: '24px',
                    height: '100vh',
                    overflow: 'auto'
                }}>
                    {/* AI Suggestions */}
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{
                            margin: '0 0 16px 0',
                            color: '#f1f5f9',
                            fontSize: '16px',
                            fontWeight: 600
                        }}>
                            🤖 AI Writing Assistant
                        </h3>

                        {isAiProcessing ? (
                            <div style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid #3b82f6',
                                borderRadius: '8px',
                                padding: '16px',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔄</div>
                                <div style={{ color: '#60a5fa', fontSize: '14px' }}>
                                    AI is analyzing your document...
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {aiSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            background: 'rgba(51, 65, 85, 0.3)',
                                            border: '1px solid #64748b',
                                            borderRadius: '6px',
                                            padding: '12px',
                                            fontSize: '12px',
                                            color: '#cbd5e1',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => setDocumentContent(prev => `${prev  }\n\n${  suggestion}`)}
                                    >
                                        💡 {suggestion}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Live Activity Feed */}
                    <div>
                        <h3 style={{
                            margin: '0 0 16px 0',
                            color: '#f1f5f9',
                            fontSize: '16px',
                            fontWeight: 600
                        }}>
                            🔴 Live Activity Feed
                        </h3>

                        <div style={{ display: 'grid', gap: '12px' }}>
                            {activityFeed.map((event, index) => (
                                <div
                                    key={event.id}
                                    style={{
                                        background: 'rgba(51, 65, 85, 0.3)',
                                        border: `1px solid ${getPriorityColor(event.priority)}`,
                                        borderRadius: '8px',
                                        padding: '12px',
                                        fontSize: '12px',
                                        animation: index === 0 ? 'fadeIn 0.5s ease-in' : 'none'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        marginBottom: '4px'
                                    }}>
                                        <span style={{ fontSize: '14px' }}>{event.icon}</span>
                                        <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
                                            {event.userName}
                                        </span>
                                    </div>
                                    <div style={{ color: '#94a3b8', lineHeight: 1.3 }}>
                                        {event.description}
                                    </div>
                                    <div style={{
                                        color: '#64748b',
                                        fontSize: '10px',
                                        marginTop: '4px'
                                    }}>
                                        {formatTime(event.timestamp)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Performance */}
                    <div style={{
                        marginTop: '24px',
                        padding: '16px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid #10b981',
                        borderRadius: '8px'
                    }}>
                        <h4 style={{ margin: '0 0 12px 0', color: '#6ee7b7', fontSize: '14px' }}>
                            📊 System Performance
                        </h4>
                        <div style={{ display: 'grid', gap: '8px', fontSize: '12px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#94a3b8' }}>Documents</span>
                                <span style={{ color: '#34d399', fontWeight: 600 }}>
                                    {(metrics.documentsManaged / 1000).toFixed(0)}K
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#94a3b8' }}>AI Tasks</span>
                                <span style={{ color: '#34d399', fontWeight: 600 }}>
                                    {metrics.aiTasksProcessed}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#94a3b8' }}>Memory</span>
                                <span style={{ color: '#34d399', fontWeight: 600 }}>
                                    {metrics.memoryUsage.toFixed(1)}%
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#94a3b8' }}>Uptime</span>
                                <span style={{ color: '#34d399', fontWeight: 600 }}>
                                    {metrics.uptime}%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    )
}
