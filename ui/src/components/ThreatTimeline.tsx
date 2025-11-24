import { motion } from 'motion/react';
import { Circle } from 'lucide-react';

const timelineEvents = [
  { time: '0.00s', event: 'Process Started', severity: 'info', color: '#00D1FF' },
  { time: '0.12s', event: 'DLL Injection Detected', severity: 'high', color: '#FF1E56' },
  { time: '0.34s', event: 'Registry Modification', severity: 'medium', color: '#FFA500' },
  { time: '0.56s', event: 'Network Connection Initiated', severity: 'high', color: '#FF1E56' },
  { time: '0.78s', event: 'File System Write', severity: 'medium', color: '#FFA500' },
  { time: '1.02s', event: 'Keylogger Activity', severity: 'critical', color: '#FF1E56' },
  { time: '1.24s', event: 'Process Terminated', severity: 'info', color: '#00D1FF' }
];

export function ThreatTimeline() {
  return (
    <div className="relative">
      {/* Timeline Line */}
      <div 
        className="absolute left-6 top-0 bottom-0 w-0.5"
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      />

      <div className="space-y-6">
        {timelineEvents.map((event, index) => (
          <motion.div
            key={index}
            className="relative flex items-start space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {/* Timeline Dot */}
            <div className="relative z-10 flex-shrink-0">
              <motion.div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ 
                  backgroundColor: `${event.color}20`,
                  border: `2px solid ${event.color}`
                }}
                whileHover={{ scale: 1.1 }}
              >
                <Circle className="w-4 h-4" style={{ color: event.color, fill: event.color }} />
              </motion.div>

              {/* Pulse Effect */}
              {event.severity === 'critical' && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: `2px solid ${event.color}` }}
                  animate={{
                    scale: [1, 1.5],
                    opacity: [0.5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>

            {/* Event Content */}
            <div className="flex-1 pt-2">
              <div className="flex items-center justify-between mb-1">
                <h4 style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                  {event.event}
                </h4>
                <span 
                  className="text-sm opacity-60"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
                >
                  {event.time}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span 
                  className="text-xs px-2 py-1 rounded"
                  style={{ 
                    backgroundColor: `${event.color}20`,
                    color: event.color,
                    fontFamily: 'JetBrains Mono, monospace'
                  }}
                >
                  {event.severity.toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
