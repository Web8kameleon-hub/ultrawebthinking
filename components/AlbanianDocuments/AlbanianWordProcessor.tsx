'use client'

import React, { useState } from 'react'

export const AlbanianWordProcessor: React.FC = (): React.JSX.Element => {
  const [content, setContent] = useState('')
  const [documentTitle, setDocumentTitle] = useState('Dokument i Ri')
  const [letterhead, setLetterhead] = useState('')
  const [isPreview, setIsPreview] = useState(false)

  const insertTemplate = (template: any) => {
    setContent(template.content)
    setDocumentTitle(template.name)
  }

  const templates = [
    {
      name: 'Letër Zyrtare',
      content: `${letterhead}

Data: ${new Date().toLocaleDateString('sq-AL')}

I/E nderuar/e [Emri i marrësit],

[Përmbajtja e letrës]

Me respekt,
[Emri juaj]
[Pozicioni]`
    },
    {
      name: 'Raport',
      content: `RAPORT

Titull: [Titulli i raportit]
Data: ${new Date().toLocaleDateString('sq-AL')}
Përgatitur nga: [Emri]

1. PËRMBLEDHJE EKZEKUTIVE
[Përmbledhja kryesore]

2. OBJEKTIVI
[Objektivi i raportit]

3. GJETJET
[Gjetjet kryesore]

4. REKOMANDIMET
[Rekomandimet]

5. KONKLUZION
[Konkluzion]`
    }
  ]

  const formatText = (command: string) => {
    document.execCommand(command, false)
  }

  const downloadDocument = () => {
    const element = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${documentTitle}.txt`
    element.click()
  }

  const printDocument = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${documentTitle}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
              h1 { text-align: center; }
            </style>
          </head>
          <body>
            <h1>${documentTitle}</h1>
            <div>${content.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">📝 Përpunues Tekstesh Shqip</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {isPreview ? '✏️ Redakto' : '👁️ Shiko'}
              </button>
              <button
                onClick={downloadDocument}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                💾 Ruaj
              </button>
              <button
                onClick={printDocument}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                🖨️ Shtyp
              </button>
            </div>
          </div>

          {/* Document Title */}
          <input
            type="text"
            value={documentTitle}
            onChange={(e) => setDocumentTitle(e.target.value)}
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Titulli i dokumentit"
          />

          {/* Templates */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Shablone:</label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  const template = templates[parseInt(e.target.value)]
                  insertTemplate(template)
                }
              }}
              className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue=""
            >
              <option value="">Zgjidhni shablon...</option>
              {templates.map((template, index) => (
                <option key={index} value={index}>
                  {template.name}
                </option>
              ))}
            </select>
          </div>

          {/* Formatting Toolbar */}
          {!isPreview && (
            <div className="flex gap-2 mb-4 p-2 bg-gray-50 rounded">
              <button
                onClick={() => formatText('bold')}
                className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
                title="Trash (Ctrl+B)"
              >
                <strong>B</strong>
              </button>
              <button
                onClick={() => formatText('italic')}
                className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
                title="Pjerrtë (Ctrl+I)"
              >
                <em>I</em>
              </button>
              <button
                onClick={() => formatText('underline')}
                className="px-3 py-1 bg-white border rounded hover:bg-gray-100"
                title="Nënvizim (Ctrl+U)"
              >
                <u>U</u>
              </button>
            </div>
          )}
        </div>

        {/* Editor/Preview */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          {isPreview ? (
            <div className="prose max-w-none">
              <h1 className="text-center mb-6">{documentTitle}</h1>
              <div 
                className="whitespace-pre-wrap leading-relaxed"
                dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br>') }}
              />
            </div>
          ) : (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 p-4 border-none resize-none focus:outline-none"
              placeholder="Filloni të shkruani dokumentin tuaj këtu..."
              style={{ minHeight: '500px', fontFamily: 'Georgia, serif', fontSize: '16px', lineHeight: '1.6' }}
            />
          )}
        </div>

        {/* Status Bar */}
        <div className="mt-4 bg-gray-100 rounded-lg p-3 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Karaktere: {content.length}</span>
            <span>Fjalë: {content.trim() ? content.trim().split(/\s+/).length : 0}</span>
            <span>Mënyrë: {isPreview ? 'Shikim' : 'Redaktim'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AlbanianWordProcessor
