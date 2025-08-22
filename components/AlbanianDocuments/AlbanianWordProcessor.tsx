'use client'

import React, { useState, useRef } from 'react'

interface DocumentFormat {
  fontFamily: string
  fontSize: number
  lineHeight: number
  margins: {
    top: number
    right: number
    bottom: number
    left: number
  }
  headerHeight: number
  footerHeight: number
}

const traditionalAlbanianFormat: DocumentFormat = {
  fontFamily: 'Times New Roman, serif',
  fontSize: 12,
  lineHeight: 1.5,
  margins: {
    top: 2.5,
    right: 2,
    bottom: 2.5,
    left: 3
  },
  headerHeight: 1.5,
  footerHeight: 1.5
}

export const AlbanianWordProcessor: React.FC = () => {
  const [content, setContent] = useState('')
  const [documentTitle, setDocumentTitle] = useState('Dokument i Ri')
  const [letterhead, setLetterhead] = useState('')
  const [showFormatting, setShowFormatting] = useState(false)
  const [currentFormat, setCurrentFormat] = useState(traditionalAlbanianFormat)
  const editorRef = useRef<HTMLDivElement>(null)

  const albanianTemplates = [
    {
      name: 'Letër Zyrtare',
      content: `[Vendosni logos/shenja të institucionit]

${new Date().toLocaleDateString('sq-AL')}

LËNDA: [Shkruani lëndën e letrës]

I/E nderuar/e [Emri i marrësit],

[Teksti kryesor i letrës...]

Me respekt,

[Emri dhe mbiemri]
[Pozicioni]
[Kontaktet]`
    },
    {
      name: 'Aplikim për Punë',
      content: `${new Date().toLocaleDateString('sq-AL')}

Drejtuar: [Emri i kompanisë/institucionit]
Departamenti i Burimeve Njerëzore

LËNDA: Aplikim për pozicionin [Emri i pozicionit]

I/E nderuar/e,

Me anë të kësaj letre dëshiroj të shpreh interesimin tim për pozicionin e [emri i pozicionit] të publikuar në [burimi].

[Arsyet pse jeni kandidati i përshtatshëm...]

[Përvojat dhe kualifikimet...]

[Përfundim dhe falënderim...]

Me konsideratë të veçantë,

[Emri dhe mbiemri]
[Telefoni]
[Email-i]`
    },
    {
      name: 'Raport Zyrtar',
      content: `REPUBLIKA E SHQIPËRISË
[EMRI I INSTITUCIONIT]

RAPORT

Për: [Titulli i raportit]
Data: ${new Date().toLocaleDateString('sq-AL')}
Përgatitur nga: [Emri]

1. HYRJE
[Qëllimi i raportit...]

2. METODOLOGJIA
[Si është realizuar puna...]

3. GJETJET KRYESORE
[Rezultatet e analizës...]

4. REKOMANDIME
[Rekomandimet për veprim...]

5. PËRFUNDIME
[Përfundimi i raportit...]

Përpiloi:                           Miratoi:
______________                    ______________
[Emri, Pozicioni]                 [Emri, Pozicioni]`
    }
  ]

  const insertTemplate = (template: any) => {
    setContent(template.content)
    setDocumentTitle(template.name)
  }

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }

  const insertSpecialChar = (char: string) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(document.createTextNode(char))
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const exportToPDF = () => {
    // Implementim për eksportim në PDF
    window.print()
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toolbar */}
      <div className="bg-white border-b shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Document Title */}
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="text-lg font-bold border-none bg-transparent focus:outline-none focus:bg-gray-50 px-2 py-1 rounded"
            placeholder="Titulli i dokumentit"
          />

          <div className="flex items-center space-x-2 border-l pl-4">
            {/* Text Formatting */}
            <button
              onClick={() => formatText('bold')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Të trasha (Ctrl+B)"
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => formatText('italic')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Të pjerrta (Ctrl+I)"
            >
              <em>I</em>
            </button>
            <button
              onClick={() => formatText('underline')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Të nënvizuara (Ctrl+U)"
            >
              <u>U</u>
            </button>
          </div>

          <div className="flex items-center space-x-2 border-l pl-4">
            {/* Alignment */}
            <button
              onClick={() => formatText('justifyLeft')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Rreshtim majtas"
            >
              ←
            </button>
            <button
              onClick={() => formatText('justifyCenter')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Rreshtim në qendër"
            >
              ↔
            </button>
            <button
              onClick={() => formatText('justifyRight')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Rreshtim djathtas"
            >
              →
            </button>
            <button
              onClick={() => formatText('justifyFull')}
              className="p-2 hover:bg-gray-100 rounded"
              title="Justifikim"
            >
              ═
            </button>
          </div>

          <div className="flex items-center space-x-2 border-l pl-4">
            {/* Albanian Special Characters */}
            {['ë', 'ç', 'Ë', 'Ç'].map((char) => (
              <button
                key={char}
                onClick={() => insertSpecialChar(char)}
                className="p-2 hover:bg-gray-100 rounded font-bold"
                title={`Vendos shkronjën: ${char}`}
              >
                {char}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2 border-l pl-4">
            {/* Templates */}
            <select
              onChange={(e) => {
                const template = albanianTemplates[parseInt(e.target.value)]
                if (template) insertTemplate(template)
              }}
              className="px-3 py-1 border rounded"
              defaultValue=""
            >
              <option value="">Zgjidhni shablon...</option>
              {albanianTemplates.map((template, index) => (
                <option key={index} value={index}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 border-l pl-4">
            {/* Export Options */}
            <button
              onClick={exportToPDF}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              📄 PDF
            </button>
            <button
              onClick={() => {
                const element = document.createElement('a')
                const file = new Blob([content], { type: 'text/plain' })
                element.href = URL.createObjectURL(file)
                element.download = `${documentTitle}.txt`
                element.click()
              }}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              💾 Ruaj
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex">
        {/* Sidebar - Format Options */}
        {showFormatting && (
          <div className="w-64 bg-white border-r p-4">
            <h3 className="font-bold mb-4">Formatimi</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fonti</label>
                <select
                  value={currentFormat.fontFamily}
                  onChange={(e) => setCurrentFormat({...currentFormat, fontFamily: e.target.value})}
                  className="w-full p-2 border rounded"
                >
                  <option value="Times New Roman, serif">Times New Roman</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Calibri, sans-serif">Calibri</option>
                  <option value="Georgia, serif">Georgia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Madhësia e fontit</label>
                <input
                  type="number"
                  value={currentFormat.fontSize}
                  onChange={(e) => setCurrentFormat({...currentFormat, fontSize: parseInt(e.target.value)})}
                  className="w-full p-2 border rounded"
                  min="8"
                  max="72"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Lartësia e rreshtit</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentFormat.lineHeight}
                  onChange={(e) => setCurrentFormat({...currentFormat, lineHeight: parseFloat(e.target.value)})}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Document Area */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {/* Document Header */}
            {letterhead && (
              <div className="text-center border-b pb-4 mb-6">
                <div dangerouslySetInnerHTML={{ __html: letterhead }} />
              </div>
            )}

            {/* Main Document */}
            <div
              className="bg-white shadow-lg min-h-[11in] p-8"
              style={{
                fontFamily: currentFormat.fontFamily,
                fontSize: `${currentFormat.fontSize}pt`,
                lineHeight: currentFormat.lineHeight,
                marginTop: `${currentFormat.margins.top}cm`,
                marginRight: `${currentFormat.margins.right}cm`,
                marginBottom: `${currentFormat.margins.bottom}cm`,
                marginLeft: `${currentFormat.margins.left}cm`,
                width: '21cm' // A4 width
              }}
            >
              <div
                ref={editorRef}
                contentEditable
                className="outline-none min-h-full"
                onInput={(e) => setContent((e.target as HTMLDivElement).innerHTML)}
                style={{ whiteSpace: 'pre-wrap' }}
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white border-t p-2 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <div>
            Fjalë: {content.replace(/<[^>]*>/g, '').split(/\s+/).length} | 
            Karaktere: {content.replace(/<[^>]*>/g, '').length}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFormatting(!showFormatting)}
              className="text-blue-600 hover:underline"
            >
              {showFormatting ? 'Fshih' : 'Shfaq'} formatimin
            </button>
            <span>Format: A4 | {currentFormat.fontSize}pt</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlbanianWordProcessor
