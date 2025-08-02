import { spawn } from 'child_process';

console.log("🚀 Starting Vite development server...");

// Start Vite from the project root with explicit port and host
const vite = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '8080'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

vite.on('error', (error) => {
  console.error('❌ Failed to start Vite:', error);
  process.exit(1);
});

vite.on('close', (code) => {
  console.log(`Vite process exited with code ${code}`);
  if (code !== 0) {
    process.exit(code);
  }
});
