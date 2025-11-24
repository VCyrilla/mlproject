import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Filter, Download, Trash2, Eye } from 'lucide-react';
import { Screen } from '../App';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { analysisAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface HistoryScreenProps {
  onNavigate: (screen: Screen, data?: any) => void;
}

export function HistoryScreen({ onNavigate }: HistoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const response = await analysisAPI.getHistory();
      setHistoryData(response.analyses || []);
    } catch (error) {
      console.error('Error loading history:', error);
      toast.error('Failed to load analysis history');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (analysis: any) => {
    onNavigate('results', { analysisData: analysis });
  };

  const handleDownload = (analysis: any) => {
    // Create a downloadable JSON report
    const report = {
      fileName: analysis.file_name,
      fileHash: analysis.file_hash,
      threatScore: analysis.threat_score,
      status: analysis.status,
      uploadDate: analysis.upload_date,
      vulnerabilities: analysis.vulnerabilities,
      actionStatus: analysis.action_status,
      actionDate: analysis.action_date
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${analysis.file_name}_report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Analysis report downloaded');
  };

  const handleDelete = async (analysis: any) => {
    if (!confirm(`Are you sure you want to delete the analysis for "${analysis.file_name}"?`)) {
      return;
    }

    try {
      await analysisAPI.deleteAnalysis(analysis.id);
      toast.success('Analysis deleted successfully');
      loadHistory(); // Reload the list
    } catch (error) {
      console.error('Error deleting analysis:', error);
      toast.error('Failed to delete analysis');
    }
  };

  const getThreatColor = (level: number) => {
    if (level >= 80) return '#FF1E56';
    if (level >= 60) return '#FFA500';
    if (level >= 40) return '#FFD700';
    return '#00FF88';
  };

  const getStatusLabel = (analysis: any) => {
    if (analysis.action_status === 'mitigated') return 'Mitigated';
    if (analysis.action_status === 'quarantined') return 'Quarantined';
    if (analysis.action_status === 'blocked') return 'Blocked';
    return analysis.status;
  };

  const filteredData = historyData.filter(item => 
    item.file_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.file_hash.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          <div className="flex items-center justify-between">
            <div>
              <h1 
                className="text-4xl mb-2"
                style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
              >
                Analysis History
              </h1>
              <p 
                className="opacity-60"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
              >
                View and manage past malware analyses
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-6 flex items-center space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#00FF88' }} />
            <Input
              type="text"
              placeholder="Search files by name or hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-white/5 border-white/10 text-white"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
          </div>
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </motion.div>

        {/* History Table */}
        <motion.div
          className="rounded-3xl border overflow-hidden"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {loading ? (
            <div className="p-12 text-center" style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
              Loading analysis history...
            </div>
          ) : filteredData.length === 0 ? (
            <div className="p-12 text-center" style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
              No analyses found. Start by analyzing a file.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                    <th className="p-4 text-left" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}>
                      File Name
                    </th>
                    <th className="p-4 text-left" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}>
                      Date
                    </th>
                    <th className="p-4 text-left" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}>
                      Threat Level
                    </th>
                    <th className="p-4 text-left" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}>
                      Status
                    </th>
                    <th className="p-4 text-left" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}>
                      Size
                    </th>
                    <th className="p-4 text-left" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      className="group"
                      style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(0, 255, 136, 0.02)' }}
                    >
                      <td className="p-4">
                        <div>
                          <p style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                            {item.file_name}
                          </p>
                          <p className="text-xs opacity-40" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                            {item.file_hash.substring(0, 12)}...
                          </p>
                        </div>
                      </td>
                      <td className="p-4" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', opacity: 0.7 }}>
                        {new Date(item.upload_date).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-16 h-2 rounded-full overflow-hidden"
                            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                          >
                            <div 
                              className="h-full"
                              style={{ 
                                width: `${item.threat_score}%`,
                                backgroundColor: getThreatColor(item.threat_score)
                              }}
                            />
                          </div>
                          <span 
                            className="text-sm"
                            style={{ 
                              fontFamily: 'JetBrains Mono, monospace',
                              color: getThreatColor(item.threat_score)
                            }}
                          >
                            {item.threat_score}%
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span 
                          className="px-3 py-1 rounded-lg text-sm"
                          style={{
                            backgroundColor: `${getThreatColor(item.threat_score)}20`,
                            color: getThreatColor(item.threat_score),
                            fontFamily: 'JetBrains Mono, monospace'
                          }}
                        >
                          {getStatusLabel(item)}
                        </span>
                      </td>
                      <td className="p-4" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', opacity: 0.7 }}>
                        {(item.file_size / 1024 / 1024).toFixed(2)} MB
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleViewDetails(item)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            style={{ color: '#00D1FF' }}
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownload(item)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            style={{ color: '#00FF88' }}
                            title="Download Report"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(item)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                            style={{ color: '#FF1E56' }}
                            title="Delete Analysis"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
