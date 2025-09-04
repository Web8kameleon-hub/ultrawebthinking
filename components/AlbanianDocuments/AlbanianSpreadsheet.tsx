'use client'

import React, { useState } from 'react'

interface Cell {
  value: string
  formula?: string
  type?: 'text' | 'number' | 'formula'
}

interface Sheet {
  name: string
  cells: { [key: string]: Cell }
}

export const AlbanianSpreadsheet: React.FC = (): React.JSX.Element => {
  const [sheets, setSheets] = useState<Sheet[]>([
    {
      name: 'Fleta 1',
      cells: {}
    }
  ])
  const [activeSheet, setActiveSheet] = useState(0)
  const [selectedCell, setSelectedCell] = useState<string | null>(null)
  const [showFormulas, setShowFormulas] = useState(false)

  const sheet = sheets[activeSheet]

  const updateCell = (cellId: string, value: string) => {
    setSheets(prevSheets => {
      const newSheets = [...prevSheets]
      newSheets[activeSheet] = {
        ...newSheets[activeSheet],
        cells: {
          ...newSheets[activeSheet].cells,
          [cellId]: {
            value,
            type: value.startsWith('=') ? 'formula' : 'text'
          }
        }
      }
      return newSheets
    })
  }

  const getCellId = (row: number, col: number) => {
    const colLetter = String.fromCharCode(65 + col)
    return `${colLetter}${row + 1}`
  }

  const addSheet = () => {
    const newSheetName = `Fleta ${sheets.length + 1}`
    setSheets([...sheets, { name: newSheetName, cells: {} }])
    setActiveSheet(sheets.length)
  }

  const exportToCSV = () => {
    const csv = []
    for (let row = 0; row < 20; row++) {
      const rowData = []
      for (let col = 0; col < 10; col++) {
        const cellId = getCellId(row, col)
        const cell = sheet.cells[cellId]
        rowData.push(cell?.value || '')
      }
      csv.push(rowData.join(','))
    }
    
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sheet.name}.csv`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">📊 Tabelë Shqiptare</h1>
            <div className="flex gap-2">
              <button
                onClick={addSheet}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                + Fletë e Re
              </button>
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                📥 Eksporto CSV
              </button>
              <button
                onClick={() => setShowFormulas(!showFormulas)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                {showFormulas ? '📊 Shfaq Vlerat' : '📝 Shfaq Formulat'}
              </button>
            </div>
          </div>
        </div>

        {/* Sheet Tabs */}
        <div className="bg-white rounded-t-lg border-b">
          <div className="flex">
            {sheets.map((sheetData, index) => (
              <button
                key={index}
                onClick={() => setActiveSheet(index)}
                className={`px-4 py-2 border-r ${
                  activeSheet === index
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {sheetData.name}
              </button>
            ))}
          </div>
        </div>

        {/* Formula Bar */}
        {selectedCell && (
          <div className="bg-white border-x border-b p-3">
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                {selectedCell}
              </span>
              <input
                type="text"
                className="flex-1 px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sheet.cells[selectedCell]?.value || ''}
                onChange={(e) => updateCell(selectedCell, e.target.value)}
                placeholder="Shkruani vlerat ose formulat (filoni me =)"
              />
            </div>
          </div>
        )}

        {/* Spreadsheet Grid */}
        <div className="bg-white border rounded-b-lg overflow-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-12 h-8 bg-gray-100 border text-xs"></th>
                {Array.from({ length: 10 }, (_, col) => (
                  <th key={col} className="min-w-20 h-8 bg-gray-100 border text-xs font-medium">
                    {String.fromCharCode(65 + col)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }, (_, row) => (
                <tr key={row}>
                  <td className="w-12 h-8 bg-gray-100 border text-xs text-center font-medium">
                    {row + 1}
                  </td>
                  {Array.from({ length: 10 }, (_, col) => {
                    const cellId = getCellId(row, col)
                    const cell = sheet.cells[cellId]
                    const isSelected = selectedCell === cellId
                    
                    return (
                      <td
                        key={col}
                        className={`min-w-20 h-8 border cursor-cell ${
                          isSelected ? 'bg-blue-100 ring-2 ring-blue-500' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedCell(cellId)}
                      >
                        <div className="h-full w-full px-1 text-xs flex items-center">
                          {showFormulas && cell?.value?.startsWith('=') 
                            ? cell.value 
                            : cell?.value || ''
                          }
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status Bar */}
        <div className="bg-gray-50 border-x border-b rounded-b-lg p-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Fleta: {sheet.name}</span>
            <span>Qeliza e zgjedhur: {selectedCell || 'Asnjë'}</span>
            <span>Numri i qelizave me të dhëna: {Object.keys(sheet.cells).length}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
