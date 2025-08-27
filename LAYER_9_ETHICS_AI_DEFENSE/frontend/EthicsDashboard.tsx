import { AlertTriangle, Brain, CheckCircle, Clock, Lock, Shield, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export type EthicalDecision = {
    id: string;
    timestamp: number;
    context: string;
    action: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidence: number;
    humanApprovalRequired: boolean;
    approved?: boolean;
    approvedBy?: string;
    executed: boolean;
    outcome?: string;
};

export type AIBehaviorPattern = {
    id: string;
    timestamp: number;
    module: string;
    action: string;
    similarity: number;
    anomalyScore: number;
    flagged: boolean;
};

export type DashboardData = {
    pendingDecisions: EthicalDecision[];
    recentDecisions: EthicalDecision[];
    aiPatterns: AIBehaviorPattern[];
    systemStatus: {
        ethics: {
            enabled: boolean;
            mode: string;
            pendingDecisions: number;
            recentDecisions: number;
        };
        aiDefense: {
            recentActivityCount: number;
            flaggedPatterns: number;
            quarantinedModules: number;
            status: string;
        };
    };
};

const EthicsDashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<'overview' | 'decisions' | 'ai-patterns' | 'emergency'>('overview');

    useEffect(() => {
        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 5000); // Update every 5s
        return () => clearInterval(interval);
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/ethics/dashboard', {
                headers: { 'Authorization': 'Bearer web8-admin-token' }
            });

            if (!response.ok) throw new Error('Failed to fetch data');

            const dashboardData = await response.json();
            setData(dashboardData);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    const handleDecisionApproval = async (decisionId: string, approved: boolean, reason?: string) => {
        try {
            const response = await fetch(`/ethics/decisions/${decisionId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer web8-admin-token'
                },
                body: JSON.stringify({ approved, reason })
            });

            if (!response.ok) throw new Error('Approval failed');

            // Refresh data
            fetchDashboardData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Approval failed');
        }
    };

    const activateEmergencyMode = async () => {
        if (!confirm('Are you sure you want to activate EMERGENCY MODE? This will quarantine all AI modules.')) {
            return;
        }

        try {
            const response = await fetch('/ethics/emergency', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer web8-admin-token'
                },
                body: JSON.stringify({ reason: 'Manual activation from dashboard' })
            });

            if (!response.ok) throw new Error('Emergency activation failed');

            alert('Emergency mode activated successfully');
            fetchDashboardData();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Emergency activation failed');
        }
    };

    const getRiskLevelColor = (level: string) => {
        switch (level) {
            case 'LOW': return 'text-green-600 bg-green-100';
            case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
            case 'HIGH': return 'text-orange-600 bg-orange-100';
            case 'CRITICAL': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const formatTimestamp = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading Ethics Dashboard...</div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-600">Error: {error || 'No data available'}</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Shield className="w-8 h-8 text-blue-600" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Ethics & AI Defense Dashboard</h1>
                            <p className="text-gray-600">Web8 Autonomous Security System</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${data.systemStatus.aiDefense.status === 'NORMAL'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {data.systemStatus.aiDefense.status}
                        </div>
                        <button
                            onClick={activateEmergencyMode}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                        >
                            Emergency Mode
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending Decisions</p>
                            <p className="text-2xl font-bold text-gray-900">{data.systemStatus.ethics.pendingDecisions}</p>
                        </div>
                        <Clock className="w-8 h-8 text-orange-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">AI Activity (5min)</p>
                            <p className="text-2xl font-bold text-gray-900">{data.systemStatus.aiDefense.recentActivityCount}</p>
                        </div>
                        <Brain className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Flagged Patterns</p>
                            <p className="text-2xl font-bold text-gray-900">{data.systemStatus.aiDefense.flaggedPatterns}</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Quarantined Modules</p>
                            <p className="text-2xl font-bold text-gray-900">{data.systemStatus.aiDefense.quarantinedModules}</p>
                        </div>
                        <Lock className="w-8 h-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'decisions', label: 'Ethics Decisions' },
                            { id: 'ai-patterns', label: 'AI Patterns' },
                            { id: 'emergency', label: 'Emergency Controls' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setSelectedTab(tab.id as any)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${selectedTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {selectedTab === 'overview' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">System Overview</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Ethics Core Status</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Enabled:</span>
                                            <span className={data.systemStatus.ethics.enabled ? 'text-green-600' : 'text-red-600'}>
                                                {data.systemStatus.ethics.enabled ? 'Yes' : 'No'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Mode:</span>
                                            <span>{data.systemStatus.ethics.mode}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Recent Decisions:</span>
                                            <span>{data.systemStatus.ethics.recentDecisions}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">AI Defense Status</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Status:</span>
                                            <span className={`font-medium ${data.systemStatus.aiDefense.status === 'NORMAL' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {data.systemStatus.aiDefense.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Recent Activity:</span>
                                            <span>{data.systemStatus.aiDefense.recentActivityCount}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Quarantined:</span>
                                            <span>{data.systemStatus.aiDefense.quarantinedModules}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedTab === 'decisions' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Ethics Decisions Requiring Approval</h3>

                            {data.pendingDecisions.length === 0 ? (
                                <p className="text-gray-500">No pending decisions</p>
                            ) : (
                                <div className="space-y-4">
                                    {data.pendingDecisions.map((decision) => (
                                        <div key={decision.id} className="border rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskLevelColor(decision.riskLevel)}`}>
                                                            {decision.riskLevel}
                                                        </span>
                                                        <span className="text-sm text-gray-500">{formatTimestamp(decision.timestamp)}</span>
                                                    </div>
                                                    <h4 className="font-medium text-gray-900">{decision.action}</h4>
                                                    <p className="text-sm text-gray-600 mt-1">{JSON.parse(decision.context).reason}</p>
                                                    <div className="mt-2 text-xs text-gray-500">
                                                        Confidence: {(decision.confidence * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    <button
                                                        onClick={() => handleDecisionApproval(decision.id, true)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDecisionApproval(decision.id, false)}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {selectedTab === 'ai-patterns' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Recent AI Behavior Patterns</h3>

                            {data.aiPatterns.length === 0 ? (
                                <p className="text-gray-500">No recent AI patterns</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Module
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Action
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Anomaly Score
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Flagged
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Time
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {data.aiPatterns.map((pattern) => (
                                                <tr key={pattern.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {pattern.module}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {pattern.action}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${pattern.anomalyScore > 0.7 ? 'bg-red-100 text-red-800' :
                                                                pattern.anomalyScore > 0.4 ? 'bg-yellow-100 text-yellow-800' :
                                                                    'bg-green-100 text-green-800'
                                                            }`}>
                                                            {(pattern.anomalyScore * 100).toFixed(1)}%
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {pattern.flagged ? (
                                                            <AlertTriangle className="w-4 h-4 text-red-500" />
                                                        ) : (
                                                            <CheckCircle className="w-4 h-4 text-green-500" />
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatTimestamp(pattern.timestamp)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {selectedTab === 'emergency' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Emergency Controls</h3>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                <div className="flex items-start">
                                    <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                                    <div className="ml-3">
                                        <h4 className="text-lg font-medium text-red-800">Emergency Mode</h4>
                                        <p className="text-red-700 mt-1">
                                            Activating emergency mode will immediately quarantine all AI modules and switch the system to maximum security.
                                        </p>
                                        <div className="mt-4">
                                            <button
                                                onClick={activateEmergencyMode}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                                            >
                                                Activate Emergency Mode
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">System Controls</h4>
                                    <div className="space-y-3">
                                        <button className="w-full text-left px-3 py-2 border rounded hover:bg-gray-50">
                                            Force Re-scan All Modules
                                        </button>
                                        <button className="w-full text-left px-3 py-2 border rounded hover:bg-gray-50">
                                            Reset AI Behavior Baseline
                                        </button>
                                        <button className="w-full text-left px-3 py-2 border rounded hover:bg-gray-50">
                                            Export Security Logs
                                        </button>
                                    </div>
                                </div>

                                <div className="border rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-3">Contact Information</h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <p>Emergency Contact: [Configure in ethics.config.json]</p>
                                        <p>Security Team: security@web8.al</p>
                                        <p>24/7 Hotline: +355-XX-XXX-XXXX</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EthicsDashboard;
