// Run with: node scripts/generate-icons.js
// Generates 192x192 and 512x512 PNG icons for the PWA

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function generateIcon(size) {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, size, size);

    // Outer glow circle
    const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.1, size / 2, size / 2, size * 0.5);
    gradient.addColorStop(0, 'rgba(6, 182, 212, 0.15)');
    gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // Draw "V" lettermark
    const padding = size * 0.18;
    const vTop = size * 0.22;
    const vBottom = size * 0.72;
    const vLeft = padding;
    const vRight = size - padding;
    const vMid = size / 2;

    // Shadow/glow for V
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = size * 0.08;

    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = size * 0.07;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(vLeft, vTop);
    ctx.lineTo(vMid, vBottom);
    ctx.lineTo(vRight, vTop);
    ctx.stroke();

    // Brand text
    ctx.shadowBlur = 0;
    ctx.font = `bold ${size * 0.1}px Arial`;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.7)';
    ctx.textAlign = 'center';
    ctx.fillText('VIEWPOINT', size / 2, size * 0.88);

    return canvas.toBuffer('image/png');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, '../public/icons');
if (!fs.existsSync(ICONS_DIR)) fs.mkdirSync(ICONS_DIR, { recursive: true });

[192, 512].forEach(size => {
    const buffer = generateIcon(size);
    const filePath = path.join(ICONS_DIR, `icon-${size}.png`);
    fs.writeFileSync(filePath, buffer);
    console.log(`✓ Generated ${filePath}`);
});

console.log('✓ All icons generated!');
