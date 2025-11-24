import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal } from 'lucide-react';

interface TerminalLogProps {
  logs: string[];
}

export function TerminalLog({ logs }: TerminalLogProps) {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div 
      className="rounded-2xl p-4 border"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderColor: 'rgba(0, 255, 136, 0.2)',
        maxHeight: '300px',
        overflowY: 'auto'
      }}
    >
      <div className="flex items-center mb-3 pb-3 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
        <Terminal className="w-4 h-4 mr-2" style={{ color: '#00FF88' }} />
        <span 
          className="text-sm"
          style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}
        >
          Live Analysis Stream
        </span>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start"
            >
              <span 
                className="text-sm mr-3 opacity-50"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00D1FF' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <motion.span
                className="text-sm"
                style={{ 
                  fontFamily: 'JetBrains Mono, monospace',
                  color: log.includes('COMPLETE') ? '#00FF88' : 
                         log.includes('ERROR') ? '#FF1E56' : 
                         '#fff'
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {log.split('').map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: charIndex * 0.01 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={logEndRef} />
      </div>

      {/* Blinking cursor */}
      <motion.div
        className="inline-block w-2 h-4 ml-2 mt-2"
        style={{ backgroundColor: '#00FF88' }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </div>
  );
}
