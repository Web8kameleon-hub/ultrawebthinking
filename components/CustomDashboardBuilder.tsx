// EuroWeb Ultra - Custom Dashboard Builder
// Drag-and-drop widgets për personalizim të plotë

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

interface Widget {
  id: string;
  type: 'chart' | 'metrics' | 'neural' | 'edge' | 'security' | 'custom';
  title: string;
  icon: string;
  size: 'small' | 'medium' | 'large';
  position: { x: number; y: number };
  data?: any;
  config?: any;
}

interface DashboardLayout {
  id: string;
  name: string;
  widgets: Widget[];
  created: Date;
  lastModified: Date;
}

const availableWidgets: Omit<Widget, 'id' | 'position'>[] = [
  {
    type: 'neural',
    title: 'Neural Load Monitor',
    icon: '🧠',
    size: 'medium',
    data: { load: 72, trend: 'down' }
  },
  {
    type: 'metrics',
    title: 'Performance Metrics',
    icon: '📊',
    size: 'large',
    data: { cpu: 45, memory: 62, network: 38 }
  },
  {
    type: 'edge',
    title: 'Edge Nodes Status',
    icon: '📡',
    size: 'medium',
    data: { online: 8, offline: 1, maintenance: 2 }
  },
  {
    type: 'security',
    title: 'Security Dashboard',
    icon: '🛡️',
    size: 'large',
    data: { threats: 3, blocked: 157, status: 'secure' }
  },
  {
    type: 'chart',
    title: 'Real-time Analytics',
    icon: '📈',
    size: 'large',
    data: { revenue: 15420, users: 1247, growth: 12.5 }
  },
  {
    type: 'custom',
    title: 'AGI×Module Status',
    icon: '🤖',
    size: 'small',
    data: { active: 6, total: 8, efficiency: 94 }
  }
];

export default function CustomDashboardBuilder() {
  const [currentLayout, setCurrentLayout] = useState<DashboardLayout>({
    id: 'default',
    name: 'Main Dashboard',
    widgets: [],
    created: new Date(),
    lastModified: new Date()
  });

  const [savedLayouts, setSavedLayouts] = useState<DashboardLayout[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);
  const [showWidgetPalette, setShowWidgetPalette] = useState(false);

  // Load saved layouts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('euroweb-dashboard-layouts');
    if (saved) {
      try {
        const layouts = JSON.parse(saved);
        setSavedLayouts(layouts);
        if (layouts.length > 0) {
          setCurrentLayout(layouts[0]);
        }
      } catch (error) {
        console.error('Error loading layouts:', error);
      }
    }
  }, []);

  // Save layouts to localStorage
  const saveLayouts = useCallback((layouts: DashboardLayout[]) => {
    localStorage.setItem('euroweb-dashboard-layouts', JSON.stringify(layouts));
    setSavedLayouts(layouts);
  }, []);

  // Add widget to dashboard
  const addWidget = useCallback((widgetTemplate: Omit<Widget, 'id' | 'position'>) => {
    const newWidget: Widget = {
      ...widgetTemplate,
      id: `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      position: { x: Math.random() * 200, y: Math.random() * 200 }
    };

    const updatedLayout = {
      ...currentLayout,
      widgets: [...currentLayout.widgets, newWidget],
      lastModified: new Date()
    };

    setCurrentLayout(updatedLayout);
    
    // Update saved layouts
    const updatedLayouts = savedLayouts.map(layout =>
      layout.id === currentLayout.id ? updatedLayout : layout
    );
    
    if (!savedLayouts.find(l => l.id === currentLayout.id)) {
      updatedLayouts.push(updatedLayout);
    }
    
    saveLayouts(updatedLayouts);
  }, [currentLayout, savedLayouts, saveLayouts]);

  // Remove widget
  const removeWidget = useCallback((widgetId: string) => {
    const updatedLayout = {
      ...currentLayout,
      widgets: currentLayout.widgets.filter(w => w.id !== widgetId),
      lastModified: new Date()
    };

    setCurrentLayout(updatedLayout);
    
    const updatedLayouts = savedLayouts.map(layout =>
      layout.id === currentLayout.id ? updatedLayout : layout
    );
    
    saveLayouts(updatedLayouts);
  }, [currentLayout, savedLayouts, saveLayouts]);

  // Create new layout
  const createNewLayout = useCallback(() => {
    const newLayout: DashboardLayout = {
      id: `layout-${Date.now()}`,
      name: `Dashboard ${savedLayouts.length + 1}`,
      widgets: [],
      created: new Date(),
      lastModified: new Date()
    };

    setCurrentLayout(newLayout);
    const updatedLayouts = [...savedLayouts, newLayout];
    saveLayouts(updatedLayouts);
  }, [savedLayouts, saveLayouts]);

  // Widget component renderer
  const renderWidget = (widget: Widget) => {
    const sizeClasses = {
      small: 'w-64 h-32',
      medium: 'w-80 h-48',
      large: 'w-96 h-64'
    };

    const getWidgetContent = () => {
      switch (widget.type) {
        case 'neural':
          return (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">Neural Load</h4>
                <span className="text-2xl">{widget.icon}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Load:</span>
                  <span className="font-bold text-blue-600">{widget.data?.load}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${widget.data?.load}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500">
                  Trend: {widget.data?.trend === 'up' ? '📈' : '📉'} {widget.data?.trend}
                </div>
              </div>
            </div>
          );

        case 'metrics':
          return (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">System Metrics</h4>
                <span className="text-2xl">{widget.icon}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">{widget.data?.cpu}%</div>
                  <div className="text-xs text-gray-500">CPU</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{widget.data?.memory}%</div>
                  <div className="text-xs text-gray-500">Memory</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-600">{widget.data?.network}%</div>
                  <div className="text-xs text-gray-500">Network</div>
                </div>
              </div>
            </div>
          );

        case 'edge':
          return (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">Edge Nodes</h4>
                <span className="text-2xl">{widget.icon}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-600">● Online:</span>
                  <span className="font-bold">{widget.data?.online}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-600">● Offline:</span>
                  <span className="font-bold">{widget.data?.offline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-600">● Maintenance:</span>
                  <span className="font-bold">{widget.data?.maintenance}</span>
                </div>
              </div>
            </div>
          );

        case 'security':
          return (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800">Security Status</h4>
                <span className="text-2xl">{widget.icon}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-red-600">Active Threats:</span>
                  <span className="font-bold">{widget.data?.threats}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-600">Blocked Today:</span>
                  <span className="font-bold">{widget.data?.blocked}</span>
                </div>
                <div className={`text-center p-2 rounded ${
                  widget.data?.status === 'secure' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {widget.data?.status === 'secure' ? '🔒 Secure' : '⚠️ At Risk'}
                </div>
              </div>
            </div>
          );

        default:
          return (
            <div className="p-4 text-center">
              <div className="text-4xl mb-2">{widget.icon}</div>
              <h4 className="font-semibold text-gray-800">{widget.title}</h4>
              <p className="text-sm text-gray-600 mt-2">Widget content here</p>
            </div>
          );
      }
    };

    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className={`bg-white rounded-lg shadow-lg border-2 border-transparent hover:border-blue-300 cursor-move relative ${sizeClasses[widget.size]}`}
        drag={isEditing}
        dragMomentum={false}
        dragElastic={0.1}
        whileDrag={{ scale: 1.05, zIndex: 1000 }}
        onClick={() => setSelectedWidget(widget)}
      >
        {isEditing && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              removeWidget(widget.id);
            }}
            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-10"
          >
            ×
          </button>
        )}
        {getWidgetContent()}
      </motion.div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">🎛️ Custom Dashboard Builder</h1>
            <p className="text-purple-100">
              Krijoni dashboard-in tuaj të personalizuar me widgets drag-and-drop
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isEditing 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-white text-purple-600 hover:bg-gray-100'
              }`}
            >
              {isEditing ? '✅ Finish Editing' : '✏️ Edit Dashboard'}
            </button>
            <button
              onClick={() => setShowWidgetPalette(!showWidgetPalette)}
              className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 font-medium"
            >
              🧩 Add Widgets
            </button>
          </div>
        </div>
      </motion.div>

      {/* Layout Management */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">📋 Dashboard Layouts</h2>
          <button
            onClick={createNewLayout}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            ➕ New Layout
          </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2">
          {savedLayouts.map((layout) => (
            <button
              key={layout.id}
              onClick={() => setCurrentLayout(layout)}
              className={`min-w-0 flex-shrink-0 px-4 py-2 rounded-lg border transition-all ${
                currentLayout.id === layout.id
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="font-medium">{layout.name}</div>
              <div className="text-xs text-gray-500">
                {layout.widgets.length} widgets
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Widget Palette */}
      <AnimatePresence>
        {showWidgetPalette && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold mb-4">🎨 Available Widgets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableWidgets.map((widget, index) => (
                <motion.button
                  key={index}
                  onClick={() => addWidget(widget)}
                  className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-left"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-2xl">{widget.icon}</span>
                  <div>
                    <div className="font-medium text-gray-800">{widget.title}</div>
                    <div className="text-xs text-gray-500 capitalize">{widget.size} • {widget.type}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Canvas */}
      <div className="bg-gray-50 rounded-lg p-6 min-h-[600px] relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{currentLayout.name}</h2>
          <div className="text-sm text-gray-500">
            {currentLayout.widgets.length} widgets • Last modified: {currentLayout.lastModified.toLocaleString()}
          </div>
        </div>

        {currentLayout.widgets.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-center">
            <div className="text-gray-400">
              <div className="text-6xl mb-4">🎛️</div>
              <h3 className="text-xl font-semibold mb-2">Dashboard-i juaj është bosh</h3>
              <p className="text-gray-500">
                Shtoni widgets nga paleta për të filluar ndërtimin e dashboard-it tuaj
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {currentLayout.widgets.map((widget) => (
                <motion.div key={widget.id}>
                  {renderWidget(widget)}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Widget Configuration Panel */}
      <AnimatePresence>
        {selectedWidget && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-4 right-4 bg-white rounded-lg shadow-2xl p-6 w-80 border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">⚙️ Widget Settings</h3>
              <button
                onClick={() => setSelectedWidget(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Widget Title
                </label>
                <input
                  type="text"
                  value={selectedWidget.title}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size
                </label>
                <select
                  value={selectedWidget.size}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              
              <div className="pt-4 border-t">
                <button
                  onClick={() => removeWidget(selectedWidget.id)}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 text-sm"
                >
                  🗑️ Remove Widget
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

