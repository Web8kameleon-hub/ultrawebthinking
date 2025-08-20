/**
 * AGI Office Module
 * Sistemi i zyrës me AI për produktivitet dhe menaxhim dokumentesh
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function AGIOffice() {
  const [activeSection, setActiveSection] = useState('documents');

  const sections = [
    { id: 'documents', title: 'Dokumentet', icon: '📄' },
    { id: 'spreadsheets', title: 'Tabelat', icon: '📊' },
    { id: 'presentations', title: 'Prezantimet', icon: '📈' },
    { id: 'calendar', title: 'Kalendari', icon: '📅' },
    { id: 'tasks', title: 'Detyrat', icon: '✅' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">💼 AGI Office</h1>
          <p className="text-slate-600 mb-8">Sistemi inteligjent i zyrës për produktivitet maksimal</p>

          {/* Navigation */}
          <div className="flex space-x-1 mb-8 bg-slate-100 p-1 rounded-lg">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-md transition-all
                  ${activeSection === section.id
                    ? 'bg-white shadow-sm text-blue-600'
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
            {activeSection === 'documents' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">📝 Dokumente të Fundit</h3>
                  <div className="space-y-2">
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium">Raporti Mujor</p>
                      <p className="text-sm text-slate-500">Përditësuar 2 orë më parë</p>
                    </div>
                    <div className="bg-white p-3 rounded border">
                      <p className="font-medium">Plani Strategjik</p>
                      <p className="text-sm text-slate-500">Përditësuar dje</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">🤖 AI Suggestions</h3>
                  <div className="space-y-2">
                    <div className="bg-blue-50 p-3 rounded border border-blue-200">
                      <p className="text-sm">AI sugjeron të përmirësoni strukturën e raportit</p>
                    </div>
                    <div className="bg-green-50 p-3 rounded border border-green-200">
                      <p className="text-sm">Dokumenti është i optimizuar për SEO</p>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-lg">
                  <h3 className="font-semibold mb-3">📈 Statistikat</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Dokumente aktive</span>
                      <span className="font-semibold">24</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Përmirësime AI</span>
                      <span className="font-semibold">156</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Koha e kursyer</span>
                      <span className="font-semibold">12h</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'spreadsheets' && (
              <div className="bg-slate-50 p-8 rounded-lg text-center">
                <div className="text-6xl mb-4">📊</div>
                <h2 className="text-xl font-semibold mb-4">AGI Spreadsheets</h2>
                <p className="text-slate-600 mb-6">Tabela inteligjente me analiza automatike dhe parashikime AI</p>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Krijo Tabelë të Re
                </button>
              </div>
            )}

            {activeSection === 'presentations' && (
              <div className="bg-slate-50 p-8 rounded-lg text-center">
                <div className="text-6xl mb-4">📈</div>
                <h2 className="text-xl font-semibold mb-4">AGI Presentations</h2>
                <p className="text-slate-600 mb-6">Prezantime automatike me design AI dhe përmbajtje të optimizuar</p>
                <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Krijo Prezantim
                </button>
              </div>
            )}

            {activeSection === 'calendar' && (
              <div className="bg-slate-50 p-8 rounded-lg text-center">
                <div className="text-6xl mb-4">📅</div>
                <h2 className="text-xl font-semibold mb-4">AGI Calendar</h2>
                <p className="text-slate-600 mb-6">Kalendar inteligjent me planifikim automatik dhe sugjetime AI</p>
                <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Shiko Kalendarin
                </button>
              </div>
            )}

            {activeSection === 'tasks' && (
              <div className="bg-slate-50 p-8 rounded-lg text-center">
                <div className="text-6xl mb-4">✅</div>
                <h2 className="text-xl font-semibold mb-4">AGI Tasks</h2>
                <p className="text-slate-600 mb-6">Menaxhim detyravev me prioritizim automatik dhe deadline AI</p>
                <button className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                  Menaxho Detyrat
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
