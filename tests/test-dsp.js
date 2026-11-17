// Testar A-filtret i index.html mot standardens A-vägningstabell
const fs = require('fs');
const html = fs.readFileSync(require('path').join(__dirname, '..', 'index.html'), 'utf8');
const code = html.split('// ---- DSP START')[1].split('// ---- DSP END')[0];
eval(code + '; globalThis.designA = designA; globalThis.mag = mag;');

// Standardens A-vägning (IEC 61672) i dB
const ref = { 31.5: -39.4, 63: -26.2, 125: -16.1, 250: -8.6, 500: -3.2, 1000: 0.0,
              2000: 1.2, 4000: 1.0, 8000: -1.1, 16000: -6.6 };

for (const rate of [48000, 44100, 96000]) {
  const d = designA(rate);
  console.log(`\nSamplingsfrekvens ${rate} Hz`);
  for (const f of Object.keys(ref)) {
    let m = d.gain; for (const s of d.secs) m *= mag(s, +f, rate);
    const db = 20 * Math.log10(m);
    console.log(String(f).padStart(6), 'Hz  filter', db.toFixed(2).padStart(7),
                ' tabell', ref[f].toFixed(1).padStart(6), ' fel', (db - ref[f]).toFixed(2).padStart(6));
  }
}

// Test av nivåräkning: sinus 1 kHz med toppvärde 1.0 ger RMS -3.01 dB (digital full skala)
const rate = 48000, d = designA(rate);
const sec = d.secs.map(s => ({ ...s, z1: 0, z2: 0 }));
let sum = 0, n = 0;
for (let i = 0; i < rate * 2; i++) {
  let x = Math.sin(2 * Math.PI * 1000 * i / rate);
  for (const c of sec) { const y = c.b0 * x + c.z1; c.z1 = c.b1 * x - c.a1 * y + c.z2; c.z2 = c.b2 * x - c.a2 * y; x = y; }
  x *= d.gain;
  if (i > rate * 0.5) { sum += x * x; n++; }
}
console.log('\n1 kHz sinus, toppvärde 1.0 -> LAeq (rå):', (10 * Math.log10(sum / n)).toFixed(2), 'dB (väntat -3.01)');
