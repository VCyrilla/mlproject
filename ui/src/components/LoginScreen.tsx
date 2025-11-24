import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Chrome } from 'lucide-react';
import { MatrixRain } from './MatrixRain';
import { GlitchText } from './GlitchText';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Screen } from '../App';
import { authAPI, setAccessToken } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface LoginScreenProps {
  onLogin: (demoMode: boolean) => void;
  onNavigate: (screen: Screen) => void;
}

export function LoginScreen({ onLogin, onNavigate }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (demoMode) {
      onLogin(true);
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await authAPI.signin(email, password);
      setAccessToken(response.session.access_token);
      toast.success('Login successful!');
      onLogin(false);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Matrix Rain Background */}
      <MatrixRain />
      
      {/* Gradient Orb */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div 
          className="w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{
            background: 'radial-gradient(circle, #00FF88 0%, #00D1FF 100%)',
            opacity: 0.3
          }}
        />
      </motion.div>

      {/* Login Card */}
      <motion.div
        className="relative z-10 w-full max-w-md px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 50 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        <div 
          className="rounded-3xl p-8 backdrop-blur-xl border"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-12 h-12 mr-3" style={{ color: '#00FF88' }} />
            <GlitchText text="NEXUS" className="text-5xl" />
          </div>

          <p className="text-center mb-8 opacity-70" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00D1FF' }}>
            ML Execution Mapper
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="opacity-80" style={{ color: '#fff' }}>
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border-white/10 backdrop-blur-sm text-white placeholder:text-white/40"
                placeholder="vanessa.cyrilla@strathmore.edu"
                required={!demoMode}
                disabled={isLoggingIn}
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="opacity-80" style={{ color: '#fff' }}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/5 border-white/10 backdrop-blur-sm text-white placeholder:text-white/40"
                placeholder="••••••••"
                required={!demoMode}
                disabled={isLoggingIn}
              />
            </div>

            {/* Demo Mode Toggle */}
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'rgba(0, 255, 136, 0.1)' }}>
              <Label htmlFor="demo-mode" className="cursor-pointer" style={{ color: '#00FF88' }}>
                Demo Mode (Skip Auth)
              </Label>
              <Switch
                id="demo-mode"
                checked={demoMode}
                onCheckedChange={setDemoMode}
                disabled={isLoggingIn}
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, #00FF88 0%, #00D1FF 100%)',
                color: '#0B0B0F',
                border: 'none'
              }}
              disabled={isLoggingIn}
            >
              <motion.span
                className="relative z-10"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isLoggingIn ? 'Authenticating...' : 'Access NEXUS'}
              </motion.span>
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-xs opacity-50" style={{ color: '#fff' }}>
              BSc Project - Vanessa Cyrilla
            </p>
            <p className="text-xs opacity-50 mt-1" style={{ color: '#fff' }}>
              Strathmore University, June 2025
            </p>
            <p className="text-sm mt-4" style={{ color: '#fff', opacity: 0.7 }}>
              Don't have an account?{' '}
              <button
                onClick={() => onNavigate('signup1')}
                className="transition-colors"
                style={{ color: '#00FF88', textDecoration: 'underline' }}
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <p className="text-center mt-6 text-xs opacity-40" style={{ color: '#fff' }}>
          © 2025 Strathmore University
        </p>
      </motion.div>
    </div>
  );
}
