'use client';

import { motion } from 'framer-motion';
import React, { useEffect } from 'react';

interface HeavyChartProps {
  onLoad?: () => void;
}

const HeavyChart: React.FC<HeavyChartProps> = ({ onLoad }) => {
  useEffect(() => {
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);

  // Simulated heavy chart data
  const chartData = Array.from({ length: 50 }, (_, i) => ({
    x: i,
    y: Math.sin(i * 0.1) * 100 + Math.random() * 50
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Grafiku i Performancës</h2>
        <p className="text-gray-600 mb-6">
          Ky është një komponent i ngarkuar me lazy loading për demonstrim.
        </p>
        
        {/* Simulated Chart */}
        <div className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-end justify-between h-64 space-x-1">
            {chartData.map((point, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${Math.abs(point.y)}%` }}
                transition={{ delay: index * 0.02, duration: 0.5 }}
                className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t flex-1 min-w-0"
                style={{ maxHeight: '100%' }}
              />
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-500">
            Të dhënat e simuluara të performancës
          </div>
        </div>
      </div>

      {/* Additional chart info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-green-600">+15.3%</div>
          <div className="text-sm text-gray-600">Rritje mujore</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-blue-600">2,847</div>
          <div className="text-sm text-gray-600">Përdorues aktivë</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-2xl font-bold text-purple-600">98.5%</div>
          <div className="text-sm text-gray-600">Disponueshmëri</div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeavyChart;
