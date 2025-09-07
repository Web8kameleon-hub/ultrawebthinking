#!/usr/bin/env node

/**
 * Simple Global Sources Test
 * Tests basic functionality without complex module loading
 */

console.log('🌍 EuroWeb Ultra - Global Data Sources Test')
console.log('Testing real connections to world-class APIs...\n')

// Test NASA API (no auth required)
async function testNASA() {
  try {
    console.log('🚀 Testing NASA APOD API...')
    const response = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY')
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ NASA: Success - ${data.title}`)
      return true
    } else {
      console.log(`❌ NASA: HTTP ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ NASA: ${error.message}`)
    return false
  }
}

// Test OpenStreetMap Nominatim (no auth required)
async function testOSM() {
  try {
    console.log('🗺️  Testing OpenStreetMap Nominatim...')
    const response = await fetch('https://nominatim.openstreetmap.org/search?q=Tirana&format=json&limit=1', {
      headers: {
        'User-Agent': 'Web8-EuroWeb/8.0.0 Test'
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      if (data.length > 0) {
        console.log(`✅ OSM: Success - Found Tirana at ${data[0].lat}, ${data[0].lon}`)
        return true
      } else {
        console.log('❌ OSM: No results')
        return false
      }
    } else {
      console.log(`❌ OSM: HTTP ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ OSM: ${error.message}`)
    return false
  }
}

// Test WHO Health Observatory (no auth required)
async function testWHO() {
  try {
    console.log('🏥 Testing WHO Health Observatory...')
    const response = await fetch('https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY/DimensionValues')
    
    if (response.ok) {
      const data = await response.json()
      if (data.value && data.value.length > 0) {
        console.log(`✅ WHO: Success - Found ${data.value.length} countries`)
        return true
      } else {
        console.log('❌ WHO: No data')
        return false
      }
    } else {
      console.log(`❌ WHO: HTTP ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ WHO: ${error.message}`)
    return false
  }
}

// Test OpenSky Network (no auth required)
async function testOpenSky() {
  try {
    console.log('✈️  Testing OpenSky Network...')
    const response = await fetch('https://opensky-network.org/api/states/all?lamin=41.0&lomin=19.0&lamax=42.0&lomax=21.0')
    
    if (response.ok) {
      const data = await response.json()
      if (data.states) {
        console.log(`✅ OpenSky: Success - Found ${data.states.length} aircraft over Albania`)
        return true
      } else {
        console.log('✅ OpenSky: Success - No aircraft currently visible')
        return true
      }
    } else {
      console.log(`❌ OpenSky: HTTP ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ OpenSky: ${error.message}`)
    return false
  }
}

// Test CoinGecko API (no auth required)
async function testCoinGecko() {
  try {
    console.log('💰 Testing CoinGecko API...')
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd,eur')
    
    if (response.ok) {
      const data = await response.json()
      if (data.bitcoin && data.ethereum) {
        console.log(`✅ CoinGecko: Success - BTC: $${data.bitcoin.usd}, ETH: $${data.ethereum.usd}`)
        return true
      } else {
        console.log('❌ CoinGecko: No price data')
        return false
      }
    } else {
      console.log(`❌ CoinGecko: HTTP ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ CoinGecko: ${error.message}`)
    return false
  }
}

// Run all tests
async function runTests() {
  console.log('Starting Global Data Sources Integration Test...\n')
  
  const tests = [
    { name: 'NASA', func: testNASA },
    { name: 'OpenStreetMap', func: testOSM },
    { name: 'WHO', func: testWHO },
    { name: 'OpenSky', func: testOpenSky },
    { name: 'CoinGecko', func: testCoinGecko }
  ]
  
  const results = []
  
  for (const test of tests) {
    const success = await test.func()
    results.push({ name: test.name, success })
    console.log() // Empty line for readability
    
    // Small delay to be respectful to APIs
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // Summary
  const passed = results.filter(r => r.success).length
  const total = results.length
  
  console.log('📊 Test Summary:')
  console.log(`✅ Passed: ${passed}/${total} sources`)
  console.log(`❌ Failed: ${total - passed}/${total} sources`)
  console.log(`🎯 Success Rate: ${Math.round((passed / total) * 100)}%`)
  
  if (passed === total) {
    console.log('\n🎉 All tests passed! Global data sources are operational.')
  } else {
    console.log('\n⚠️  Some tests failed. This may be due to network issues or API rate limits.')
    console.log('   Real-world APIs can be temporarily unavailable.')
  }
  
  console.log('\n🔗 EuroWeb Ultra Platform - Real Data Integration Complete')
}

// Execute tests
runTests().catch(error => {
  console.error('❌ Test runner failed:', error)
  process.exit(1)
})
