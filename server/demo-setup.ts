import bcrypt from 'bcrypt';
import { storage } from './storage';

export async function setupDemoAccounts() {
  // Skip demo setup in production environment if database is not available
  if (process.env.NODE_ENV === 'production') {
    try {
      // Test database connectivity first
      await storage.getAllUsers();
      console.log('🔧 Database connectivity verified for production demo setup');
    } catch (error) {
      console.log('⚠️ Database not available in production, skipping demo setup');
      return;
    }
  }
  
  console.log('🔧 DATABASE SETUP EXPLANATION:');
  console.log('- Replit environment blocks external database connections');
  console.log('- Using local PostgreSQL database for development');
  console.log('- Users are being saved, but in local database, not Supabase');
  console.log('- For production, you would deploy to a service that can connect to Supabase');
  
  console.log('🔧 Setting up demo accounts...');
  
  const demoAccounts = [
    {
      id: 'demo-parent-001',
      username: 'demo_parent',
      email: 'parent@demo.com',
      password: await bcrypt.hash('demo123', 10),
      role: 'parent',
      subscriptionTier: 'heroOffer',
      planStatus: 'heroOffer',
      emailVerified: true,
      verificationToken: undefined
    },
    {
      id: 'demo-advocate-001', 
      username: 'demo_advocate',
      email: 'advocate@demo.com',
      password: await bcrypt.hash('demo123', 10),
      role: 'advocate',
      subscriptionTier: 'heroOffer',
      planStatus: 'heroOffer',
      emailVerified: true,
      verificationToken: undefined
    }
  ];

  for (const account of demoAccounts) {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(account.email).catch(() => null);
      
      if (existingUser) {
        console.log(`✅ Demo account ${account.email} already exists`);
        
        // Force update existing demo accounts to Hero Plan if needed
        if ((account.email === 'parent@demo.com' || account.email === 'advocate@demo.com') && existingUser.planStatus !== 'heroOffer') {
          await storage.updateSubscriptionTier(existingUser.id, 'heroOffer');
          console.log(`🔓 Updated ${account.email} to Hero Plan`);
        }
        continue;
      }
      
      // Create the demo account
      await storage.createUser(account);
      console.log(`✅ Created demo account: ${account.email} (${account.role})`);
      
    } catch (error: any) {
      console.error(`❌ Failed to create ${account.email}:`, error.message);
      // Don't throw error - continue with other accounts
      if (process.env.NODE_ENV === 'production') {
        console.log(`⚠️ Production deployment continuing despite demo account setup failure`);
      }
    }
  }
  
  console.log('🎉 Demo account setup complete!');
}