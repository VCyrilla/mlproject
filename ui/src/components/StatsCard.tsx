import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend: string;
  color: string;
}

export function StatsCard({ icon: Icon, label, value, trend, color }: StatsCardProps) {
  const isPositive = trend.startsWith('+');
  
  return (
    <motion.div
      className="rounded-2xl p-6 border"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)'
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -4,
        boxShadow: `0 8px 30px ${color}20`
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div 
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
        <span 
          className="text-sm px-2 py-1 rounded-lg"
          style={{
            backgroundColor: isPositive ? 'rgba(0, 255, 136, 0.1)' : 'rgba(0, 209, 255, 0.1)',
            color: isPositive ? '#00FF88' : '#00D1FF',
            fontFamily: 'JetBrains Mono, monospace'
          }}
        >
          {trend}
        </span>
      </div>

      <p 
        className="opacity-60 mb-2"
        style={{ 
          fontFamily: 'JetBrains Mono, monospace',
          color: '#fff'
        }}
      >
        {label}
      </p>

      <motion.p 
        className="text-3xl"
        style={{ 
          fontFamily: 'SF Pro Display, system-ui, sans-serif',
          color: '#fff'
        }}
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
      >
        {value}
      </motion.p>
    </motion.div>
  );
}
