import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, History, Box, Settings, LogOut, Shield, TrendingUp, Zap, ChevronLeft, ChevronRight, Bell, User, HeadphonesIcon, Terminal } from 'lucide-react';
import { FileDropzone } from './FileDropzone';
import { StatsCard } from './StatsCard';
import { RecentAnalysisCard } from './RecentAnalysisCard';
import { NotificationDropdown } from './NotificationDropdown';
import { UserDropdown } from './UserDropdown';
import { Screen } from '../App';

interface DashboardHomeProps {
  onFileUpload: (file: File) => void;
  onNavigate: (screen: Screen) => void;
}

const recentAnalyses = [
  {
    fileName: 'ransomware.exe',
    threatLevel: 92,
    status: 'Mitigated',
    mitreTactics: ['T1055', 'T1071'],
    timestamp: '2 hours ago'
  },
  {
    fileName: 'trojan_loader.dll',
    threatLevel: 87,
    status: 'Quarantined',
    mitreTactics: ['T1059', 'T1105'],
    timestamp: '5 hours ago'
  },
  {
    fileName: 'keylogger_v2.exe',
    threatLevel: 76,
    status: 'Blocked',
    mitreTactics: ['T1056', 'T1113'],
    timestamp: '1 day ago'
  },
  {
    fileName: 'benign_app.exe',
    threatLevel: 12,
    status: 'Safe',
    mitreTactics: [],
    timestamp: '2 days ago'
  }
];

export function DashboardHome({ onFileUpload, onNavigate }: DashboardHomeProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [filesScanned, setFilesScanned] = useState(1247);
  const [threatsBlocked, setThreatsBlocked] = useState(89);
  const [avgResponse, setAvgResponse] = useState(2.3);

  useEffect(() => {
    // Animate counters
    const interval = setInterval(() => {
      setFilesScanned(prev => prev + Math.floor(Math.random() * 3));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { icon: Upload, label: 'Upload', active: true, screen: 'dashboard' as Screen },
    { icon: History, label: 'History', active: false, screen: 'history' as Screen },
    { icon: Box, label: 'Models', active: false, screen: 'models' as Screen },
    { icon: HeadphonesIcon, label: 'Support', active: false, screen: 'support' as Screen },
    { icon: Terminal, label: 'CLI', active: false, screen: 'cli' as Screen },
    { icon: Settings, label: 'Settings', active: false, screen: 'settings' as Screen },
  ];

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0B0B0F' }}>
      {/* Sidebar */}
      <motion.aside
        className="relative border-r"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          borderColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)'
        }}
        animate={{ width: sidebarCollapsed ? 80 : 240 }}
        transition={{ duration: 0.3 }}
      >
        {/* Logo */}
        <div className="flex items-center p-6 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
          <Shield className="w-8 h-8 flex-shrink-0" style={{ color: '#00FF88' }} />
          {!sidebarCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-3 text-xl"
              style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#00FF88' }}
            >
              NEXUS
            </motion.span>
          )}
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => onNavigate(item.screen)}
              className="w-full flex items-center p-3 rounded-xl transition-all"
              style={{
                backgroundColor: item.active ? 'rgba(0, 255, 136, 0.1)' : 'transparent',
                color: item.active ? '#00FF88' : '#fff',
                border: item.active ? '1px solid rgba(0, 255, 136, 0.2)' : '1px solid transparent'
              }}
              whileHover={{ 
                backgroundColor: 'rgba(0, 255, 136, 0.05)',
                x: 4
              }}
              whileTap={{ scale: 0.95 }}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="ml-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                  {item.label}
                </span>
              )}
              {item.active && !sidebarCollapsed && (
                <motion.div
                  className="ml-auto w-2 h-2 rounded-full"
                  style={{ backgroundColor: '#00FF88' }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              )}
            </motion.button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
          <motion.button
            className="w-full flex items-center p-3 rounded-xl"
            style={{ color: '#FF1E56' }}
            whileHover={{ 
              backgroundColor: 'rgba(255, 30, 86, 0.1)',
              x: 4
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('login')}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="ml-3" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                Logout
              </span>
            )}
          </motion.button>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: '#0B0B0F',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#00FF88'
          }}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div 
          className="flex items-center justify-between p-4 border-b sticky top-0 z-20"
          style={{
            backgroundColor: 'rgba(11, 11, 15, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div className="flex items-center space-x-3">
            <Shield className="w-6 h-6" style={{ color: '#00FF88' }} />
            <span 
              className="text-xl"
              style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#00FF88' }}
            >
              NEXUS
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <NotificationDropdown onNavigate={onNavigate} />
            
            {/* User Avatar */}
            <UserDropdown onNavigate={onNavigate} />
          </div>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl mb-2" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
              Welcome Back, <span style={{ color: '#00FF88' }}>Vanessa</span>
            </h1>
            <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'rgba(255, 255, 255, 0.5)' }}>
              ML-Powered Malware Execution Analysis
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatsCard
              icon={Upload}
              label="Files Scanned"
              value={filesScanned.toLocaleString()}
              trend="+12.5%"
              color="#00FF88"
            />
            <StatsCard
              icon={Shield}
              label="Threats Blocked"
              value={threatsBlocked}
              trend="+8.3%"
              color="#FF1E56"
            />
            <StatsCard
              icon={Zap}
              label="Avg. Response"
              value={`${avgResponse}s`}
              trend="-0.4s"
              color="#00D1FF"
            />
          </div>

          {/* File Dropzone */}
          <FileDropzone onFileUpload={onFileUpload} />

          {/* Recent Analyses */}
          <div className="mt-8">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 mr-2" style={{ color: '#00D1FF' }} />
              <h2 className="text-2xl" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                Recent Analyses
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recentAnalyses.map((analysis, index) => (
                <RecentAnalysisCard key={index} analysis={analysis} delay={index * 0.1} />
              ))}
            </div>
          </div>

          {/* File Actions Categories */}
          <div className="mt-8">
            <h2 className="text-2xl mb-4" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
              File Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.button
                onClick={() => onNavigate('files-mitigated' as Screen)}
                className="p-6 rounded-2xl border text-left"
                style={{
                  backgroundColor: 'rgba(0, 209, 255, 0.05)',
                  borderColor: 'rgba(0, 209, 255, 0.2)',
                }}
                whileHover={{ scale: 1.02, borderColor: 'rgba(0, 209, 255, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield className="w-8 h-8 mb-3" style={{ color: '#00D1FF' }} />
                <h3 className="text-xl mb-2" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                  Mitigated Files
                </h3>
                <p className="text-sm opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                  View files with applied security patches
                </p>
              </motion.button>

              <motion.button
                onClick={() => onNavigate('files-quarantined' as Screen)}
                className="p-6 rounded-2xl border text-left"
                style={{
                  backgroundColor: 'rgba(255, 215, 0, 0.05)',
                  borderColor: 'rgba(255, 215, 0, 0.2)',
                }}
                whileHover={{ scale: 1.02, borderColor: 'rgba(255, 215, 0, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Box className="w-8 h-8 mb-3" style={{ color: '#FFD700' }} />
                <h3 className="text-xl mb-2" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                  Quarantined Files
                </h3>
                <p className="text-sm opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                  Files isolated from the system
                </p>
              </motion.button>

              <motion.button
                onClick={() => onNavigate('files-blocked' as Screen)}
                className="p-6 rounded-2xl border text-left"
                style={{
                  backgroundColor: 'rgba(255, 30, 86, 0.05)',
                  borderColor: 'rgba(255, 30, 86, 0.2)',
                }}
                whileHover={{ scale: 1.02, borderColor: 'rgba(255, 30, 86, 0.4)' }}
                whileTap={{ scale: 0.98 }}
              >
                <Shield className="w-8 h-8 mb-3" style={{ color: '#FF1E56' }} />
                <h3 className="text-xl mb-2" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                  Blocked Files
                </h3>
                <p className="text-sm opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                  Files permanently blocked from execution
                </p>
              </motion.button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}