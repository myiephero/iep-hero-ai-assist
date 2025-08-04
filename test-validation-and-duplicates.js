#!/usr/bin/env node

// Comprehensive test script for AI validation and duplicate prevention

const BASE_URL = 'http://localhost:5000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testValidationAndDuplicates() {
  console.log('🧪 Testing AI Validation and Duplicate Prevention\n');

  // Test 1: Valid AI Response (contains "services")
  console.log('📋 Test 1: Valid AI Response - Services');
  try {
    const response = await fetch(`${BASE_URL}/api/test-memory-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'validation-user-1',
        prompt: 'What services are included?',
        share: true
      })
    });

    const result = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ AI Answer: "${result.aiAnswer}"`);
    console.log(`✅ Validation: ${result.validation?.isValid ? 'PASSED' : 'FAILED'}`);
    console.log(`✅ Shared: ${result.sharing?.successful ? 'YES' : 'NO'}`);
  } catch (error) {
    console.error('❌ Test 1 failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Invalid AI Response (missing required keywords)
  console.log('📋 Test 2: Invalid AI Response - No Keywords');
  try {
    const response = await fetch(`${BASE_URL}/api/test-memory-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'validation-user-2',
        prompt: 'Tell me about invalid content.',
        share: true
      })
    });

    const result = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ AI Answer: "${result.aiAnswer || result.aiAnswer}"`);
    console.log(`✅ Validation: ${result.validation?.isValid === false ? 'CORRECTLY REJECTED' : 'FAILED TO REJECT'}`);
    console.log(`✅ Error Reason: ${result.reason || 'N/A'}`);
  } catch (error) {
    console.error('❌ Test 2 failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Duplicate Prevention - First Request
  console.log('📋 Test 3a: Duplicate Prevention - First Request');
  try {
    const response = await fetch(`${BASE_URL}/api/test-memory-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'duplicate-user',
        prompt: 'What goals are set for math?',
        share: true
      })
    });

    const result = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ AI Answer: "${result.aiAnswer}"`);
    console.log(`✅ Shared: ${result.sharing?.successful ? 'YES' : 'NO'}`);
    console.log(`✅ Duplicate Detected: ${result.sharing?.duplicateDetected ? 'YES' : 'NO'}`);
    console.log(`✅ Memory ID: ${result.sharing?.sharedMemory?.id || 'N/A'}`);
  } catch (error) {
    console.error('❌ Test 3a failed:', error.message);
  }

  console.log('\n📋 Test 3b: Duplicate Prevention - Immediate Duplicate (same question within 60s)');
  
  // Wait 2 seconds to simulate quick re-ask
  await sleep(2000);
  
  try {
    const response = await fetch(`${BASE_URL}/api/test-memory-query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'duplicate-user',
        prompt: 'What goals are set for math?', // Same question
        share: true
      })
    });

    const result = await response.json();
    console.log(`✅ Status: ${response.status}`);
    console.log(`✅ AI Answer: "${result.aiAnswer}"`);
    console.log(`✅ Shared: ${result.sharing?.successful ? 'YES (SHOULD BE NO)' : 'NO (CORRECT)'}`);
    console.log(`✅ Duplicate Detected: ${result.sharing?.duplicateDetected ? 'YES (CORRECT)' : 'NO (PROBLEM)'}`);
    console.log(`✅ Memory ID: ${result.sharing?.sharedMemory?.id || 'N/A (CORRECT)'}`);
  } catch (error) {
    console.error('❌ Test 3b failed:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: Different AI Response Types
  console.log('📋 Test 4: Different Valid Response Types');
  
  const testCases = [
    { type: 'goals', prompt: 'What goals are established?', expected: 'goals' },
    { type: 'accommodations', prompt: 'What accommodations are available?', expected: 'accommodations' },
    { type: 'mixed', prompt: 'What mixed information is provided?', expected: 'goals and services' }
  ];

  for (const testCase of testCases) {
    console.log(`\n🔹 Testing ${testCase.type} response:`);
    try {
      const response = await fetch(`${BASE_URL}/api/test-memory-query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: `test-${testCase.type}-user`,
          prompt: testCase.prompt,
          share: false // No sharing to avoid duplicate issues
        })
      });

      const result = await response.json();
      console.log(`   ✅ AI Answer: "${result.aiAnswer}"`);
      console.log(`   ✅ Contains ${testCase.expected}: ${result.aiAnswer.toLowerCase().includes(testCase.expected.split(' ')[0]) ? 'YES' : 'NO'}`);
      console.log(`   ✅ Validation: ${result.validation?.isValid ? 'PASSED' : 'FAILED'}`);
    } catch (error) {
      console.error(`   ❌ ${testCase.type} test failed:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 5: Check Recent Queries Cache
  console.log('📋 Test 5: Recent Queries Cache Status');
  try {
    const response = await fetch(`${BASE_URL}/api/test-shared-memories`);
    const result = await response.json();
    console.log(`✅ Recent Queries Count: ${result.recentQueries?.length || 0}`);
    
    if (result.recentQueries && result.recentQueries.length > 0) {
      console.log('✅ Recent Queries:');
      result.recentQueries.forEach((query, index) => {
        console.log(`   ${index + 1}. "${query.question}" (${query.secondsAgo}s ago)`);
      });
    }
  } catch (error) {
    console.error('❌ Test 5 failed:', error.message);
  }

  console.log('\n🎉 All validation and duplicate prevention tests completed!');
}

// Run the comprehensive tests
testValidationAndDuplicates().catch(console.error);