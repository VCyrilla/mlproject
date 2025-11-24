import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, ArrowRight } from 'lucide-react';
import { MatrixRain } from './MatrixRain';
import { GlitchText } from './GlitchText';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Screen, SignUpData } from '../App';

interface SignUpStep1Props {
  onNext: (data: SignUpData) => void;
  onNavigate: (screen: Screen) => void;
}

export function SignUpStep1({ onNext, onNavigate }: SignUpStep1Props) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    onNext({ fullName, email, organization, role, password });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <MatrixRain />
      
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

      <motion.div
        className="relative z-10 w-full max-w-2xl px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
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
          {/* Back Button */}
          <button
            onClick={() => onNavigate('login')}
            className="flex items-center mb-6 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-10 h-10 mr-3" style={{ color: '#00FF88' }} />
            <GlitchText text="NEXUS" className="text-4xl" />
          </div>

          <h2 
            className="text-2xl text-center mb-2"
            style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
          >
            Create Your Account
          </h2>
          <p className="text-center mb-6 opacity-70" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00D1FF' }}>
            Step 1 of 2 • Account Details
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}>
                Progress: 1/2
              </span>
              <span className="text-sm opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                50%
              </span>
            </div>
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ 
                  background: 'linear-gradient(90deg, #00FF88 0%, #00D1FF 100%)',
                  boxShadow: '0 0 10px rgba(0, 255, 136, 0.5)'
                }}
                initial={{ width: 0 }}
                animate={{ width: '50%' }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="opacity-80" style={{ color: '#fff' }}>
                Full Name
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-white/5 border-white/10 backdrop-blur-sm text-white placeholder:text-white/40"
                placeholder="Vanessa Cyrilla"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Email */}
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
                  placeholder="vanessa@strathmore.ac.ke"
                  required
                />
              </div>

              {/* Organization */}
              <div className="space-y-2">
                <Label htmlFor="organization" className="opacity-80" style={{ color: '#fff' }}>
                  Organization
                </Label>
                <Input
                  id="organization"
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="bg-white/5 border-white/10 backdrop-blur-sm text-white placeholder:text-white/40"
                  placeholder="Strathmore University"
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="opacity-80" style={{ color: '#fff' }}>
                Role
              </Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent className="bg-[#0B0B0F] border-white/10">
                  <SelectItem value="analyst">Security Analyst</SelectItem>
                  <SelectItem value="admin">System Administrator</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Password */}
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
                  required
                />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="opacity-80" style={{ color: '#fff' }}>
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/5 border-white/10 backdrop-blur-sm text-white placeholder:text-white/40"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Next Button */}
            <Button
              type="submit"
              className="w-full relative overflow-hidden group mt-6"
              style={{
                background: 'linear-gradient(135deg, #00FF88 0%, #00D1FF 100%)',
                color: '#0B0B0F',
                border: 'none'
              }}
            >
              <motion.span
                className="relative z-10 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next: Verification
                <ArrowRight className="ml-2 w-4 h-4" />
              </motion.span>
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
