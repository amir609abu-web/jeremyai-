import { writeFileSync } from "node:fs";

const width = 1600;
const height = 460;
const midY = height * 0.42;

function arcPath(amplitude, yOffset) {
  return `M 0 ${midY + yOffset - amplitude} C ${width * 0.28} ${midY + yOffset + amplitude}, ${width * 0.72} ${midY + yOffset - amplitude}, ${width} ${midY + yOffset + amplitude}`;
}

const arcs = [
  { amp: 90, y: -40, width: 1.5, opacity: 0.55 },
  { amp: 110, y: 0, width: 2, opacity: 0.85 },
  { amp: 130, y: 55, width: 1.5, opacity: 0.45 },
  { amp: 150, y: 120, width: 1, opacity: 0.3 },
  { amp: 70, y: -90, width: 1, opacity: 0.25 },
];

const paths = arcs
  .map(
    (a) =>
      `<path d="${arcPath(a.amp, a.y)}" fill="none" stroke="#34e17a" stroke-width="${a.width}" stroke-opacity="${a.opacity}" />`
  )
  .join("\n  ");

const svg = `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="glow" cx="50%" cy="15%" r="60%">
      <stop offset="0%" stop-color="#34e17a" stop-opacity="0.30" />
      <stop offset="100%" stop-color="#34e17a" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#050806" stop-opacity="0" />
      <stop offset="100%" stop-color="#050806" stop-opacity="0.9" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#glow)" />
  <g>${paths}</g>
</svg>`;

writeFileSync(new URL("../public/wave-ribbon.svg", import.meta.url), svg);
console.log("wrote public/wave-ribbon.svg");
