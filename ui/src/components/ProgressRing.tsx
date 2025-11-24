import { motion } from 'motion/react';

interface ProgressRingProps {
  progress: number;
}

export function ProgressRing({ progress }: ProgressRingProps) {
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        
        {/* Gradient definition */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#00D1FF" />
          </linearGradient>
        </defs>
        
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            strokeDasharray: circumference,
            filter: 'drop-shadow(0 0 12px rgba(0, 255, 136, 0.6))'
          }}
        />
      </svg>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-5xl mb-2"
          style={{ 
            fontFamily: 'SF Pro Display, system-ui, sans-serif',
            color: '#fff'
          }}
          key={progress}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {progress}%
        </motion.span>
        <motion.span
          className="text-sm opacity-60"
          style={{ 
            fontFamily: 'JetBrains Mono, monospace',
            color: '#00FF88'
          }}
          animate={{
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ANALYZING...
        </motion.span>
      </div>

      {/* Rotating glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 255, 136, 0.3) 90deg, transparent 180deg)',
          filter: 'blur(20px)'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
