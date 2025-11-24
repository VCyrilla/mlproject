import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Terminal as TerminalIcon, Copy, Check } from 'lucide-react';
import { Screen } from '../App';
import { Button } from './ui/button';
import { cliAPI } from '../utils/api';

interface CLITerminalProps {
  onNavigate: (screen: Screen) => void;
}

interface CommandEntry {
  command: string;
  output: string;
  timestamp: string;
}

export function CLITerminal({ onNavigate }: CLITerminalProps) {
  const [commandHistory, setCommandHistory] = useState<CommandEntry[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus input
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Auto-scroll to bottom
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [commandHistory]);

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;

    setIsExecuting(true);
    try {
      const response = await cliAPI.execute(cmd.trim());
      
      if (response.output === 'CLEAR_TERMINAL') {
        setCommandHistory([]);
      } else {
        setCommandHistory([
          ...commandHistory,
          {
            command: cmd,
            output: response.output,
            timestamp: response.timestamp
          }
        ]);
      }
    } catch (error) {
      setCommandHistory([
        ...commandHistory,
        {
          command: cmd,
          output: `Error: ${error}`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsExecuting(false);
      setCurrentCommand('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isExecuting) {
      executeCommand(currentCommand);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#0B0B0F' }}>
      <div className="max-w-5xl mx-auto">
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
                CLI Terminal
              </h1>
              <p 
                className="opacity-60"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
              >
                Windows Cybersecurity Command-Line Interface
              </p>
            </div>
          </div>
        </motion.div>

        {/* Terminal Window */}
        <motion.div
          className="rounded-3xl overflow-hidden border"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderColor: 'rgba(0, 255, 136, 0.2)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0, 255, 136, 0.1)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Terminal Header */}
          <div 
            className="flex items-center justify-between px-6 py-4 border-b"
            style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <div className="flex items-center space-x-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF5F56' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FFBD2E' }} />
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#27C93F' }} />
              </div>
              <TerminalIcon className="w-4 h-4 ml-4" style={{ color: '#00FF88' }} />
              <span 
                className="text-sm"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}
              >
                cmd.exe - Windows Terminal
              </span>
            </div>

            <button
              onClick={() => handleCopy(commandHistory.map(h => `${h.command}\n${h.output}`).join('\n\n'))}
              className="flex items-center space-x-2 px-3 py-1 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: '#00D1FF' }}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {copied ? 'Copied!' : 'Copy All'}
              </span>
            </button>
          </div>

          {/* Terminal Content */}
          <div 
            className="p-6" 
            ref={outputRef} 
            style={{ maxHeight: '600px', overflowY: 'auto' }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Welcome Message */}
            {commandHistory.length === 0 && (
              <div className="mb-4" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00FF88' }}>
                <p>Microsoft Windows [Version 11.0.22631]</p>
                <p className="opacity-70">(c) NEXUS Security Platform. All rights reserved.</p>
                <p className="mt-2 opacity-70">Type 'help' for available commands.</p>
                <p className="mt-1 opacity-50">Supports common Windows cybersecurity commands.</p>
              </div>
            )}

            {/* Command History */}
            {commandHistory.map((entry, index) => (
              <div key={index} className="mb-4">
                {/* Command Prompt */}
                <div className="flex items-center mb-1">
                  <span style={{ color: '#00D1FF', fontFamily: 'JetBrains Mono, monospace' }}>
                    C:\Users\security_analyst&gt;
                  </span>
                  <span className="ml-2" style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
                    {entry.command}
                  </span>
                </div>

                {/* Command Output */}
                <pre 
                  className="text-sm whitespace-pre-wrap"
                  style={{ 
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#00FF88'
                  }}
                >
                  {entry.output}
                </pre>
              </div>
            ))}

            {/* Current Command Input */}
            <div className="flex items-center">
              <span style={{ color: '#00D1FF', fontFamily: 'JetBrains Mono, monospace' }}>
                C:\Users\security_analyst&gt;
              </span>
              <input
                ref={inputRef}
                type="text"
                value={currentCommand}
                onChange={(e) => setCurrentCommand(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isExecuting}
                className="ml-2 flex-1 bg-transparent border-none outline-none"
                style={{ 
                  fontFamily: 'JetBrains Mono, monospace',
                  color: '#fff'
                }}
                autoFocus
              />
              {isExecuting && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ color: '#00D1FF', marginLeft: '8px' }}
                >
                  ...
                </motion.span>
              )}
              <motion.div
                className="inline-block w-2 h-4 ml-1"
                style={{ backgroundColor: '#00FF88' }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={() => setCommandHistory([])}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
          >
            Clear Terminal
          </Button>

          <Button
            onClick={() => executeCommand('help')}
            variant="outline"
            className="border-white/10 text-white hover:bg-white/5"
          >
            Show Help
          </Button>
        </motion.div>

        {/* CLI Documentation */}
        <motion.div
          className="mt-8 rounded-3xl p-8 border"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(12px)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 
            className="text-2xl mb-4"
            style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
          >
            Available Windows Cybersecurity Commands
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CommandDoc 
              command="netstat [-an]" 
              description="Display active network connections and listening ports"
            />
            <CommandDoc 
              command="tasklist" 
              description="Display list of currently running processes"
            />
            <CommandDoc 
              command="ipconfig [/all]" 
              description="Display network configuration information"
            />
            <CommandDoc 
              command="whoami" 
              description="Display current user identity"
            />
            <CommandDoc 
              command="systeminfo" 
              description="Display detailed system configuration"
            />
            <CommandDoc 
              command="nslookup [domain]" 
              description="Query DNS records for a domain"
            />
            <CommandDoc 
              command="dir / ls" 
              description="List directory contents"
            />
            <CommandDoc 
              command="clear" 
              description="Clear the terminal screen"
            />
            <CommandDoc 
              command="help" 
              description="Display all available commands"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function CommandDoc({ command, description }: { command: string; description: string }) {
  return (
    <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
      <code style={{ color: '#00FF88', fontFamily: 'JetBrains Mono, monospace' }}>
        {command}
      </code>
      <p className="text-sm mt-2 opacity-70" style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
        {description}
      </p>
    </div>
  );
}