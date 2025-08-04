#!/usr/bin/env node

// Test script for Memory Q&A sharing functionality
// This script simulates the complete flow: query + share

const BASE_URL = 'http://localhost:5000';

async function testMemorySharing() {
  console.log('🧪 Testing Memory Q&A Sharing Functionality\n');

  // Test 1: Query with sharing enabled
  console.log('📋 Test 1: Memory query with sharing enabled');
  try {
    const response = await fetch(`${BASE_URL}/api/test-memory-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test-user-123',
        prompt: 'What services are included?',
        share: true
      })
    });

    const result = await response.json();
    console.log('✅ Response:', JSON.stringify(result, null, 2));
    
    if (result.sharing.successful) {
      console.log('✅ Sharing to database: SUCCESS');
      console.log(`📝 Shared Memory ID: ${result.sharing.sharedMemory.id}`);
    } else {
      console.log('❌ Sharing to database: FAILED');
    }
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Query without sharing
  console.log('📋 Test 2: Memory query without sharing');
  try {
    const response = await fetch(`${BASE_URL}/api/test-memory-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'test-user-456',
        prompt: 'How often are IEP meetings held?',
        share: false
      })
    });

    const result = await response.json();
    console.log('✅ Response:', JSON.stringify(result, null, 2));
    
    if (!result.sharing.requested) {
      console.log('✅ No sharing requested: CORRECT');
    } else {
      console.log('❌ Sharing was not requested but was processed');
    }
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Check shared memories endpoint
  console.log('📋 Test 3: Retrieve shared memories');
  try {
    const response = await fetch(`${BASE_URL}/api/test-shared-memories`);
    const result = await response.json();
    console.log('✅ Shared memories endpoint:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Test 3 failed:', error.message);
  }

  console.log('\n🎉 Testing completed!');
}

// Run the tests
testMemorySharing().catch(console.error);