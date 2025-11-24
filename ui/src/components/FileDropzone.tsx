import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileCode } from 'lucide-react';
import { ParticleEffect } from './ParticleEffect';

interface FileDropzoneProps {
  onFileUpload: (file: File) => void;
}

export function FileDropzone({ onFileUpload }: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setShowParticles(true);
      setTimeout(() => {
        onFileUpload(files[0]);
      }, 800);
    }
  }, [onFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setShowParticles(true);
      setTimeout(() => {
        onFileUpload(files[0]);
      }, 800);
    }
  }, [onFileUpload]);

  return (
    <div className="relative">
      <motion.div
        className="relative rounded-3xl p-12 border-2 border-dashed cursor-pointer overflow-hidden"
        style={{
          backgroundColor: isDragging ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.03)',
          borderColor: isDragging ? '#00FF88' : 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(12px)'
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {/* Ripple Effect on Drag */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="absolute inset-0 rounded-3xl"
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                background: 'radial-gradient(circle, rgba(0, 255, 136, 0.4) 0%, transparent 70%)'
              }}
            />
          )}
        </AnimatePresence>

        {/* Particle Effect */}
        <AnimatePresence>
          {showParticles && <ParticleEffect onComplete={() => setShowParticles(false)} />}
        </AnimatePresence>

        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <motion.div
            animate={isDragging ? { 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
          >
            <Upload 
              className="w-16 h-16 mb-4 mx-auto" 
              style={{ color: isDragging ? '#00FF88' : '#00D1FF' }}
            />
          </motion.div>

          <h3 
            className="text-2xl mb-2"
            style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
          >
            Drop PE File to Analyze
          </h3>
          
          <p 
            className="mb-6 opacity-60"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
          >
            or click to browse • .exe, .dll, .sys supported
          </p>

          <label className="cursor-pointer">
            <input
              type="file"
              className="hidden"
              accept=".exe,.dll,.sys"
              onChange={handleFileSelect}
            />
            <motion.div
              className="px-6 py-3 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #00FF88 0%, #00D1FF 100%)',
                color: '#0B0B0F',
                fontFamily: 'JetBrains Mono, monospace'
              }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)' }}
              whileTap={{ scale: 0.95 }}
            >
              <FileCode className="inline-block w-4 h-4 mr-2" />
              Select File
            </motion.div>
          </label>
        </div>

        {/* Animated Border Glow */}
        {isDragging && (
          <motion.div
            className="absolute inset-0 rounded-3xl"
            style={{
              boxShadow: '0 0 40px rgba(0, 255, 136, 0.5)',
              pointerEvents: 'none'
            }}
            animate={{
              boxShadow: [
                '0 0 40px rgba(0, 255, 136, 0.5)',
                '0 0 60px rgba(0, 255, 136, 0.8)',
                '0 0 40px rgba(0, 255, 136, 0.5)'
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.div>
    </div>
  );
}
