// PWA Icon Generation Utilities
export function generatePWAIcons() {
  const iconSizes = [64, 192, 512];
  const icons = [];

  for (const size of iconSizes) {
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="#3b82f6"/>
        <text x="${size / 2}" y="${size * 0.6}" text-anchor="middle" fill="white" font-size="${size * 0.3}" font-family="Arial, sans-serif" font-weight="bold">IEP</text>
        <circle cx="${size * 0.8}" cy="${size * 0.3}" r="${size * 0.1}" fill="#10b981"/>
      </svg>
    `;
    
    icons.push({
      size,
      svg,
      name: `pwa-${size}x${size}.svg`
    });
  }

  return icons;
}

export function downloadIcon(svg: string, filename: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}