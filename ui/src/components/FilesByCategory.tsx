import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Lock, Ban, Eye, Download, AlertTriangle } from 'lucide-react';
import { Screen } from '../App';
import { Button } from './ui/button';
import { analysisAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface FilesByCategoryProps {
  category: 'mitigated' | 'quarantined' | 'blocked';
  onNavigate: (screen: Screen, data?: any) => void;
}

export function FilesByCategory({ category, onNavigate }: FilesByCategoryProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, [category]);

  const loadFiles = async () => {
    try {
      const response = await analysisAPI.getFilesByStatus(category);
      setFiles(response.files || []);
    } catch (error) {
      console.error('Error loading files:', error);
      toast.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryConfig = () => {
    switch (category) {
      case 'mitigated':
        return {
          title: 'Mitigated Files',
          icon: Shield,
          color: '#00D1FF',
          description: 'Files that have been successfully mitigated with security patches applied'
        };
      case 'quarantined':
        return {
          title: 'Quarantined Files',
          icon: Lock,
          color: '#FFD700',
          description: 'Files isolated from the system to prevent potential harm'
        };
      case 'blocked':
        return {
          title: 'Blocked Files',
          icon: Ban,
          color: '#FF1E56',
          description: 'Files permanently blocked from execution'
        };
    }
  };

  const config = getCategoryConfig();
  const Icon = config.icon;

  const getThreatColor = (level: number) => {
    if (level >= 80) return '#FF1E56';
    if (level >= 60) return '#FFA500';
    if (level >= 40) return '#FFD700';
    return '#00FF88';
  };

  const handleViewDetails = (file: any) => {
    onNavigate('results', { analysisData: file });
  };

  const handleDownload = (file: any) => {
    const report = {
      fileName: file.file_name,
      fileHash: file.file_hash,
      threatScore: file.threat_score,
      status: file.status,
      actionStatus: file.action_status,
      actionDate: file.action_date,
      vulnerabilities: file.vulnerabilities
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.file_name}_${category}_report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Report downloaded');
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#0B0B0F' }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8"
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

          <div className="flex items-center mb-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mr-4"
              style={{
                backgroundColor: `${config.color}20`,
                border: `2px solid ${config.color}40`
              }}
            >
              <Icon className="w-8 h-8" style={{ color: config.color }} />
            </div>
            <div>
              <h1 
                className="text-4xl mb-2"
                style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
              >
                {config.title}
              </h1>
              <p 
                className="opacity-60"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
              >
                {config.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4">
            <div 
              className="px-4 py-2 rounded-xl"
              style={{
                backgroundColor: `${config.color}15`,
                border: `1px solid ${config.color}30`
              }}
            >
              <span 
                className="text-2xl mr-2"
                style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: config.color }}
              >
                {files.length}
              </span>
              <span 
                className="text-sm opacity-70"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
              >
                Total Files
              </span>
            </div>
          </div>
        </motion.div>

        {/* Files Grid */}
        {loading ? (
          <div className="text-center py-20" style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
            Loading files...
          </div>
        ) : files.length === 0 ? (
          <motion.div
            className="text-center py-20 rounded-3xl border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.05)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Icon className="w-16 h-16 mx-auto mb-4 opacity-30" style={{ color: config.color }} />
            <p style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
              No {category} files found
            </p>
            <p className="text-sm opacity-50 mt-2" style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
              Files will appear here after you apply the {category} action
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file, index) => (
              <motion.div
                key={file.id}
                className="rounded-2xl p-6 border cursor-pointer group"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderColor: `${config.color}20`,
                  backdropFilter: 'blur(12px)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  borderColor: `${config.color}50`
                }}
              >
                {/* File Header */}
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${config.color}15`,
                      border: `1px solid ${config.color}30`
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: config.color }} />
                  </div>
                  <span 
                    className="px-3 py-1 rounded-lg text-xs"
                    style={{
                      backgroundColor: `${getThreatColor(file.threat_score)}20`,
                      color: getThreatColor(file.threat_score),
                      fontFamily: 'JetBrains Mono, monospace'
                    }}
                  >
                    {file.threat_score}% Threat
                  </span>
                </div>

                {/* File Info */}
                <h3 
                  className="text-lg mb-2 truncate"
                  style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
                >
                  {file.file_name}
                </h3>
                <p 
                  className="text-xs opacity-40 mb-4 truncate"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
                >
                  {file.file_hash.substring(0, 16)}...
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                      Size
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                      {(file.file_size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                      Action Date
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                      {new Date(file.action_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                      Vulnerabilities
                    </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: getThreatColor(file.threat_score) }}>
                      {file.vulnerabilities?.length || 0} found
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(file);
                    }}
                    size="sm"
                    className="flex-1 bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file);
                    }}
                    size="sm"
                    className="flex-1 bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Report
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
