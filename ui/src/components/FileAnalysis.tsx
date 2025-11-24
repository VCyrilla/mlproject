import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, FileCode } from 'lucide-react';
import { ProgressRing } from './ProgressRing';
import { TerminalLog } from './TerminalLog';
import { Screen, AnalysisData } from '../App';
import { analysisAPI } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface FileAnalysisProps {
  file: File;
  onComplete: (data: AnalysisData) => void;
  onNavigate: (screen: Screen) => void;
}

const analysisSteps = [
  { message: '[INIT] Initializing analysis pipeline...', delay: 200 },
  { message: '[SCAN] Loading file structure...', delay: 400 },
  { message: '[EXTRACT] Extracting executable sections...', delay: 600 },
  { message: '[ML] Running ML behavioral model...', delay: 1000 },
  { message: '[DETECT] Analyzing OWASP vulnerability patterns...', delay: 1200 },
  { message: '[OWASP] Mapping to OWASP Top 10...', delay: 1500 },
  { message: '[THREAT] Calculating threat score...', delay: 1800 },
  { message: '[COMPLETE] Analysis finished!', delay: 2200 }
];

export function FileAnalysis({ file, onComplete, onNavigate }: FileAnalysisProps) {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    performAnalysis();
  }, [file]);

  const performAnalysis = async () => {
    // Simulate analysis progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Add logs progressively
    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step.message]);
        setCurrentStep(index + 1);
      }, step.delay);
    });

    try {
      // Generate file hash (simplified)
      const arrayBuffer = await file.arrayBuffer();
      const hashArray = Array.from(new Uint8Array(arrayBuffer.slice(0, 32)));
      const fileHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Call backend API
      const response = await analysisAPI.upload({
        fileName: file.name,
        fileSize: file.size,
        fileHash: fileHash,
        fileType: file.type || 'application/octet-stream'
      });

      // Complete analysis after animation
      setTimeout(async () => {
        // Fetch full analysis details
        const fullAnalysis = await analysisAPI.getAnalysis(response.analysisId);
        
        const analysisData = {
          ...fullAnalysis.analysis,
          fileName: file.name,
          fileSize: file.size,
          timestamp: new Date()
        };

        onComplete(analysisData);
      }, 2500);

    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Analysis failed. Please try again.');
      setTimeout(() => onNavigate('dashboard'), 2000);
    }

    return () => {
      clearInterval(progressInterval);
    };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(11, 11, 15, 0.95)' }}>
      <motion.div
        className="w-full max-w-3xl mx-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div 
          className="rounded-3xl p-8 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)'
          }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mr-4"
                style={{
                  backgroundColor: 'rgba(0, 255, 136, 0.1)',
                  border: '1px solid rgba(0, 255, 136, 0.2)'
                }}
              >
                <FileCode className="w-6 h-6" style={{ color: '#00FF88' }} />
              </div>
              <div>
                <h2 
                  className="text-2xl mb-1"
                  style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
                >
                  Analyzing File
                </h2>
                <p 
                  className="text-sm opacity-60"
                  style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
                >
                  {file.name}
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 rounded-xl hover:bg-white/5 transition-colors"
              style={{ color: '#fff' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Ring */}
          <div className="flex justify-center mb-8">
            <ProgressRing progress={progress} />
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <p className="text-sm opacity-60 mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                Progress
              </p>
              <p className="text-2xl" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#00FF88' }}>
                {progress}%
              </p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <p className="text-sm opacity-60 mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                File Size
              </p>
              <p className="text-2xl" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#00D1FF' }}>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <div className="text-center p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
              <p className="text-sm opacity-60 mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                Step
              </p>
              <p className="text-2xl" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                {currentStep}/{analysisSteps.length}
              </p>
            </div>
          </div>

          {/* Terminal Log */}
          <TerminalLog logs={logs} />
        </div>
      </motion.div>
    </div>
  );
}
