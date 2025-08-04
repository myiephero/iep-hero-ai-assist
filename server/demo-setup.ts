import bcrypt from "bcrypt";
import { storage } from "./storage";

export async function setupDemoAccounts() {
  console.log('🔧 Setting up demo accounts...');
  
  const demoAccounts = [
    {
      id: 'demo-parent-001',
      username: 'demo_parent',
      email: 'parent@demo.com',
      password: await bcrypt.hash('demo123', 10),
      role: 'parent' as const,
      subscriptionTier: 'heroOffer',
      planStatus: 'heroOffer',
      isVerified: true
    },
    {
      id: 'demo-advocate-001', 
      username: 'demo_advocate',
      email: 'advocate@demo.com',
      password: await bcrypt.hash('demo123', 10),
      role: 'advocate' as const,
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
      
    } catch (error: any) {
      console.error(`❌ Failed to create ${account.email}:`, error.message);
    }
  }
  
  console.log('🎉 Demo account setup complete!');
}