/**
 * AGI Notifications API
 * Real notification management and delivery system
 * 
 * @version 8.0.0-WEB8-API
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'agi';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: number;
  userId?: string;
  sessionId?: string;
  read: boolean;
  actionUrl?: string;
  data?: any;
}

interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  recentCount: number;
}

// In-memory storage for demo (use proper database in production)
const notifications = new Map<string, Notification[]>();
const globalNotifications: Notification[] = [];

// Generate sample notifications for demo
function generateSampleNotifications(): Notification[] {
  const now = Date.now();
  return [
    {
      id: 'agi-system-ready',
      title: 'ðŸ§  AGI System Ready',
      message: 'AGI neural networks initialized and ready for processing',
      type: 'agi',
      priority: 'high',
      timestamp: now - 5 * 60 * 1000,
      read: false,
      actionUrl: '/agi-dashboard',
      data: { systemStatus: 'ready', confidence: 95 }
    },
    {
      id: 'performance-optimized',
      title: 'âš¡ Performance Optimized',
      message: 'System performance improved by 23% using AGI optimization',
      type: 'success',
      priority: 'medium',
      timestamp: now - 15 * 60 * 1000,
      read: false,
      data: { performanceGain: 23, algorithm: 'neural-optimization' }
    },
    {
      id: 'eco-analysis-complete',
      title: 'ðŸŒ± Eco Analysis Complete',
      message: 'Environmental analysis finished with 3 recommendations',
      type: 'info',
      priority: 'medium',
      timestamp: now - 30 * 60 * 1000,
      read: false,
      actionUrl: '/eco-dashboard',
      data: { recommendations: 3, score: 87 }
    },
    {
      id: 'security-scan',
      title: 'ðŸ›¡ï¸ Security Scan Alert',
      message: 'Unusual activity detected, running enhanced monitoring',
      type: 'warning',
      priority: 'high',
      timestamp: now - 45 * 60 * 1000,
      read: true,
      data: { threatLevel: 'medium', action: 'monitoring' }
    },
    {
      id: 'backup-complete',
      title: 'ðŸ’¾ Backup Complete',
      message: 'Daily system backup completed successfully',
      type: 'success',
      priority: 'low',
      timestamp: now - 2 * 60 * 60 * 1000,
      read: true,
      data: { backupSize: '2.3GB', duration: '45s' }
    }
  ];
}

// Initialize with sample notifications
if (globalNotifications.length === 0) {
  globalNotifications.push(...generateSampleNotifications());
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const sessionId = request.headers.get('x-session-id') || request.headers.get("x-forwarded-for") || "unknown" || 'anonymous';
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const type = request.nextUrl.searchParams.get('type');
    const priority = request.nextUrl.searchParams.get('priority');
    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true';

    // Get user-specific notifications or global ones
    let userNotifications = notifications.get(userId || sessionId) || [];
    
    // Combine with global notifications
    const allNotifications = [...globalNotifications, ...userNotifications]
      .sort((a, b) => b.timestamp - a.timestamp);

    // Apply filters
    let filteredNotifications = allNotifications;
    
    if (type) {
      filteredNotifications = filteredNotifications.filter(n => n.type === type);
    }
    
    if (priority) {
      filteredNotifications = filteredNotifications.filter(n => n.priority === priority);
    }
    
    if (unreadOnly) {
      filteredNotifications = filteredNotifications.filter(n => !n.read);
    }

    // Apply limit
    const limitedNotifications = filteredNotifications.slice(0, limit);

    // Calculate statistics
    const stats: NotificationStats = {
      total: allNotifications.length,
      unread: allNotifications.filter(n => !n.read).length,
      byType: allNotifications.reduce((acc, n) => {
        acc[n.type] = (acc[n.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byPriority: allNotifications.reduce((acc, n) => {
        acc[n.priority] = (acc[n.priority] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      recentCount: allNotifications.filter(n => 
        n.timestamp > Date.now() - 60 * 60 * 1000 // Last hour
      ).length
    };

    // Return just count if that's all that's requested
    if (request.nextUrl.searchParams.get('count_only') === 'true') {
      return NextResponse.json({
        count: stats.unread,
        total: stats.total
      });
    }

    return NextResponse.json({
      notifications: limitedNotifications,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, message, type = 'info', priority = 'medium', actionUrl, data } = body;
    
    const userId = request.headers.get('x-user-id');
    const sessionId = request.headers.get('x-session-id') || request.headers.get("x-forwarded-for") || "unknown" || 'anonymous';

    // Validate input
    if (!title || !message) {
      return NextResponse.json(
        { error: 'Title and message are required' },
        { status: 400 }
      );
    }

    // Create notification
    const notification: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      message,
      type: type as Notification['type'],
      priority: priority as Notification['priority'],
      timestamp: Date.now(),
      userId: userId || 'anonymous',
      sessionId,
      read: false,
      actionUrl,
      data
    };

    // Store notification
    if (userId) {
      const userNotifs = notifications.get(userId) || [];
      userNotifs.unshift(notification);
      notifications.set(userId, userNotifs.slice(0, 100)); // Keep last 100
    } else {
      // Add to global notifications for anonymous users
      globalNotifications.unshift(notification);
      if (globalNotifications.length > 50) {
        globalNotifications.pop();
      }
    }

    console.log(`Notification created: ${title} for ${userId || sessionId}`);

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification created successfully'
    });

  } catch (error) {
    console.error('Error creating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, action } = body;
    
    const userId = request.headers.get('x-user-id');
    const sessionId = request.headers.get('x-session-id') || request.headers.get("x-forwarded-for") || "unknown" || 'anonymous';

    if (!notificationId || !action) {
      return NextResponse.json(
        { error: 'Notification ID and action are required' },
        { status: 400 }
      );
    }

    // Find and update notification
    let updated = false;
    
    // Check user notifications
    if (userId) {
      const userNotifs = notifications.get(userId) || [];
      const notifIndex = userNotifs.findIndex(n => n.id === notificationId);
      if (notifIndex !== -1) {
        const notif = userNotifs[notifIndex];
        if (action === 'mark_read' && notif) {
          notif.read = true;
          updated = true;
        } else if (action === 'mark_unread' && notif) {
          notif.read = false;
          updated = true;
        } else if (action === 'delete') {
        } else if (action === 'delete') {
          userNotifs.splice(notifIndex, 1);
          updated = true;
        }
        notifications.set(userId, userNotifs);
      }
    }
    if (!updated) {
      const globalIndex = globalNotifications.findIndex(n => n.id === notificationId);
      if (globalIndex !== -1) {
        const notif = globalNotifications[globalIndex];
        if (action === 'mark_read' && notif) {
          notif.read = true;
          updated = true;
        } else if (action === 'mark_unread' && notif) {
          notif.read = false;
          updated = true;
        } else if (action === 'delete') {
          globalNotifications.splice(globalIndex, 1);
          updated = true;
        }
      }
    }

    if (!updated) {
      return NextResponse.json(
        { error: 'Notification not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      action,
      notificationId,
      message: `Notification ${action.replace('_', ' ')} successfully`
    });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');
    const action = request.nextUrl.searchParams.get('action');

    if (action === 'clear_all') {
      if (userId) {
        notifications.delete(userId);
      } else {
        globalNotifications.length = 0;
        globalNotifications.push(...generateSampleNotifications());
      }

      return NextResponse.json({
        success: true,
        message: 'All notifications cleared'
      });
    }

    if (action === 'mark_all_read') {
      if (userId) {
        const userNotifs = notifications.get(userId) || [];
        userNotifs.forEach(n => n.read = true);
        notifications.set(userId, userNotifs);
      } else {
        globalNotifications.forEach(n => n.read = true);
      }

      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in bulk notification operation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


