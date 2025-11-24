import { motion } from 'motion/react';
import { ArrowLeft, MessageCircle, Briefcase, ArrowRight, AlertCircle } from 'lucide-react';
import { Screen } from '../App';
import { Button } from './ui/button';

interface SupportCenterProps {
  onNavigate: (screen: Screen) => void;
}

export function SupportCenter({ onNavigate }: SupportCenterProps) {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#0B0B0F' }}>
      <div className="max-w-4xl mx-auto">
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

          <h1 
            className="text-4xl mb-2"
            style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
          >
            Support Center
          </h1>
          <p 
            className="opacity-60"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
          >
            Get help with NEXUS platform and services
          </p>
        </motion.div>

        {/* Important Notice Banner */}
        <motion.div
          className="rounded-2xl p-6 mb-8 border-2"
          style={{
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderColor: 'rgba(255, 193, 7, 0.4)',
            backdropFilter: 'blur(12px)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-1" style={{ color: '#FFC107' }} />
            <div className="flex-1">
              <h3 
                className="mb-2"
                style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#FFC107' }}
              >
                Important Notice
              </h3>
              <p 
                className="text-sm mb-2"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
              >
                GTI support moving to Google Cloud Console after{' '}
                <span style={{ color: '#FFC107' }}>December 2, 2025</span>
              </p>
              <p 
                className="text-sm opacity-70"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
              >
                Academic users will continue to receive free tier access with migration support.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Support Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commercial Inquiry Card */}
          <motion.div
            className="rounded-3xl p-8 border group"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)'
            }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{
              y: -8,
              borderColor: 'rgba(0, 209, 255, 0.3)',
              boxShadow: '0 12px 40px rgba(0, 209, 255, 0.2)'
            }}
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(0, 209, 255, 0.1)' }}
            >
              <Briefcase className="w-8 h-8" style={{ color: '#00D1FF' }} />
            </div>

            <h3 
              className="text-2xl mb-3"
              style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
            >
              Commercial Inquiry
            </h3>

            <ul className="space-y-3 mb-6">
              <li 
                className="flex items-start text-sm"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', opacity: 0.8 }}
              >
                <span className="mr-2" style={{ color: '#00D1FF' }}>•</span>
                Enterprise licensing & pricing
              </li>
              <li 
                className="flex items-start text-sm"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', opacity: 0.8 }}
              >
                <span className="mr-2" style={{ color: '#00D1FF' }}>•</span>
                Premium features & upgrades
              </li>
              <li 
                className="flex items-start text-sm"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', opacity: 0.8 }}
              >
                <span className="mr-2" style={{ color: '#00D1FF' }}>•</span>
                Subscription management
              </li>
              <li 
                className="flex items-start text-sm"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', opacity: 0.8 }}
              >
                <span className="mr-2" style={{ color: '#00D1FF' }}>•</span>
                Billing & payment questions
              </li>
            </ul>

            <Button
              className="w-full group"
              style={{
                background: 'linear-gradient(135deg, #00D1FF 0%, #0099CC 100%)',
                color: '#fff',
                border: 'none'
              }}
            >
              <motion.span
                className="flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Empower Your Team
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </Button>
          </motion.div>

          {/* Technical Support Card */}
          <motion.div
            className="rounded-3xl p-8 border group"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)'
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{
              y: -8,
              borderColor: 'rgba(0, 255, 136, 0.3)',
              boxShadow: '0 12px 40px rgba(0, 255, 136, 0.2)'
            }}
          >
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
              style={{ backgroundColor: 'rgba(0, 255, 136, 0.1)' }}
            >
              <MessageCircle className="w-8 h-8" style={{ color: '#00FF88' }} />
            </div>

            <h3 
              className="text-2xl mb-3"
              style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
            >
              Technical Support
            </h3>

            <ul className="space-y-3 mb-6">
              <li 
                className="flex items-start text-sm"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', opacity: 0.8 }}
              >
                <span className="mr-2" style={{ color: '#00FF88' }}>•</span>
                Bug reports & issues
              </li>
              <li 
                className="flex items-start text-sm"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', opacity: 0.8 }}
              >
                <span className="mr-2" style={{ color: '#00FF88' }}>•</span>
                Upload failures & errors
              </li>
              <li 
                className="flex items-start text-sm"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', opacity: 0.8 }}
              >
                <span className="mr-2" style={{ color: '#00FF88' }}>•</span>
                False positive reports
              </li>
              <li 
                className="flex items-start text-sm"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff', opacity: 0.8 }}
              >
                <span className="mr-2" style={{ color: '#00FF88' }}>•</span>
                Free quota & academic access
              </li>
            </ul>

            <Button
              className="w-full group"
              style={{
                background: 'linear-gradient(135deg, #00FF88 0%, #00CC6E 100%)',
                color: '#0B0B0F',
                border: 'none'
              }}
            >
              <motion.span
                className="flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ask Support
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.span>
            </Button>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          className="mt-8 rounded-3xl p-8 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 
            className="text-2xl mb-4"
            style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
          >
            Frequently Asked Questions
          </h3>

          <div className="space-y-4">
            <details className="group">
              <summary 
                className="cursor-pointer p-4 rounded-xl list-none"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#00FF88'
                }}
              >
                How do I upload files for analysis?
              </summary>
              <p 
                className="mt-2 p-4 text-sm opacity-70"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
              >
                Simply drag and drop your PE files (.exe, .dll, .sys) into the upload zone on the dashboard, or click to browse your files.
              </p>
            </details>

            <details className="group">
              <summary 
                className="cursor-pointer p-4 rounded-xl list-none"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#00FF88'
                }}
              >
                What is the academic free tier limit?
              </summary>
              <p 
                className="mt-2 p-4 text-sm opacity-70"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
              >
                Academic users from verified institutions get 100 free analyses per month with full ML model access.
              </p>
            </details>

            <details className="group">
              <summary 
                className="cursor-pointer p-4 rounded-xl list-none"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.02)',
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#00FF88'
                }}
              >
                How accurate are the threat predictions?
              </summary>
              <p 
                className="mt-2 p-4 text-sm opacity-70"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
              >
                Our ML models achieve 94.2% accuracy on average, trained on over 2.4M malware samples and continuously updated.
              </p>
            </details>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
