// test-utt-system.ts
// Test script për UTT-ALB integration
// Usage: npx tsx test-utt-system.ts

const BASE_URL = 'http://localhost:3000';

async function testUTTInfo() {
  console.log('\n🔍 Testing UTT Info...');
  try {
    const response = await fetch(`${BASE_URL}/api/utt/info`);
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ UTT Info Success:');
      console.log('  Network:', data.network);
      console.log('  Mint:', data.mint);
      console.log('  Decimals:', data.decimals);
      console.log('  EUR per ALB:', data.euroPerALB);
      console.log('  Bridge:', data.bridge);
      console.log('  Bridge Balance:', data.bridgeBalanceALB, 'ALB');
      console.log('  Transfers Enabled:', data.transfersEnabled);
      console.log('  Status:', data.status);
      return true;
    } else {
      console.log('❌ UTT Info Failed:', data);
      return false;
    }
  } catch (error: any) {
    console.log('❌ UTT Info Error:', error.message);
    return false;
  }
}

async function testPhysicalTokenSigning() {
  console.log('\n🔏 Testing Physical Token Signing...');
  try {
    const payload = {
      tokenId: 'ALB-TEST-001',
      serial: 'TEST-SERIAL-001',
      owner: 'HSEcf132J4dNz46gw5fsVV7xfgedeFyTZXMSHcroz3BU', //  wallet
      expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000 // 1 year from now
    };

    const response = await fetch(`${BASE_URL}/api/utt/sign-physical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Physical Token Signing Success:');
      console.log('  Token ID:', data.payload.tokenId);
      console.log('  Serial:', data.payload.serial);
      console.log('  Value EUR:', data.payload.valueEUR);
      console.log('  Signer:', data.signer);
      console.log('  Algorithm:', data.alg);
      console.log('  Signature:', data.signature.substring(0, 20) + '...');
      
      // Test verification immediately
      return await testPhysicalTokenVerification(data);
    } else {
      console.log('❌ Physical Token Signing Failed:', data);
      return false;
    }
  } catch (error: any) {
    console.log('❌ Physical Token Signing Error:', error.message);
    return false;
  }
}

async function testPhysicalTokenVerification(signedData: any) {
  console.log('\n🔐 Testing Physical Token Verification...');
  try {
    const response = await fetch(`${BASE_URL}/api/utt/verify-physical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(signedData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Physical Token Verification Success:');
      console.log('  Valid:', data.valid);
      console.log('  Checks:', data.checks);
      console.log('  Token ID:', data.payload.tokenId);
      return data.valid;
    } else {
      console.log('❌ Physical Token Verification Failed:', data);
      return false;
    }
  } catch (error: any) {
    console.log('❌ Physical Token Verification Error:', error.message);
    return false;
  }
}

async function testTransfer() {
  console.log('\n💸 Testing Transfer (Shadow Mode)...');
  try {
    const payload = {
      to: 'HSEcf132J4dNz46gw5fsVV7xfgedeFyTZXMSHcroz3BU', //  wallet
      amount: 0.1 // Small test amount
    };

    const response = await fetch(`${BASE_URL}/api/utt/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Transfer Success:');
      console.log('  Signature:', data.signature);
      console.log('  Explorer:', data.explorer);
      console.log('  Amount:', data.amount, 'ALB');
      console.log('  To:', data.to);
      return true;
    } else {
      console.log('🔒 Transfer Blocked (Expected in Shadow Mode):', data.error);
      return data.error.includes('disabled') || data.error.includes('allowlist');
    }
  } catch (error: any) {
    console.log('❌ Transfer Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting UTT-ALB Integration Tests...');
  console.log('📅 Date:', new Date().toISOString());
  console.log('🌐 Base URL:', BASE_URL);
  
  const results = {
    info: await testUTTInfo(),
    signing: await testPhysicalTokenSigning(),
    transfer: await testTransfer()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('  UTT Info:', results.info ? '✅ PASS' : '❌ FAIL');
  console.log('  Physical Token Signing/Verification:', results.signing ? '✅ PASS' : '❌ FAIL');
  console.log('  Transfer (Shadow Mode):', results.transfer ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = Object.values(results).every(Boolean);
  console.log('\n🎯 Overall Status:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  if (allPassed) {
    console.log('\n🎉 UTT-ALB Integration is ready for Faza 1 (Devnet Testing)!');
  } else {
    console.log('\n🔧 Some components need attention before proceeding.');
  }
  
  return allPassed;
}

// Run tests if this file is executed directly
import { fileURLToPath } from 'url'

if (import.meta.url === `file://${process.argv[1]}`) {
  runTests().catch(console.error);
}

export { runTests };
