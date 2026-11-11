import fs from 'node:fs';
import path from 'node:path';

// Generate a valid 16-bit PCM Mono WAV file buffer
function generateWav(sampleRate: number, durationSec: number, sampleFn: (t: number) => number): Buffer {
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataByteLength = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataByteLength);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataByteLength, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 mono)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  buffer.writeUInt16LE(2, 32);  // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample (16)

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataByteLength, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let s = sampleFn(t);
    // Soft clamp
    s = Math.max(-1, Math.min(1, s));
    const intSample = Math.floor(s < 0 ? s * 32768 : s * 32767);
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

const sampleRate = 22050;

// Track 1: "Midnight Thoughts" - Melancholic F#m to Dmaj7 ambient chords with gentle tape warmth
const track1Buffer = generateWav(sampleRate, 18, (t) => {
  const cycle = t % 18;
  // Chord progression: F#m9 (0-4.5s) -> Dmaj7 (4.5-9s) -> Bm9 (9-13.5s) -> C#m7 (13.5-18s)
  let freqs = [185.0, 220.0, 277.18, 329.63]; // F#m9
  if (cycle >= 4.5 && cycle < 9) {
    freqs = [146.83, 220.0, 277.18, 369.99]; // Dmaj7
  } else if (cycle >= 9 && cycle < 13.5) {
    freqs = [123.47, 185.0, 220.0, 293.66]; // Bm9
  } else if (cycle >= 13.5) {
    freqs = [138.59, 207.65, 246.94, 329.63]; // C#m7
  }

  const subCycle = cycle % 4.5;
  const env = Math.sin((subCycle / 4.5) * Math.PI) ** 0.8;
  const lfo = 1 + 0.05 * Math.sin(2 * Math.PI * 0.25 * t);

  let val = 0;
  for (const f of freqs) {
    val += 0.18 * Math.sin(2 * Math.PI * f * t * lfo);
    // Subtle second harmonic for warmth
    val += 0.05 * Math.sin(2 * Math.PI * (f * 2) * t);
  }

  // Gentle lo-fi vinyl hiss
  const hiss = (Math.random() * 2 - 1) * 0.008;

  return val * env * 0.7 + hiss;
});

// Track 2: "Echoes of You" - Softer, ethereal ambient pads in A minor
const track2Buffer = generateWav(sampleRate, 16, (t) => {
  const cycle = t % 16;
  let freqs = [110.0, 164.81, 220.0, 261.63]; // Am
  if (cycle >= 4 && cycle < 8) {
    freqs = [87.31, 130.81, 174.61, 220.0]; // Fmaj7
  } else if (cycle >= 8 && cycle < 12) {
    freqs = [130.81, 164.81, 196.0, 246.94]; // Cmaj7
  } else if (cycle >= 12) {
    freqs = [98.0, 146.83, 196.0, 246.94]; // G
  }

  const subCycle = cycle % 4;
  const env = Math.sin((subCycle / 4) * Math.PI) ** 0.6;
  const shimmer = Math.sin(2 * Math.PI * 4.2 * t) * 0.03;

  let val = 0;
  for (let i = 0; i < freqs.length; i++) {
    const f = freqs[i];
    val += 0.2 * Math.sin(2 * Math.PI * (f + shimmer) * t);
  }

  return val * env * 0.65;
});

// Track 3: "Unsaid" - Deep meditative drone with gentle chimes
const track3Buffer = generateWav(sampleRate, 16, (t) => {
  const drone = 0.22 * Math.sin(2 * Math.PI * 65.41 * t) + 0.15 * Math.sin(2 * Math.PI * 130.81 * t);
  const chimeFreq = (t % 4 < 2) ? 523.25 : 659.25;
  const chimeEnv = Math.exp(-(t % 2) * 2.8);
  const chime = 0.18 * Math.sin(2 * Math.PI * chimeFreq * t) * chimeEnv;
  return (drone + chime) * 0.75;
});

fs.writeFileSync(path.join(process.cwd(), 'public/audio/track1.wav'), track1Buffer);
fs.writeFileSync(path.join(process.cwd(), 'public/audio/track2.wav'), track2Buffer);
fs.writeFileSync(path.join(process.cwd(), 'public/audio/track3.wav'), track3Buffer);
console.log('Successfully generated audio tracks in public/audio/');
