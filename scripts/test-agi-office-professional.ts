/**
 * AGI Office Professional API Test Script
 * Tests all mathematical, linguistic, scanner, and copy functions
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

const API_BASE = 'http://localhost:3000/api'

// Test Data
const systemData = {
  mathematics: {
    expression: '2 + 3 * 4',
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    matrixA: [[1, 2], [3, 4]],
    matrixB: [[5, 6], [7, 8]],
    function: 'x * x',
    x: 5,
    a: 0,
    b: 10
  },
  linguistics: {
    text: 'This is a sample text for linguistic analysis. It contains multiple sentences and should provide good test data for our AGI Office suite.',
    targetLanguage: 'sq'
  },
  scanner: {
    quality: 'high',
    colorMode: 'color',
    format: 'pdf',
    count: 3
  },
  copy: {
    sources: ['document1.pdf', 'spreadsheet1.xlsx', 'presentation1.pptx'],
    destination: '/output/folder',
    fileList: ['file1.txt', 'file2.doc', 'file3.pdf', 'file4.xlsx']
  }
}

// API Test Functions
async function testAPI(endpoint: string, data: any) {
  try {
    console.log(`\n🔧 Testing ${endpoint}...`)
    const response = await fetch(`${API_BASE}/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    
    const result = await response.json()
    if (result.success) {
      console.log(`✅ ${endpoint} - SUCCESS`)
      console.log(`📊 Result:`, JSON.stringify(result.data, null, 2))
    } else {
      console.log(`❌ ${endpoint} - FAILED`)
      console.log(`💥 Error:`, result.error)
    }
    
    return result
  } catch (error) {
    console.log(`💀 ${endpoint} - NETWORK ERROR`)
    console.log(`🚨 Error:`, error.message)
    return { success: false, error: error.message }
  }
}

async function runProfessionalTests() {
  console.log('🚀 Starting AGI Office Professional Tests...')
  console.log('=' .repeat(60))

  // Mathematical Engine Tests
  console.log('\n🧮 MATHEMATICAL ENGINE TESTS')
  console.log('-'.repeat(40))
  
  await testAPI('agi-office', {
    action: 'calculate',
    expression: systemData.mathematics.expression
  })
  
  await testAPI('agi-office', {
    action: 'analyze_statistics',
    numbers: systemData.mathematics.numbers
  })
  
  await testAPI('agi-office', {
    action: 'matrix_multiply',
    matrixA: systemData.mathematics.matrixA,
    matrixB: systemData.mathematics.matrixB
  })
  
  await testAPI('agi-office', {
    action: 'calculate_derivative',
    function: systemData.mathematics.function,
    x: systemData.mathematics.x
  })
  
  await testAPI('agi-office', {
    action: 'calculate_integral',
    function: systemData.mathematics.function,
    a: systemData.mathematics.a,
    b: systemData.mathematics.b
  })

  // Linguistic Engine Tests
  console.log('\n🗣️ LINGUISTIC ENGINE TESTS')
  console.log('-'.repeat(40))
  
  await testAPI('agi-office', {
    action: 'analyze_text',
    text: systemData.linguistics.text
  })
  
  await testAPI('agi-office', {
    action: 'translate_text',
    text: systemData.linguistics.text,
    targetLanguage: systemData.linguistics.targetLanguage
  })
  
  await testAPI('agi-office', {
    action: 'check_grammar',
    text: systemData.linguistics.text
  })
  
  await testAPI('agi-office', {
    action: 'summarize_text',
    text: systemData.linguistics.text,
    sentences: 2
  })

  // Scanner Engine Tests
  console.log('\n📄 SCANNER ENGINE TESTS')
  console.log('-'.repeat(40))
  
  await testAPI('agi-office', {
    action: 'scan_document',
    quality: systemData.scanner.quality,
    colorMode: systemData.scanner.colorMode,
    format: systemData.scanner.format
  })
  
  await testAPI('agi-office', {
    action: 'perform_ocr',
    imageData: 'data:image/jpeg;base64,sample_image_data'
  })
  
  await testAPI('agi-office', {
    action: 'batch_scan',
    count: systemData.scanner.count,
    options: {
      quality: systemData.scanner.quality,
      colorMode: systemData.scanner.colorMode,
      format: systemData.scanner.format
    }
  })

  // Copy Engine Tests
  console.log('\n📁 COPY ENGINE TESTS')
  console.log('-'.repeat(40))
  
  await testAPI('agi-office', {
    action: 'copy_files',
    sources: systemData.copy.sources,
    destination: systemData.copy.destination
  })
  
  await testAPI('agi-office', {
    action: 'bulk_copy',
    fileList: systemData.copy.fileList,
    destination: systemData.copy.destination,
    options: {
      overwrite: true,
      preserveTimestamps: true,
      copyHiddenFiles: false
    }
  })
  
  await testAPI('agi-office', {
    action: 'smart_copy',
    sources: systemData.copy.sources,
    destination: systemData.copy.destination
  })

  // Professional Tools Overview
  console.log('\n⚡ PROFESSIONAL TOOLS OVERVIEW')
  console.log('-'.repeat(40))
  
  await testAPI('agi-office', {
    action: 'get_available_tools'
  })

  // Legacy Functions (Excel, Email)
  console.log('\n💼 LEGACY OFFICE FUNCTIONS')
  console.log('-'.repeat(40))
  
  await testAPI('agi-office', {
    action: 'generate_excel_formula',
    category: 'financial',
    complexity: 'advanced'
  })
  
  await testAPI('agi-office', {
    action: 'generate_email',
    templateId: 'business',
    variables: {
      name: 'Professional User',
      company: 'EuroWeb AGI',
      topic: 'Professional Testing'
    }
  })

  console.log('\n🎉 ALL TESTS COMPLETED!')
  console.log('=' .repeat(60))
}

// Performance Benchmark
async function runPerformanceBenchmark() {
  console.log('\n⚡ PERFORMANCE BENCHMARK')
  console.log('-'.repeat(40))
  
  const operations = [
    { name: 'Mathematical Calculation', data: { action: 'calculate', expression: '123 * 456 + 789' } },
    { name: 'Text Analysis', data: { action: 'analyze_text', text: 'Sample text for performance testing.' } },
    { name: 'Document Scan', data: { action: 'scan_document', quality: 'normal', colorMode: 'color', format: 'pdf' } }
  ]
  
  for (const operation of operations) {
    const startTime = performance.now()
    await testAPI('agi-office', operation.data)
    const endTime = performance.now()
    console.log(`⏱️ ${operation.name}: ${(endTime - startTime).toFixed(2)}ms`)
  }
}

// TypeScript Generation Test
function generateTypeScriptScript() {
  console.log('\n⚡ TYPESCRIPT SCRIPT GENERATION')
  console.log('-'.repeat(40))
  
  const script = `
// AGI Office Professional TypeScript Script
import { AGIOfficeProfessional } from './lib/agiOfficeProfessional';

async function runProfessionalOperations() {
  // Mathematical Operations
  const mathResult = AGIOfficeProfessional.math.calculate('2 + 3 * 4');
  console.log('Math Result:', mathResult);
  
  // Statistical Analysis
  const stats = AGIOfficeProfessional.math.analyzeStatistics([1,2,3,4,5]);
  console.log('Statistics:', stats);
  
  // Text Analysis
  const textAnalysis = AGIOfficeProfessional.linguistic.analyzeText('Sample text');
  console.log('Text Analysis:', textAnalysis);
  
  // Document Scanning
  const scanResult = await AGIOfficeProfessional.scanner.scanDocument({
    quality: 'high',
    colorMode: 'color', 
    format: 'pdf'
  });
  console.log('Scan Result:', scanResult);
  
  return { mathResult, stats, textAnalysis, scanResult };
}

runProfessionalOperations().then(results => {
  console.log('All professional operations completed:', results);
});`
  
  console.log('📝 Generated TypeScript Script:')
  console.log(script)
  
  return script
}

// Main execution
async function main() {
  console.log('🧠 AGI OFFICE PROFESSIONAL TEST SUITE')
  console.log('Version 8.0.0-WEB8 by Ledjan Ahmati')
  console.log('Email: dealsjona@gmail.com')
  console.log('=' .repeat(60))
  
  // Run all tests
  await runProfessionalTests()
  
  // Run performance benchmarks
  await runPerformanceBenchmark()
  
  // Generate TypeScript script
  generateTypeScriptScript()
  
  console.log('\n✨ Professional testing completed successfully!')
}

// Execute tests
main().catch(console.error)

export { testAPI, runProfessionalTests, runPerformanceBenchmark, generateTypeScriptScript }
