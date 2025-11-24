import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, LogOut } from 'lucide-react';
import { Screen } from '../App';

interface UserDropdownProps {
  onNavigate: (screen: Screen) => void;
}

export function UserDropdown({ onNavigate }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigation = (screen: Screen) => {
    setIsOpen(false);
    onNavigate(screen);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/5 transition-colors"
      >
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #00FF88 0%, #00D1FF 100%)'
          }}
        >
          <span style={{ color: '#0B0B0F', fontFamily: 'JetBrains Mono, monospace' }}>
            VC
          </span>
        </div>
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
              className="absolute right-0 mt-2 w-64 rounded-2xl border overflow-hidden z-20"
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
              {/* User Info */}
              <div className="p-4 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #00FF88 0%, #00D1FF 100%)'
                    }}
                  >
                    <span 
                      className="text-xl"
                      style={{ color: '#0B0B0F', fontFamily: 'JetBrains Mono, monospace' }}
                    >
                      VC
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p 
                      className="truncate"
                      style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
                    >
                      Vanessa Cyrilla
                    </p>
                    <p 
                      className="text-sm opacity-60 truncate"
                      style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
                    >
                      vanessa@strathmore.ac.ke
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => handleNavigation('settings')}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors"
                >
                  <User className="w-4 h-4" style={{ color: '#00D1FF' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                    Profile
                  </span>
                </button>

                <button
                  onClick={() => handleNavigation('settings')}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors"
                >
                  <Settings className="w-4 h-4" style={{ color: '#00D1FF' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                    Settings
                  </span>
                </button>

                <div className="border-t my-2" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

                <button
                  onClick={() => handleNavigation('login')}
                  className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-white/5 transition-colors"
                >
                  <LogOut className="w-4 h-4" style={{ color: '#FF1E56' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#FF1E56' }}>
                    Logout
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
