import { NextFunction, Request, Response, Router } from 'express';
import { EthicsOrchestrator } from '../ethics/EthicsOrchestrator';

// Extend Request type
interface AuthenticatedRequest extends Request {
    user?: { id: string; name: string };
}

const router = Router();
const ethics = new EthicsOrchestrator();

// Middleware për autentifikim (thjeshtë për demo)
const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization || req.query.auth;
    if (!auth || auth !== 'Bearer web8-admin-token') {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    req.user = { id: 'admin', name: 'System Admin' }; // Mock user
    next();
};/**
 * Dashboard data për UI
 */
router.get('/dashboard', requireAuth, (req, res) => {
    try {
        const data = ethics.getDashboardData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get dashboard data' });
    }
});

/**
 * Sistema kërkon leje për një veprim
 */
router.post('/request-action', async (req, res) => {
    try {
        const { requestedBy, action, target, reason, severity, metadata } = req.body;

        if (!requestedBy || !action || !reason) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await ethics.requestAction({
            requestedBy,
            action,
            target,
            reason,
            severity,
            metadata
        });

        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Action request failed' });
    }
});

/**
 * Human miratim/refuzim i vendimeve
 */
router.post('/decisions/:decisionId/approve', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { decisionId } = req.params;
        const { approved, reason } = req.body;
        const approvedBy = req.user?.name || 'Unknown';

        if (typeof approved !== 'boolean') {
            return res.status(400).json({ error: 'approved must be boolean' });
        } const success = await ethics.humanDecision(decisionId, approved, approvedBy);

        if (!success) {
            return res.status(404).json({ error: 'Decision not found' });
        }

        res.json({
            success: true,
            decisionId,
            approved,
            approvedBy,
            reason
        });
    } catch (error) {
        res.status(500).json({ error: 'Approval failed' });
    }
});

/**
 * Release module nga quarantine
 */
router.post('/quarantine/:moduleId/release', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
        const { moduleId } = req.params;
        const { reason } = req.body;
        const releasedBy = req.user?.name || 'Unknown'; const success = ethics.releaseQuarantinedModule(moduleId, releasedBy);

        if (!success) {
            return res.status(404).json({ error: 'Module not found or not quarantined' });
        }

        res.json({
            success: true,
            moduleId,
            releasedBy,
            reason
        });
    } catch (error) {
        res.status(500).json({ error: 'Release failed' });
    }
});

/**
 * Aktivizo emergency mode
 */
router.post('/emergency', requireAuth, (req: AuthenticatedRequest, res: Response) => {
    try {
        const { reason } = req.body;
        const activatedBy = req.user?.name || 'Unknown';

        if (!reason) {
            return res.status(400).json({ error: 'Reason required' });
        } ethics.activateEmergencyMode(reason, activatedBy);

        res.json({
            success: true,
            message: 'Emergency mode activated',
            reason,
            activatedBy,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ error: 'Emergency activation failed' });
    }
});

/**
 * Sistema status
 */
router.get('/status', (req, res) => {
    try {
        const status = ethics.getSystemStatus();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: 'Status check failed' });
    }
});

/**
 * Health check
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'ethics-ai-defense',
        version: '1.0.0'
    });
});

export default router;
