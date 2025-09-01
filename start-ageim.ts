/**
 * AGEiM Startup Script
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 */

import { ageimDevSandbox } from './backend/ageim-dev-sandbox.js'

console.log('🚀 Starting AGEiM (AGI Executive & Improvement Manager)...')

async function startAGEIM() {
  try {
    await ageimDevSandbox.start()
    console.log('✅ AGEiM is now running!')
    console.log('📊 AGI Sandbox should now connect to real backend metrics')
    
    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down AGEiM...')
      await ageimDevSandbox.stop()
      process.exit(0)
    })
    
  } catch (error) {
    console.error('❌ Failed to start AGEiM:', error)
    process.exit(1)
  }
}

startAGEIM()
