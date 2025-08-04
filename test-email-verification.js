// Test email verification functionality
const postgres = require('postgres');

async function testEmailVerification() {
  try {
    console.log('🧪 Testing email verification system...');
    
    // Test registration with email verification
    const registrationResponse = await fetch('http://localhost:5000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'testuser' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'testpass123'
      })
    });
    
    const registrationData = await registrationResponse.json();
    console.log('📧 Registration response:', registrationData);
    
    if (registrationData.message && registrationData.message.includes('check your email')) {
      console.log('✅ Email verification system is working!');
      console.log('📤 Welcome email should be sent to user');
    } else {
      console.log('❌ Email verification not working as expected');
    }
    
    // Check database for verification token
    const databaseUrl = process.env.DATABASE_URL;
    if (databaseUrl) {
      const sql = postgres(databaseUrl, { max: 1 });
      const users = await sql`SELECT email, email_verified, verification_token FROM users WHERE email = ${registrationData.user?.email} LIMIT 1`;
      
      if (users.length > 0) {
        console.log('📊 Database check:', {
          email: users[0].email,
          emailVerified: users[0].email_verified,
          hasVerificationToken: !!users[0].verification_token
        });
      }
      
      await sql.end();
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testEmailVerification();