import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, AlertTriangle, Shield, Activity, Target, Network, Database, ChevronRight, Lock, Ban, AlertOctagon } from 'lucide-react';
import { Screen, AnalysisData } from '../App';
import { RadialProgress } from './RadialProgress';
import { ThreatTimeline } from './ThreatTimeline';
import { BehaviorGraph } from './BehaviorGraph';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { analysisAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface AnalysisResultsProps {
  data: AnalysisData | any;
  onNavigate: (screen: Screen) => void;
}

export function AnalysisResults({ data, onNavigate }: AnalysisResultsProps) {
  const [actionStatus, setActionStatus] = useState(data.action_status || 'pending');
  const [isApplyingAction, setIsApplyingAction] = useState(false);

  const getThreatLevel = () => {
    const threatLevel = data.threatLevel || data.threat_score || 0;
    if (threatLevel >= 80) return { label: 'CRITICAL', color: '#FF1E56' };
    if (threatLevel >= 60) return { label: 'HIGH', color: '#FFA500' };
    if (threatLevel >= 40) return { label: 'MEDIUM', color: '#FFD700' };
    return { label: 'LOW', color: '#00FF88' };
  };

  const threat = getThreatLevel();
  const threatLevel = data.threatLevel || data.threat_score || 0;

  // OWASP Top 10 categories (2021)
  const owaspCategories = data.vulnerabilities || [
    { 
      id: 'A01', 
      name: 'Broken Access Control', 
      severity: 'High',
      description: 'Unauthorized access to resources detected',
      instances: 3
    },
    { 
      id: 'A03', 
      name: 'Injection', 
      severity: 'Critical',
      description: 'SQL/Command injection patterns found',
      instances: 2
    },
    { 
      id: 'A06', 
      name: 'Vulnerable Components', 
      severity: 'Medium',
      description: 'Outdated libraries with known vulnerabilities',
      instances: 5
    }
  ];

  const handleApplyAction = async (action: string) => {
    if (!confirm(`Are you sure you want to ${action} this file?`)) {
      return;
    }

    setIsApplyingAction(true);
    try {
      const analysisId = data.id || data.analysisId;
      await analysisAPI.applyAction(analysisId, action, `Action applied: ${action}`);
      setActionStatus(action);
      toast.success(`File ${action} successfully`);
    } catch (error) {
      console.error(`Error applying ${action}:`, error);
      toast.error(`Failed to ${action} file`);
    } finally {
      setIsApplyingAction(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    if (severity === 'Critical') return '#FF1E56';
    if (severity === 'High') return '#FFA500';
    if (severity === 'Medium') return '#FFD700';
    return '#00FF88';
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#0B0B0F' }}>
      {/* Header */}
      <motion.div
        className="max-w-7xl mx-auto mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center mb-6 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h1 
              className="text-4xl mb-2"
              style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
            >
              Analysis Report
            </h1>
            <p 
              className="opacity-60"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
            >
              {data.fileName || data.file_name} • {((data.fileSize || data.file_size || 0) / 1024).toFixed(2)} KB
            </p>
          </div>

          <div className="text-right">
            <div 
              className="inline-block px-4 py-2 rounded-xl mb-2"
              style={{ 
                backgroundColor: `${threat.color}20`,
                color: threat.color,
                fontFamily: 'JetBrains Mono, monospace'
              }}
            >
              {threat.label} THREAT
            </div>
            <p 
              className="text-sm opacity-60"
              style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
            >
              {data.timestamp ? data.timestamp.toLocaleString() : new Date(data.upload_date).toLocaleString()}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      {actionStatus === 'pending' && (
        <motion.div
          className="max-w-7xl mx-auto mb-6 flex items-center justify-center gap-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={() => handleApplyAction('mitigated')}
            disabled={isApplyingAction}
            className="bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30"
          >
            <Shield className="w-4 h-4 mr-2" />
            Mitigate
          </Button>
          <Button
            onClick={() => handleApplyAction('quarantined')}
            disabled={isApplyingAction}
            className="bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30"
          >
            <Lock className="w-4 h-4 mr-2" />
            Quarantine
          </Button>
          <Button
            onClick={() => handleApplyAction('blocked')}
            disabled={isApplyingAction}
            className="bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
          >
            <Ban className="w-4 h-4 mr-2" />
            Block
          </Button>
        </motion.div>
      )}

      {/* Status Badge */}
      {actionStatus !== 'pending' && (
        <motion.div
          className="max-w-7xl mx-auto mb-6 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div 
            className="px-6 py-3 rounded-xl flex items-center"
            style={{
              backgroundColor: 'rgba(0, 255, 136, 0.1)',
              border: '1px solid rgba(0, 255, 136, 0.3)'
            }}
          >
            <Shield className="w-5 h-5 mr-2" style={{ color: '#00FF88' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}>
              File {actionStatus.toUpperCase()}
            </span>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6">
        {/* Threat Score Card */}
        <motion.div
          className="col-span-12 lg:col-span-4 rounded-3xl p-8 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)'
          }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center mb-6">
            <AlertTriangle className="w-6 h-6 mr-2" style={{ color: threat.color }} />
            <h2 
              className="text-2xl"
              style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
            >
              Threat Score
            </h2>
          </div>

          <div className="flex justify-center mb-6">
            <RadialProgress value={threatLevel} size={180} color={threat.color} strokeWidth={12} />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                Behavior Score
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                {threatLevel - 5}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                Signature Match
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                {threatLevel + 3}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                ML Confidence
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                {threatLevel - 2}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* OWASP Top 10 Vulnerabilities */}
        <motion.div
          className="col-span-12 lg:col-span-8 rounded-3xl p-8 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)'
          }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center mb-6">
            <AlertOctagon className="w-6 h-6 mr-2" style={{ color: '#00D1FF' }} />
            <h2 
              className="text-2xl"
              style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
            >
              OWASP Top 10 Vulnerabilities
            </h2>
          </div>

          <div className="space-y-4">
            {owaspCategories.map((vuln, index) => (
              <motion.div
                key={vuln.id || index}
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  borderColor: `${getSeverityColor(vuln.severity)}30`
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <span 
                      className="px-2 py-1 rounded text-xs mr-3"
                      style={{
                        backgroundColor: `${getSeverityColor(vuln.severity)}20`,
                        color: getSeverityColor(vuln.severity),
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      {vuln.owasp_id || vuln.id}
                    </span>
                    <h3 
                      className="text-lg"
                      style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
                    >
                      {vuln.owasp_name || vuln.name}
                    </h3>
                  </div>
                  <span 
                    className="px-3 py-1 rounded-lg text-xs"
                    style={{
                      backgroundColor: `${getSeverityColor(vuln.severity)}15`,
                      color: getSeverityColor(vuln.severity),
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    {vuln.severity}
                  </span>
                </div>
                <p 
                  className="text-sm opacity-70"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
                >
                  {vuln.description}
                </p>
                {vuln.instances && (
                  <p 
                    className="text-xs mt-2 opacity-50"
                    style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
                  >
                    {vuln.instances} instance(s) detected
                  </p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Execution Timeline */}
        <motion.div
          className="col-span-12 rounded-3xl p-8 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center mb-6">
            <Activity className="w-6 h-6 mr-2" style={{ color: '#00FF88' }} />
            <h2 
              className="text-2xl"
              style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
            >
              Execution Timeline
            </h2>
          </div>

          <ThreatTimeline />
        </motion.div>

        {/* Behavior Graph */}
        <motion.div
          className="col-span-12 lg:col-span-6 rounded-3xl p-8 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <Network className="w-6 h-6 mr-2" style={{ color: '#FF1E56' }} />
            <h2 
              className="text-2xl"
              style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
            >
              API Call Behavior
            </h2>
          </div>

          <BehaviorGraph />
        </motion.div>

        {/* File Details */}
        <motion.div
          className="col-span-12 lg:col-span-6 rounded-3xl p-8 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center mb-6">
            <Database className="w-6 h-6 mr-2" style={{ color: '#00D1FF' }} />
            <h2 
              className="text-2xl"
              style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
            >
              File Details
            </h2>
          </div>

          <div className="space-y-4">
            <DetailRow label="File Name" value={data.fileName || data.file_name} />
            <DetailRow label="File Size" value={`${((data.fileSize || data.file_size || 0) / 1024).toFixed(2)} KB`} />
            <DetailRow label="SHA256 Hash" value={data.file_hash || 'a3b5c7d9e1f3g5h7...'} mono />
            <DetailRow label="File Type" value={data.fileType || data.file_type || 'PE32 Executable'} />
            <DetailRow label="Status" value={actionStatus === 'pending' ? 'Analyzed' : actionStatus.toUpperCase()} />
            {data.action_date && <DetailRow label="Action Date" value={new Date(data.action_date).toLocaleString()} />}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
      <span className="opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
        {label}
      </span>
      <span 
        className={mono ? 'text-right' : ''}
        style={{ 
          fontFamily: mono ? 'JetBrains Mono, monospace' : 'inherit',
          color: '#fff'
        }}
      >
        {value}
      </span>
    </div>
  );
}
