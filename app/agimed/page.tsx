/**
 * AGI Medical Module  
 * Sistemi mjekësor me AI për diagnostikime dhe trajtime
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AGIMedical() {
  const [activeSection, setActiveSection] = useState('dashboard');

  const sections = [
    { id: 'dashboard', title: 'Dashboard', icon: '📊' },
    { id: 'diagnosis', title: 'Diagnostikimi', icon: '🔬' },
    { id: 'treatment', title: 'Trajtimi', icon: '💊' },
    { id: 'monitoring', title: 'Monitorimi', icon: '📈' },
    { id: 'research', title: 'Hulumtimi', icon: '🧬' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">🏥 AGI Medical</h1>
          <p className="text-slate-600 mb-8">Sistemi inteligjent mjekësor për diagnostikime të sakta dhe trajtime të personalizuara</p>

          {/* Navigation */}
          <div className="flex space-x-1 mb-8 bg-slate-100 p-1 rounded-lg">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md transition-all
                  ${activeSection === section.id
                    ? 'bg-white shadow-sm text-red-600'
                    : 'text-slate-600 hover:text-slate-900'
                  }
                `}
              >
                <span>{section.icon}</span>
                <span className="font-medium">{section.title}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeSection === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">🚨 Raste Urgjente</h3>
                  <p className="text-3xl font-bold text-red-600">3</p>
                  <p className="text-sm text-red-600">Kërkojnë vëmendje të menjëhershme</p>
                </div>
                
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2">🔬 Diagnostikime</h3>
                  <p className="text-3xl font-bold text-blue-600">127</p>
                  <p className="text-sm text-blue-600">Kryer sot</p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Sakësia AI</h3>
                  <p className="text-3xl font-bold text-green-600">98.7%</p>
                  <p className="text-sm text-green-600">Në diagnostikime</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">👥 Pacientë Aktiv</h3>
                  <p className="text-3xl font-bold text-purple-600">1,245</p>
                  <p className="text-sm text-purple-600">Në monitorim</p>
                </div>
              </div>
            )}

            {activeSection === 'diagnosis' && (
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-4">🔬 AI Diagnostic Tools</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium mb-2">🧠 Neuro AI</h4>
                      <p className="text-sm text-slate-600">Analiza e sistemit nervor dhe trurit</p>
                      <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700">
                        Fillo Analizën
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium mb-2">❤️ Cardio AI</h4>
                      <p className="text-sm text-slate-600">Monitorimi i sistemit kardiovaskular</p>
                      <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded text-sm hover:bg-red-700">
                        Kontrollo Zemrën
                      </button>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h4 className="font-medium mb-2">🩺 General AI</h4>
                      <p className="text-sm text-slate-600">Diagnostikime të përgjithshme</p>
                      <button className="mt-3 bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700">
                        Krijo Raport
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-yellow-800 mb-3">⚠️ Kujdes Medical</h3>
                  <p className="text-yellow-700">
                    Ky sistem është për mbështetje dhe nuk zëvendëson konsultimin me mjekun tuaj. 
                    Gjithmonë konsultohuni me një profesionist mjekësor për diagnoza dhe trajtime.
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'treatment' && (
              <div className="bg-slate-50 p-8 rounded-lg text-center">
                <div className="text-6xl mb-4">💊</div>
                <h2 className="text-xl font-semibold mb-4">AI Treatment Plans</h2>
                <p className="text-slate-600 mb-6">Plane trajtime të personalizuara me AI për çdo pacient</p>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Krijo Plan Trajtimi
                </button>
              </div>
            )}

            {activeSection === 'monitoring' && (
              <div className="bg-slate-50 p-8 rounded-lg text-center">
                <div className="text-6xl mb-4">📈</div>
                <h2 className="text-xl font-semibold mb-4">Patient Monitoring</h2>
                <p className="text-slate-600 mb-6">Monitorim në kohë reale me sensorë IoT dhe analiza AI</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Shiko Monitorimin
                </button>
              </div>
            )}

            {activeSection === 'research' && (
              <div className="bg-slate-50 p-8 rounded-lg text-center">
                <div className="text-6xl mb-4">🧬</div>
                <h2 className="text-xl font-semibold mb-4">Medical Research AI</h2>
                <p className="text-slate-600 mb-6">Hulumtime mjekësore të përshpejtuara me AI dhe big data</p>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Eksploro Hulumtimet
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
