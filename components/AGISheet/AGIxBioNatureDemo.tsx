'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AGIBioNature } from './AGIBioNature';

interface AGIBioNatureDemoProps {
  initialMode?: 'biology' | 'medical' | 'comprehensive';
  initialTheme?: 'forest' | 'laboratory' | 'ecosystem' | 'medical';
}

export const AGIBioNatureDemo = ({
  initialMode = 'comprehensive',
  initialTheme = 'forest'
}: AGIBioNatureDemoProps) => {
  const [mode, setMode] = useState<'biology' | 'medical' | 'comprehensive'>(initialMode);
  const [theme, setTheme] = useState<'forest' | 'laboratory' | 'ecosystem' | 'medical'>(initialTheme);
  const [dataSource, setDataSource] = useState<'simulation' | 'live' | 'cached'>('simulation');

  const handleModeChange = (newMode: typeof mode) => {
    setMode(newMode);
  };

  const modeDescriptions = {
    biology: {
      title: 'Biology Mode',
      description: 'Basic biological analysis and specimen tracking'
    },
    medical: {
      title: 'Medical Mode', 
      description: 'Medical research and health impact analysis'
    },
    comprehensive: {
      title: 'Comprehensive Mode',
      description: 'Full ecosystem analysis with all features'
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            🌿 AGI BioNature Demo
          </h1>
          <p className="text-lg text-green-600">
            Advanced Biological Analysis & Ecosystem Intelligence
          </p>
        </div>

        <div className="mb-6 bg-white p-4 rounded-xl shadow-lg border border-green-200">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Analysis Mode</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(modeDescriptions).map(([key, desc]) => (
              <motion.button
                key={key}
                className={`p-4 rounded-lg border-2 transition-all ${
                  mode === key 
                    ? 'border-green-500 bg-green-50 text-green-800' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-green-300'
                }`}
                onClick={() => handleModeChange(key as typeof mode)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h4 className="font-semibold mb-2">{desc.title}</h4>
                <p className="text-sm">{desc.description}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <AGIBioNature
            mode={mode}
            theme={theme}
            dataSource={dataSource}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default AGIBioNatureDemo;
