"use client";

import { motion } from "framer-motion";

const HUBS = [
  { cx: 300, cy: 90, delay: 0 },
  { cx: 460, cy: 160, delay: 0.4 },
  { cx: 140, cy: 180, delay: 0.8 },
  { cx: 380, cy: 320, delay: 1.2 },
  { cx: 180, cy: 340, delay: 1.6 },
];

export function AIGlobe() {
  return (
    <div className="relative mx-auto flex h-[380px] w-full max-w-[560px] items-center justify-center sm:h-[440px]">
      <svg
        viewBox="0 0 560 440"
        className="h-full w-full overflow-visible"
        aria-hidden
      >
        <defs>
          <radialGradient id="globeGlow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#34e17a" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#34e17a" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="280" cy="220" r="200" fill="url(#globeGlow)" />

        <g stroke="#34e17a" strokeOpacity="0.28" fill="none" strokeWidth="1">
          <circle cx="280" cy="220" r="150" />
          <g
            className="animate-spin-slow"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <ellipse cx="280" cy="220" rx="150" ry="55" />
          </g>
          <g
            className="animate-spin-slow-reverse"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <ellipse cx="280" cy="220" rx="150" ry="90" />
          </g>
          <g
            className="animate-spin-slow"
            style={{
              transformBox: "fill-box",
              transformOrigin: "center",
              animationDuration: "55s",
              animationDirection: "reverse",
            }}
          >
            <ellipse cx="280" cy="220" rx="90" ry="150" />
          </g>
          <ellipse cx="280" cy="220" rx="150" ry="20" />
        </g>

        {HUBS.map((h, i) => (
          <g key={i}>
            <motion.line
              x1="280"
              y1="220"
              x2={h.cx}
              y2={h.cy}
              stroke="#34e17a"
              strokeOpacity="0.35"
              strokeWidth="1"
              strokeDasharray="4 5"
              animate={{ strokeDashoffset: [0, -18] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
            />
            <motion.circle
              cx={h.cx}
              cy={h.cy}
              r="4"
              fill="#34e17a"
              animate={{ opacity: [0.4, 1, 0.4], scale: [1, 1.4, 1] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: h.delay,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}
      </svg>

      <motion.div
        animate={{
          boxShadow: [
            "0 0 30px -8px rgba(52,225,122,0.6)",
            "0 0 55px -6px rgba(52,225,122,0.95)",
            "0 0 30px -8px rgba(52,225,122,0.6)",
          ],
        }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/40 bg-background/80 backdrop-blur-sm sm:h-24 sm:w-24"
      >
        <div className="absolute -left-1.5 -top-1.5 h-3 w-3 border-l-2 border-t-2 border-primary" />
        <div className="absolute -right-1.5 -top-1.5 h-3 w-3 border-r-2 border-t-2 border-primary" />
        <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border-b-2 border-l-2 border-primary" />
        <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border-b-2 border-r-2 border-primary" />
        <span className="font-display text-2xl font-bold text-primary sm:text-3xl">
          J
        </span>
      </motion.div>
    </div>
  );
}
