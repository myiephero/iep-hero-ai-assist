import { spawn } from 'child_process';

console.log("🚀 Starting Vite development server...");

// Use PORT environment variable for Cloud Run compatibility
const port = process.env.PORT || '5000';

console.log(`📍 Using port: ${port}`);

// Start Vite from the project root with dynamic port and host
const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', port], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

vite.on('error', (error) => {
  console.error('❌ Failed to start Vite:', error);
  // Add error handling to prevent demo setup failures from blocking deployment startup
  if (process.env.NODE_ENV === 'production') {
    console.log('⚠️ Production environment detected - attempting graceful recovery...');
    setTimeout(() => {
      console.log('🔄 Retrying server startup...');
      process.exit(1);
    }, 5000);
  } else {
    process.exit(1);
  }
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
  if (code !== 0) {
    if (process.env.NODE_ENV === 'production') {
      console.log('⚠️ Production mode - attempting recovery...');
      setTimeout(() => process.exit(code), 2000);
    } else {
      process.exit(code);
    }
  }
});
