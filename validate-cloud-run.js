#!/usr/bin/env node

/**
 * Cloud Run Deployment Validation Script
 * Validates that the application is properly configured for Cloud Run
 */

console.log('🔍 Cloud Run Deployment Validation');
console.log('='.repeat(40));

const fs = require('fs');
const path = require('path');

// Validation checks
const checks = [
  {
    name: 'Package.json exists',
    check: () => fs.existsSync('package.json')
  },
  {
    name: 'Server entry point exists',
    check: () => fs.existsSync('server/index.ts')
  },
  {
    name: 'Dockerfile configured',
    check: () => fs.existsSync('Dockerfile')
  },
  {
    name: 'Cloud Build config exists',
    check: () => fs.existsSync('cloudbuild.yaml')
  },
  {
    name: 'Build output directory exists',
    check: () => fs.existsSync('dist') || fs.existsSync('build')
  }
];

let allPassed = true;

checks.forEach(({ name, check }) => {
  const passed = check();
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  if (!passed) allPassed = false;
});

console.log('='.repeat(40));
console.log(`${allPassed ? '✅' : '❌'} Overall: ${allPassed ? 'Ready for Cloud Run' : 'Issues found'}`);

if (allPassed) {
  console.log('🚀 Application appears ready for Cloud Run deployment');
  console.log('💡 Make sure to run "npm run build" before deployment');
} else {
  console.log('⚠️ Please address the issues above before deploying');
}

process.exit(allPassed ? 0 : 1);