import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';

interface MitreAttackMapProps {
  tactics: string[];
}

const mitreDetails: Record<string, { name: string; technique: string; description: string }> = {
  'T1055': {
    name: 'Process Injection',
    technique: 'Defense Evasion',
    description: 'Injecting code into processes to evade detection'
  },
  'T1071': {
    name: 'Application Layer Protocol',
    technique: 'Command and Control',
    description: 'Using application protocols for C2 communication'
  },
  'T1059': {
    name: 'Command and Scripting Interpreter',
    technique: 'Execution',
    description: 'Executing commands via scripting interpreters'
  },
  'T1105': {
    name: 'Ingress Tool Transfer',
    technique: 'Command and Control',
    description: 'Transferring tools into compromised environment'
  },
  'T1056': {
    name: 'Input Capture',
    technique: 'Collection',
    description: 'Capturing user input from keyboard/mouse'
  },
  'T1113': {
    name: 'Screen Capture',
    technique: 'Collection',
    description: 'Taking screenshots of user desktop'
  }
};

export function MitreAttackMap({ tactics }: MitreAttackMapProps) {
  return (
    <div className="space-y-3">
      {tactics.map((tactic, index) => {
        const detail = mitreDetails[tactic];
        if (!detail) return null;

        return (
          <motion.div
            key={tactic}
            className="p-4 rounded-xl border group cursor-pointer"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              borderColor: 'rgba(255, 255, 255, 0.05)'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{
              backgroundColor: 'rgba(0, 209, 255, 0.05)',
              borderColor: 'rgba(0, 209, 255, 0.2)',
              x: 4
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span 
                    className="px-3 py-1 rounded-lg text-sm"
                    style={{ 
                      backgroundColor: 'rgba(0, 209, 255, 0.2)',
                      color: '#00D1FF',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    {tactic}
                  </span>
                  <h4 style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                    {detail.name}
                  </h4>
                </div>

                <div className="flex items-start space-x-4 text-sm">
                  <span className="opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                    <span style={{ color: '#00FF88' }}>Tactic:</span> {detail.technique}
                  </span>
                  <span className="opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                    {detail.description}
                  </span>
                </div>
              </div>

              <ChevronRight 
                className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" 
                style={{ color: '#00D1FF' }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
