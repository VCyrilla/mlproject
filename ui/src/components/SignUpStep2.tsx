import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { MatrixRain } from './MatrixRain';
import { GlitchText } from './GlitchText';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Screen, SignUpData } from '../App';
import { toast } from 'sonner@2.0.3';
import { authAPI, setAccessToken } from '../utils/api';

interface SignUpStep2Props {
  email: string;
  onComplete: () => void;
  onNavigate: (screen: Screen) => void;
  signUpData: SignUpData;
}

export function SignUpStep2({ email, onComplete, onNavigate, signUpData }: SignUpStep2Props) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(59);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      toast.error('Invalid code', {
        description: 'Please enter all 6 digits.',
      });
      return;
    }

    setIsVerifying(true);
    try {
      // Create the user account
      const response = await authAPI.signup({
        email: signUpData.email,
        password: signUpData.password,
        fullName: signUpData.fullName,
        organization: signUpData.organization,
        role: signUpData.role
      });

      if (response.success) {
        toast.success('Account created successfully!', {
          description: 'You can now access NEXUS.',
          duration: 3000,
        });
        
        // Auto-login after signup
        const loginResponse = await authAPI.signin(signUpData.email, signUpData.password);
        setAccessToken(loginResponse.session.access_token);
        
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error('Account creation failed', {
        description: error.message || 'Please try again.',
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = () => {
    setTimeLeft(59);
    toast.info('Verification code resent!', {
      description: `New code sent to ${email}`,
    });
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
        className="relative z-10 w-full max-w-md px-6"
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
            onClick={() => onNavigate('signup1')}
            className="flex items-center mb-6 opacity-60 hover:opacity-100 transition-opacity"
            style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
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
            Verify Your Email
          </h2>
          <p className="text-center mb-6 opacity-70" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00D1FF' }}>
            Step 2 of 2 • Verification Code
          </p>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}>
                Progress: 2/2
              </span>
              <span className="text-sm opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                100%
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
                initial={{ width: '50%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>

          <p className="text-center mb-8" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', opacity: 0.8 }}>
            Enter 6-digit code sent to
            <br />
            <span style={{ color: '#00FF88' }}>{email}</span>
          </p>

          {/* Code Inputs */}
          <div className="flex justify-center gap-3 mb-8">
            {code.map((digit, index) => (
              <Input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl bg-white/5 border-white/10 text-white"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  borderColor: digit ? '#00FF88' : 'rgba(255, 255, 255, 0.1)'
                }}
              />
            ))}
          </div>

          {/* Resend */}
          <div className="text-center mb-6">
            {timeLeft > 0 ? (
              <p className="text-sm opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                Resend code in <span style={{ color: '#00D1FF' }}>{timeLeft}s</span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm transition-colors"
                style={{ color: '#00FF88', fontFamily: 'JetBrains Mono, monospace' }}
              >
                Resend Code
              </button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full relative overflow-hidden group"
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
              <CheckCircle className="mr-2 w-4 h-4" />
              {isVerifying ? 'Creating Account...' : 'Verify & Create Account'}
            </motion.span>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}