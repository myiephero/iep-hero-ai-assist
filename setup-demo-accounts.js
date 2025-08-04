#!/usr/bin/env node

// Demo account setup script for production deployment
const bcrypt = require('bcrypt');

async function setupDemoAccounts() {
  const { storage } = await import('./server/storage.js');
  
  console.log('🔧 Setting up demo accounts for production...');
  
  const demoAccounts = [
    {
      id: 'demo-parent-001',
      username: 'demo_parent',
      email: 'parent@demo.com',
      password: await bcrypt.hash('demo123', 10),
      role: 'parent',
      subscriptionTier: 'heroOffer',
      planStatus: 'heroOffer',
      isVerified: true
    },
    {
      id: 'demo-advocate-001', 
      username: 'demo_advocate',
      email: 'advocate@demo.com',
      password: await bcrypt.hash('demo123', 10),
      role: 'advocate',
      subscriptionTier: 'free',
      planStatus: 'free',
      isVerified: true
    }
  ];

  for (const account of demoAccounts) {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(account.email).catch(() => null);
      
      if (existingUser) {
        console.log(`✅ Demo account ${account.email} already exists`);
        continue;
      }
      
      // Create the demo account
      await storage.createUser(account);
      console.log(`✅ Created demo account: ${account.email} (${account.role})`);
      
    } catch (error) {
      console.error(`❌ Failed to create ${account.email}:`, error.message);
    }
  }
  
  console.log('🎉 Demo account setup complete!');
  console.log('📝 Demo Credentials:');
  console.log('   Parent: parent@demo.com / demo123 (Hero Plan)');
  console.log('   Advocate: advocate@demo.com / demo123 (Free Plan)');
}

if (require.main === module) {
  setupDemoAccounts().catch(console.error);
}

module.exports = { setupDemoAccounts };