import { motion } from 'motion/react';
import { FileCode, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { RadialProgress } from './RadialProgress';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface RecentAnalysisCardProps {
  analysis: {
    fileName: string;
    threatLevel: number;
    status: string;
    mitreTactics: string[];
    timestamp: string;
  };
  delay?: number;
}

export function RecentAnalysisCard({ analysis, delay = 0 }: RecentAnalysisCardProps) {
  const getStatusIcon = () => {
    switch (analysis.status) {
      case 'Mitigated':
        return <Shield className="w-4 h-4" />;
      case 'Quarantined':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Blocked':
        return <AlertTriangle className="w-4 h-4" />;
      case 'Safe':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (analysis.status) {
      case 'Mitigated':
        return '#00D1FF';
      case 'Quarantined':
        return '#FF1E56';
      case 'Blocked':
        return '#FF1E56';
      case 'Safe':
        return '#00FF88';
      default:
        return '#fff';
    }
  };

  const getThreatColor = () => {
    if (analysis.threatLevel >= 80) return '#FF1E56';
    if (analysis.threatLevel >= 50) return '#FFA500';
    return '#00FF88';
  };

  return (
    <motion.div
      className="rounded-2xl p-6 border"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderColor: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(12px)'
      }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ 
        y: -4,
        borderColor: 'rgba(0, 255, 136, 0.2)',
        boxShadow: '0 8px 30px rgba(0, 255, 136, 0.1)'
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: 'rgba(0, 209, 255, 0.1)' }}
          >
            <FileCode className="w-5 h-5" style={{ color: '#00D1FF' }} />
          </div>

          <div className="flex-1">
            <h4 
              className="mb-1"
              style={{ 
                fontFamily: 'JetBrains Mono, monospace',
                color: '#fff'
              }}
            >
              {analysis.fileName}
            </h4>
            <div className="flex items-center space-x-2 text-sm opacity-60">
              <Clock className="w-3 h-3" style={{ color: '#fff' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                {analysis.timestamp}
              </span>
            </div>
          </div>
        </div>

        <RadialProgress 
          value={analysis.threatLevel} 
          size={60}
          color={getThreatColor()}
        />
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span 
            className="text-sm px-3 py-1 rounded-lg flex items-center space-x-2"
            style={{
              backgroundColor: `${getStatusColor()}15`,
              color: getStatusColor(),
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            {getStatusIcon()}
            <span>{analysis.status}</span>
          </span>
        </div>
      </div>

      {analysis.mitreTactics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <TooltipProvider>
            {analysis.mitreTactics.map((tactic, index) => (
              <Tooltip key={index}>
                <TooltipTrigger>
                  <Badge 
                    variant="outline"
                    className="text-xs border-white/10 bg-white/5"
                    style={{ 
                      color: '#00FF88',
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    {tactic}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                    MITRE ATT&CK Tactic: {tactic}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      )}
    </motion.div>
  );
}
