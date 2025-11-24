import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, AlertTriangle, Brain, MessageCircle } from 'lucide-react';
import { Screen } from '../App';

interface NotificationDropdownProps {
  onNavigate: (screen: Screen) => void;
}

const notifications = [
  {
    icon: AlertTriangle,
    color: '#FF1E56',
    title: 'New threat detected',
    description: 'ransomware.exe flagged as critical',
    time: '5 min ago',
    unread: true
  },
  {
    icon: Brain,
    color: '#00D1FF',
    title: 'Model retrained',
    description: 'DeepMalware-v3 updated with 500 new samples',
    time: '2 hours ago',
    unread: true
  },
  {
    icon: MessageCircle,
    color: '#00FF88',
    title: 'Support ticket replied',
    description: 'Ticket #124 has a new response',
    time: '1 day ago',
    unread: true
  }
];

export function NotificationDropdown({ onNavigate }: NotificationDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <Bell className="w-5 h-5" style={{ color: '#fff' }} />
        {unreadCount > 0 && (
          <span 
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
            style={{ 
              backgroundColor: '#FF1E56',
              color: '#fff',
              fontFamily: 'JetBrains Mono, monospace'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              className="absolute right-0 mt-2 w-80 rounded-2xl border overflow-hidden z-20"
              style={{
                backgroundColor: 'rgba(11, 11, 15, 0.98)',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(12px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <h3 
                  style={{ 
                    fontFamily: 'SF Pro Display, system-ui, sans-serif',
                    color: '#fff'
                  }}
                >
                  Notifications
                </h3>
                <p 
                  className="text-sm opacity-60 mt-1"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
                >
                  {unreadCount} unread
                </p>
              </div>

              {/* Notifications List */}
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notif, index) => (
                  <motion.div
                    key={index}
                    className="p-4 border-b hover:bg-white/5 cursor-pointer transition-colors"
                    style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-start space-x-3">
                      <div 
                        className="p-2 rounded-lg flex-shrink-0"
                        style={{ backgroundColor: `${notif.color}20` }}
                      >
                        <notif.icon className="w-4 h-4" style={{ color: notif.color }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <p 
                            className="text-sm mb-1"
                            style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
                          >
                            {notif.title}
                          </p>
                          {notif.unread && (
                            <div 
                              className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                              style={{ backgroundColor: '#00FF88' }}
                            />
                          )}
                        </div>
                        <p 
                          className="text-xs opacity-60 mb-1"
                          style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
                        >
                          {notif.description}
                        </p>
                        <p 
                          className="text-xs opacity-40"
                          style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
                        >
                          {notif.time}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-3 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <button
                  className="w-full text-center text-sm py-2 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: '#00D1FF', fontFamily: 'JetBrains Mono, monospace' }}
                >
                  View all notifications
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
