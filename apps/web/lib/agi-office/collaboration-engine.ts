/**
 * AGISheet Real-Time Collaboration Engine
 * Universal Office Tools - Live Collaboration System
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.4.0 Ultra AGI
 * @license MIT
 */

import { ActivityEvent, Collaborator, Comment, SecurityContext } from './types'

export class CollaborationEngine {
    private collaborators: Map<string, Collaborator> = new Map()
    private comments: Map<string, Comment[]> = new Map()
    private activityFeed: ActivityEvent[] = []
    private securityContext: SecurityContext
    private socketConnections: Map<string, WebSocket> = new Map()

    constructor(securityLevel: 'public' | 'internal' | 'confidential' | 'secret' | 'nato-grade' = 'internal') {
        this.securityContext = {
            level: securityLevel,
            accessLog: [],
            encryption: securityLevel !== 'public',
            auditRequired: ['confidential', 'secret', 'nato-grade'].includes(securityLevel)
        }
    }

    // Real-time collaboration methods
    addCollaborator(collaborator: Collaborator): void {
        this.collaborators.set(collaborator.id, collaborator)
        this.logActivity({
            id: this.generateId(),
            type: 'share',
            userId: collaborator.id,
            userName: collaborator.name,
            description: `${collaborator.name} joined the collaboration`,
            timestamp: new Date(),
            icon: '👥',
            priority: 'low'
        })
    }

    removeCollaborator(collaboratorId: string): void {
        const collaborator = this.collaborators.get(collaboratorId)
        if (collaborator) {
            this.collaborators.delete(collaboratorId)
            this.logActivity({
                id: this.generateId(),
                type: 'share',
                userId: collaboratorId,
                userName: collaborator.name,
                description: `${collaborator.name} left the collaboration`,
                timestamp: new Date(),
                icon: '👤',
                priority: 'low'
            })
        }
    }

    updateCollaboratorCursor(collaboratorId: string, cursor: { sheet?: string; cell?: string; selection?: string }): void {
        const collaborator = this.collaborators.get(collaboratorId)
        if (collaborator) {
            collaborator.cursor = cursor
            this.broadcastCursorUpdate(collaboratorId, cursor)
        }
    }

    // Comment system
    addComment(documentId: string, location: string, author: string, content: string, parentId?: string): Comment {
        const comment: Comment = {
            id: this.generateId(),
            author,
            content,
            location,
            replies: [],
            created: new Date(),
            resolved: false
        }

        if (parentId) {
            // Add as reply
            const documentComments = this.comments.get(documentId) ?? []
            const parentComment = this.findCommentById(documentComments, parentId)
            if (parentComment) {
                parentComment.replies.push(comment)
            }
        } else {
            // Add as top-level comment
            const documentComments = this.comments.get(documentId) ?? []
            documentComments.push(comment)
            this.comments.set(documentId, documentComments)
        }

        this.logActivity({
            id: this.generateId(),
            type: 'comment',
            userId: author,
            userName: this.getCollaboratorName(author),
            documentId,
            description: `Comment added: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
            timestamp: new Date(),
            icon: '💬',
            priority: 'medium'
        })

        return comment
    }

    resolveComment(documentId: string, commentId: string): void {
        const documentComments = this.comments.get(documentId) ?? []
        const comment = this.findCommentById(documentComments, commentId)
        if (comment) {
            comment.resolved = true
            this.logActivity({
                id: this.generateId(),
                type: 'comment',
                userId: 'system',
                userName: 'System',
                documentId,
                description: `Comment resolved`,
                timestamp: new Date(),
                icon: '✅',
                priority: 'low'
            })
        }
    }

    // Live activity tracking
    logActivity(event: ActivityEvent): void {
        this.activityFeed.unshift(event)

        // Keep only last 1000 events
        if (this.activityFeed.length > 1000) {
            this.activityFeed = this.activityFeed.slice(0, 1000)
        }

        // Log to security audit if required
        if (this.securityContext.auditRequired) {
            this.securityContext.accessLog.push({
                userId: event.userId,
                action: `${event.type}: ${event.description}`,
                timestamp: event.timestamp,
                ip: 'localhost', // In real implementation, get from request
                userAgent: 'AGISheet Office Suite',
                success: true
            })
        }

        // Broadcast to all connected clients
        this.broadcastActivity(event)
    }

    getRecentActivity(limit = 50): ActivityEvent[] {
        return this.activityFeed.slice(0, limit)
    }

    // Real-time document editing
    handleDocumentChange(documentId: string, userId: string, change: any): void {
        const userName = this.getCollaboratorName(userId)

        this.logActivity({
            id: this.generateId(),
            type: 'edit',
            userId,
            userName,
            documentId,
            description: `Document edited by ${userName}`,
            timestamp: new Date(),
            icon: '📝',
            priority: 'low'
        })

        // Broadcast change to other collaborators
        this.broadcastDocumentChange(documentId, userId, change)
    }

    // Version control
    createVersion(documentId: string, userId: string, description: string): void {
        const userName = this.getCollaboratorName(userId)

        this.logActivity({
            id: this.generateId(),
            type: 'create',
            userId,
            userName,
            documentId,
            description: `Version created: ${description}`,
            timestamp: new Date(),
            icon: '📌',
            priority: 'medium'
        })
    }

    // Security and access control
    checkAccess(userId: string, action: string): boolean {
        const collaborator = this.collaborators.get(userId)
        if (!collaborator) {return false}

        switch (action) {
            case 'read':
                return ['viewer', 'commenter', 'editor', 'owner'].includes(collaborator.role)
            case 'comment':
                return ['commenter', 'editor', 'owner'].includes(collaborator.role)
            case 'edit':
                return ['editor', 'owner'].includes(collaborator.role)
            case 'admin':
                return collaborator.role === 'owner'
            default:
                return false
        }
    }

    // Utility methods
    private findCommentById(comments: Comment[], id: string): Comment | null {
        for (const comment of comments) {
            if (comment.id === id) {return comment}
            const found = this.findCommentById(comment.replies, id)
            if (found) {return found}
        }
        return null
    }

    private getCollaboratorName(userId: string): string {
        const collaborator = this.collaborators.get(userId)
        return collaborator?.name ?? 'Unknown User'
    }

    private generateId(): string {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }

    private broadcastCursorUpdate(collaboratorId: string, cursor: any): void {
        const message = {
            type: 'cursor_update',
            collaboratorId,
            cursor,
            timestamp: new Date()
        }
        this.broadcast(message, collaboratorId)
    }

    private broadcastActivity(event: ActivityEvent): void {
        const message = {
            type: 'activity',
            event,
            timestamp: new Date()
        }
        this.broadcast(message)
    }

    private broadcastDocumentChange(documentId: string, userId: string, change: any): void {
        const message = {
            type: 'document_change',
            documentId,
            userId,
            change,
            timestamp: new Date()
        }
        this.broadcast(message, userId)
    }

    private broadcast(message: any, excludeUserId?: string): void {
        this.socketConnections.forEach((socket, userId) => {
            if (userId !== excludeUserId && socket.readyState === WebSocket.OPEN) {
                try {
                    socket.send(JSON.stringify(message))
                } catch (_error) {
                    console.error(`Failed to send message to user ${userId}:`, error)
                    this.socketConnections.delete(userId)
                }
            }
        })
    }

    // WebSocket connection management
    addConnection(userId: string, socket: WebSocket): void {
        this.socketConnections.set(userId, socket)

        socket.onclose = () => {
            this.socketConnections.delete(userId)
            const collaborator = this.collaborators.get(userId)
            if (collaborator) {
                collaborator.online = false
            }
        }

        socket.onerror = (error) => {
            console.error(`WebSocket error for user ${userId}:`, error)
            this.socketConnections.delete(userId)
        }

        // Mark collaborator as online
        const collaborator = this.collaborators.get(userId)
        if (collaborator) {
            collaborator.online = true
        }
    }

    removeConnection(userId: string): void {
        const socket = this.socketConnections.get(userId)
        if (socket) {
            socket.close()
            this.socketConnections.delete(userId)
        }

        const collaborator = this.collaborators.get(userId)
        if (collaborator) {
            collaborator.online = false
        }
    }

    // Statistics
    getCollaborationStats() {
        return {
            totalCollaborators: this.collaborators.size,
            onlineCollaborators: Array.from(this.collaborators.values()).filter(c => c.online).length,
            totalComments: Array.from(this.comments.values()).reduce((total, comments) => total + comments.length, 0),
            recentActivity: this.activityFeed.length,
            securityLevel: this.securityContext.level,
            auditEntries: this.securityContext.accessLog.length
        }
    }
}
