/**
 * Test Ultra Search Engine
 * Quick test to verify functionality
 */

import { ultraSearchEngine, ultraSearchCLI } from './lib/search-engine/ultra-search-cli'

console.log('🚀 Testing Ultra Search Engine...\n')

// Test basic search
console.log('1. Testing Basic Search:')
console.log('═'.repeat(50))
const results = ultraSearchEngine.search({ query: 'AGI analytics' })
console.log(`Found ${results.length} results for "AGI analytics":\n`)

results.forEach((result, index) => {
  console.log(`${index + 1}. ${result.title}`)
  console.log(`   Type: ${result.type} | Score: ${result.score.toFixed(3)}`)
  console.log(`   ${result.content.substring(0, 80)}...\n`)
})

// Test suggestions
console.log('\n2. Testing Search Suggestions:')
console.log('═'.repeat(50))
const suggestions = ultraSearchEngine.getSuggestions('analyt')
console.log(`Suggestions for "analyt": ${suggestions.join(', ')}\n`)

// Test statistics
console.log('\n3. Testing Search Statistics:')
console.log('═'.repeat(50))
const stats = ultraSearchEngine.getStatistics()
console.log(`Total Documents: ${stats.totalDocuments}`)
console.log(`Total Words: ${stats.totalWords}`)
console.log(`Document Types:`)
Object.entries(stats.documentTypes).forEach(([type, count]) => {
  console.log(`  - ${type}: ${count}`)
})

console.log('\n✅ Ultra Search Engine Test Complete!')
