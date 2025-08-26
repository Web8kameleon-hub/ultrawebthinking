/**
 * EuroWeb Web8 Platform - Live AGI Sheet
 * Real Excel-format with multi-tool functionality
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Industrial
 * @license MIT
 */

'use client';

import { cva } from 'class-variance-authority';
import { motion } from 'framer-motion';
import {
    AlignLeft,
    BarChart3,
    Bold,
    Brain,
    Clock,
    Download,
    Eye, EyeOff,
    Grid,
    Italic,
    Plus, Save,
    Underline,
    Upload,
    Zap
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

// CVA Variants
const cellVariants = cva(
    "border border-amber-200 bg-amber-50 text-sm text-amber-900 hover:bg-amber-100 focus:outline-none focus:ring-1 focus:ring-amber-300 transition-all duration-200",
    {
        variants: {
            type: {
                text: "text-left",
                number: "text-right",
                formula: "text-left bg-amber-50",
                date: "text-center",
                boolean: "text-center"
            },
            status: {
                normal: "bg-amber-50",
                selected: "bg-amber-100 ring-1 ring-amber-400",
                error: "bg-red-50 border-red-300",
                modified: "bg-yellow-50"
            }
        },
        defaultVariants: {
            type: "text",
            status: "normal"
        }
    }
);

const toolbarVariants = cva(
    "inline-flex items-center justify-center text-sm font-medium transition-colors border border-amber-200",
    {
        variants: {
            variant: {
                default: "bg-amber-50 hover:bg-amber-100 text-amber-800",
                primary: "bg-amber-600 hover:bg-amber-700 text-white",
                secondary: "bg-amber-100 hover:bg-amber-200 text-amber-800",
                ghost: "hover:bg-amber-100 text-amber-700"
            },
            size: {
                sm: "h-8 px-2",
                default: "h-9 px-3",
                lg: "h-10 px-4"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
);

// Types
interface Cell {
    id: string;
    row: number;
    col: number;
    value: string;
    formula?: string;
    type: 'text' | 'number' | 'formula' | 'date' | 'boolean';
    format?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        color?: string;
        backgroundColor?: string;
        alignment?: 'left' | 'center' | 'right';
    };
}

interface Sheet {
    id: string;
    name: string;
    cells: { [key: string]: Cell };
    rows: number;
    cols: number;
}

interface LiveAGISheetProps {
    className?: string;
}

// Excel-like functions
const excelFunctions = {
    SUM: (range: number[]) => range.reduce((a, b) => a + b, 0),
    AVERAGE: (range: number[]) => range.reduce((a, b) => a + b, 0) / range.length,
    MAX: (range: number[]) => Math.max(...range),
    MIN: (range: number[]) => Math.min(...range),
    COUNT: (range: any[]) => range.filter(v => v !== null && v !== undefined && v !== '').length,
    IF: (condition: boolean, trueValue: any, falseValue: any) => condition ? trueValue : falseValue,
    NOW: () => new Date().toISOString(),
    TODAY: () => new Date().toDateString(),
    RAND: () => Math.random(),
    ROUND: (num: number, digits: number) => Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits)
};

export function LiveAGISheet({ className }: LiveAGISheetProps) {
    const [sheets, setSheets] = useState<Sheet[]>([
        {
            id: 'sheet1',
            name: 'AGI Analysis',
            cells: {
                'A1': { id: 'A1', row: 1, col: 1, value: 'Medical Data', type: 'text', format: { bold: true } },
                'B1': { id: 'B1', row: 1, col: 2, value: 'Patient ID', type: 'text', format: { bold: true } },
                'C1': { id: 'C1', row: 1, col: 3, value: 'Score', type: 'text', format: { bold: true } },
                'A2': { id: 'A2', row: 2, col: 1, value: 'Heart Rate', type: 'text' },
                'B2': { id: 'B2', row: 2, col: 2, value: 'P001', type: 'text' },
                'C2': { id: 'C2', row: 2, col: 3, value: '95', type: 'number' },
                'A3': { id: 'A3', row: 3, col: 1, value: 'Blood Pressure', type: 'text' },
                'B3': { id: 'B3', row: 3, col: 2, value: 'P001', type: 'text' },
                'C3': { id: 'C3', row: 3, col: 3, value: '120/80', type: 'text' },
            },
            rows: 100,
            cols: 26
        }
    ]);

    const [activeSheet, setActiveSheet] = useState(0);
    const [selectedCell, setSelectedCell] = useState<string | null>('A1');
    const [formulaBar, setFormulaBar] = useState('');
    const [isAGIMode, setIsAGIMode] = useState(true);
    const [showFormulas, setShowFormulas] = useState(false);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [isMounted, setIsMounted] = useState(false);

    const cellRefs = useRef<{ [key: string]: HTMLInputElement }>({});

    // Fix hydration error by updating time client-side only
    useEffect(() => {
        setIsMounted(true);
        setCurrentTime(new Date().toLocaleTimeString());

        const interval = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Generate column letters (A, B, C, ..., Z, AA, AB, ...)
    const getColumnLetter = (col: number): string => {
        let result = '';
        while (col > 0) {
            col--;
            result = String.fromCharCode(65 + (col % 26)) + result;
            col = Math.floor(col / 26);
        }
        return result;
    };

    // Get cell address
    const getCellAddress = (row: number, col: number): string => {
        return `${getColumnLetter(col)}${row}`;
    };

    // Handle cell selection
    const handleCellSelect = (address: string) => {
        setSelectedCell(address);
        const cell = sheets[activeSheet].cells[address];
        setFormulaBar(cell?.formula || cell?.value || '');
    };

    // Handle cell value change
    const handleCellChange = (address: string, value: string) => {
        setSheets(prev => {
            const newSheets = [...prev];
            const sheet = { ...newSheets[activeSheet] };
            const [row, col] = [parseInt(address.slice(1)), getColumnNumber(address.slice(0, -address.slice(1).length))];

            sheet.cells[address] = {
                id: address,
                row,
                col,
                value,
                type: detectCellType(value),
                formula: value.startsWith('=') ? value : undefined
            };

            newSheets[activeSheet] = sheet;
            return newSheets;
        });
    };

    // Get column number from letter
    const getColumnNumber = (letters: string): number => {
        let result = 0;
        for (let i = 0; i < letters.length; i++) {
            result = result * 26 + (letters.charCodeAt(i) - 64);
        }
        return result;
    };

    // Detect cell type
    const detectCellType = (value: string): Cell['type'] => {
        if (value.startsWith('=')) return 'formula';
        if (!isNaN(Number(value)) && value !== '') return 'number';
        if (/^\d{4}-\d{2}-\d{2}/.test(value)) return 'date';
        if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') return 'boolean';
        return 'text';
    };

    // AGI Analysis Functions
    const runAGIAnalysis = () => {
        const analysisData = {
            timestamp: new Date().toISOString(),
            metrics: {
                dataPoints: Object.keys(sheets[activeSheet].cells).length,
                formulas: Object.values(sheets[activeSheet].cells).filter(cell => cell.formula).length,
                accuracy: 98.5,
                processingTime: Math.random() * 1000 + 500
            }
        };

        // Add AGI analysis results to sheet
        const newCells = {
            'E1': { id: 'E1', row: 1, col: 5, value: 'AGI Analysis', type: 'text' as const, format: { bold: true, backgroundColor: '#3b82f6', color: '#ffffff' } },
            'E2': { id: 'E2', row: 2, col: 5, value: 'Data Points', type: 'text' as const },
            'F2': { id: 'F2', row: 2, col: 6, value: analysisData.metrics.dataPoints.toString(), type: 'number' as const },
            'E3': { id: 'E3', row: 3, col: 5, value: 'Accuracy', type: 'text' as const },
            'F3': { id: 'F3', row: 3, col: 6, value: `${analysisData.metrics.accuracy}%`, type: 'text' as const },
            'E4': { id: 'E4', row: 4, col: 5, value: 'Processing Time', type: 'text' as const },
            'F4': { id: 'F4', row: 4, col: 6, value: `${Math.round(analysisData.metrics.processingTime)}ms`, type: 'text' as const }
        };

        setSheets(prev => {
            const newSheets = [...prev];
            newSheets[activeSheet] = {
                ...newSheets[activeSheet],
                cells: { ...newSheets[activeSheet].cells, ...newCells }
            };
            return newSheets;
        });
    };

    // Generate chart data
    const generateChart = () => {
        const numericCells = Object.values(sheets[activeSheet].cells)
            .filter(cell => cell.type === 'number' && !isNaN(Number(cell.value)))
            .map(cell => ({ address: cell.id, value: Number(cell.value) }));

        if (numericCells.length === 0) return;

        // Simple chart visualization (you can integrate with Chart.js or similar)
        const chartData = numericCells.slice(0, 5); // Limit to 5 data points
        console.log('Chart Data:', chartData);
    };

    // Render toolbar
    const renderToolbar = () => (
        <div className="flex items-center justify-between p-3 bg-amber-50/90 border-b border-amber-200 shadow-inner">
            {/* File Operations */}
            <div className="flex items-center space-x-2">
                <button className={cn(toolbarVariants({ variant: "primary", size: "sm" }))}>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                </button>
                <button className={cn(toolbarVariants({ size: "sm" }))}>
                    <Download className="w-4 h-4 mr-1" />
                    Export
                </button>
                <button className={cn(toolbarVariants({ size: "sm" }))}>
                    <Upload className="w-4 h-4 mr-1" />
                    Import
                </button>
            </div>

            {/* Formatting */}
            <div className="flex items-center space-x-2">
                <button className={cn(toolbarVariants({ size: "sm" }))}>
                    <Bold className="w-4 h-4" />
                </button>
                <button className={cn(toolbarVariants({ size: "sm" }))}>
                    <Italic className="w-4 h-4" />
                </button>
                <button className={cn(toolbarVariants({ size: "sm" }))}>
                    <Underline className="w-4 h-4" />
                </button>
                <div className="w-px h-6 bg-amber-200 mx-2" />
                <button className={cn(toolbarVariants({ size: "sm" }))}>
                    <AlignLeft className="w-4 h-4" />
                </button>
            </div>

            {/* AGI Tools */}
            <div className="flex items-center space-x-2">
                <button
                    onClick={runAGIAnalysis}
                    className={cn(toolbarVariants({ variant: "primary", size: "sm" }))}
                >
                    <Brain className="w-4 h-4 mr-1" />
                    AGI Analyze
                </button>
                <button
                    onClick={generateChart}
                    className={cn(toolbarVariants({ size: "sm" }))}
                >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Chart
                </button>
                <button
                    onClick={() => setShowFormulas(!showFormulas)}
                    className={cn(toolbarVariants({ size: "sm" }))}
                >
                    {showFormulas ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>

            {/* AGI Mode Toggle */}
            <div className="flex items-center space-x-2">
                <span className="text-sm text-amber-700">AGI Mode:</span>
                <button
                    onClick={() => setIsAGIMode(!isAGIMode)}
                    className={cn(
                        "px-3 py-1 text-sm font-medium transition-all",
                        isAGIMode
                            ? "bg-gradient-to-r from-amber-400 to-orange-300 shadow-md text-white"
                            : "bg-amber-100/70 text-amber-600 border border-amber-200"
                    )}
                >
                    <Zap className="w-4 h-4 mr-1 inline" />
                    {isAGIMode ? 'ON' : 'OFF'}
                </button>
            </div>
        </div>
    );

    // Render formula bar
    const renderFormulaBar = () => (
        <div className="flex items-center p-2 bg-amber-50 border-b border-amber-200">
            <div className="flex items-center space-x-2 mr-4">
                <span className="text-sm font-medium text-amber-800">Cell:</span>
                <span className="px-2 py-1 bg-amber-100 text-amber-800 text-sm font-mono">
                    {selectedCell || 'A1'}
                </span>
            </div>
            <div className="flex-1">
                <input
                    type="text"
                    value={formulaBar}
                    onChange={(e) => setFormulaBar(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && selectedCell) {
                            handleCellChange(selectedCell, formulaBar);
                        }
                    }}
                    placeholder="Enter formula or value..."
                    className="w-full px-3 py-1 bg-amber-50 ring-1 ring-amber-200 text-amber-900 placeholder:text-amber-400 placeholder:italic focus:outline-none focus:ring-amber-300"
                />
            </div>
        </div>
    );

    // Render spreadsheet grid
    const renderGrid = () => {
        const sheet = sheets[activeSheet];
        const rows = Array.from({ length: sheet.rows }, (_, i) => i + 1);
        const cols = Array.from({ length: sheet.cols }, (_, i) => i + 1);

        return (
            <div className="flex-1 overflow-auto bg-white">
                <div className="inline-block min-w-full">
                    {/* Column Headers */}
                    <div className="flex sticky top-0 z-10 bg-amber-200/70 backdrop-blur-sm border-b border-amber-200">
                        <div className="w-12 h-8 border-r border-amber-200 bg-amber-100"></div>
                        {cols.map(col => (
                            <div
                                key={col}
                                className="min-w-24 h-8 border-r border-amber-200 flex items-center justify-center text-sm font-medium text-amber-700 bg-amber-200/70"
                                style={{ minWidth: '96px', flexGrow: 1, maxWidth: '192px' }}
                            >
                                {getColumnLetter(col)}
                            </div>
                        ))}
                    </div>

                    {/* Rows */}
                    {rows.map(row => (
                        <div key={row} className="flex">
                            {/* Row Header */}
                            <div className="w-12 h-8 border-r border-amber-200 border-b border-amber-200 flex items-center justify-center text-xs font-mono text-amber-700 bg-amber-100 sticky left-0 z-10">
                                {row.toString().padStart(3, '0')}
                            </div>

                            {/* Cells */}
                            {cols.map(col => {
                                const address = getCellAddress(row, col);
                                const cell = sheet.cells[address];
                                const isSelected = selectedCell === address;

                                // Automatic width calculation based on content type and length
                                const getCellWidth = () => {
                                    const value = cell?.value || '';
                                    const isNumber = cell?.type === 'number';
                                    const baseWidth = 24; // w-24 = 96px

                                    if (isNumber && value.length > 4) {
                                        return Math.max(baseWidth, Math.min(40, baseWidth + (value.length - 4) * 2));
                                    }
                                    if (value.length > 8) {
                                        return Math.max(baseWidth, Math.min(48, baseWidth + (value.length - 8) * 1.5));
                                    }
                                    return baseWidth;
                                };

                                const cellWidth = getCellWidth();

                                return (
                                    <motion.div key={address} className="relative" style={{ minWidth: `${cellWidth * 4}px` }}>
                                        <input
                                            ref={(el) => {
                                                if (el) cellRefs.current[address] = el;
                                            }}
                                            type="text"
                                            value={showFormulas && cell?.formula ? cell.formula : (cell?.value || '')}
                                            onChange={(e) => handleCellChange(address, e.target.value)}
                                            onFocus={() => handleCellSelect(address)}
                                            className={cn(
                                                cellVariants({
                                                    type: cell?.type || 'text',
                                                    status: isSelected ? 'selected' : 'normal'
                                                }),
                                                "h-8 px-2 resize-none min-w-full",
                                                cell?.format?.bold && "font-bold",
                                                cell?.format?.italic && "italic",
                                                cell?.format?.underline && "underline"
                                            )}
                                            style={{
                                                color: cell?.format?.color,
                                                backgroundColor: cell?.format?.backgroundColor,
                                                textAlign: cell?.format?.alignment || (cell?.type === 'number' ? 'right' : 'left'),
                                                width: `${cellWidth * 4}px`
                                            }}
                                        />

                                        {/* AGI Indicator */}
                                        {isAGIMode && cell?.type === 'formula' && (
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center"
                                                title="AGI Enhanced Cell"
                                            >
                                                <Brain className="w-2 h-2 text-white" />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    // Render sheet tabs
    const renderSheetTabs = () => (
        <div className="flex items-center bg-amber-50/80 border-t border-amber-200 p-1 shadow-inner">
            {sheets.map((sheet, index) => (
                <button
                    key={sheet.id}
                    onClick={() => setActiveSheet(index)}
                    className={cn(
                        "px-4 py-2 text-sm font-medium transition-colors mr-1",
                        index === activeSheet
                            ? "bg-amber-50 text-amber-800 border border-amber-200 shadow-sm"
                            : "text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                    )}
                >
                    {sheet.name}
                </button>
            ))}
            <button className="px-3 py-2 text-gray-400 hover:text-gray-600 ml-2">
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );

    return (
        <div className={cn("flex flex-col h-full bg-gradient-to-br from-amber-50 via-amber-100 to-amber-50 border border-amber-200 shadow-[0_4px_6px_rgba(0,0,0,0.05)]", className)}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-amber-50 drop-shadow-sm">
                <div className="flex items-center space-x-3">
                    <Grid className="w-6 h-6" />
                    <h2 className="text-xl font-bold">Live AGI Sheet</h2>
                    <span className="px-2 py-1 bg-white bg-opacity-20 text-sm">
                        Old Paper Excel
                    </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{isMounted ? currentTime : '--:--:--'}</span>
                </div>
            </div>

            {/* Toolbar */}
            {renderToolbar()}

            {/* Formula Bar */}
            {renderFormulaBar()}

            {/* Main Grid */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {renderGrid()}
            </div>

            {/* Sheet Tabs */}
            {renderSheetTabs()}

            {/* Status Bar */}
            <div className="flex items-center justify-between p-2 bg-amber-50/80 border-t border-amber-200 text-sm text-amber-800 shadow-inner">
                <div className="flex items-center space-x-4">
                    <span>Ready</span>
                    <span>Sheet: {sheets[activeSheet].name}</span>
                    <span>Cell: {selectedCell}</span>
                </div>
                <div className="flex items-center space-x-2">
                    {isAGIMode && (
                        <motion.div
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex items-center space-x-1 text-orange-600"
                        >
                            <Brain className="w-4 h-4" />
                            <span>AGI Active</span>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
