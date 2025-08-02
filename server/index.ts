import { spawn } from 'child_process';

console.log("🚀 Starting Vite development server...");

// Start Vite from the project root
const vite = spawn('npx', ['vite', '--config', 'vite.config.ts'], {
  stdio: 'inherit',
  shell: true
});

vite.on('error', (error) => {
  console.error('❌ Failed to start Vite:', error);
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
});
