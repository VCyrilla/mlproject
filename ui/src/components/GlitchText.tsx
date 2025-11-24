import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export function GlitchText({ text, className = '' }: GlitchTextProps) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative inline-block">
      <motion.h1
        className={className}
        style={{
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
          color: '#00FF88',
          textShadow: glitch 
            ? '2px 2px #FF1E56, -2px -2px #00D1FF' 
            : '0 0 20px rgba(0, 255, 136, 0.5)'
        }}
        animate={glitch ? {
          x: [0, -2, 2, -1, 1, 0],
          y: [0, 1, -1, 2, -2, 0]
        } : {}}
        transition={{ duration: 0.1 }}
      >
        {text}
      </motion.h1>
    </div>
  );
}
