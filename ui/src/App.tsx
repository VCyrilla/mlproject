import { useState } from 'react';
import { Toaster } from './components/ui/sonner';
import { LoginScreen } from './components/LoginScreen';
import { SignUpStep1 } from './components/SignUpStep1';
import { SignUpStep2 } from './components/SignUpStep2';
import { DashboardHome } from './components/DashboardHome';
import { FileAnalysis } from './components/FileAnalysis';
import { AnalysisResults } from './components/AnalysisResults';
import { HistoryScreen } from './components/HistoryScreen';
import { ModelsScreen } from './components/ModelsScreen';
import { SupportCenter } from './components/SupportCenter';
import { SettingsPage } from './components/SettingsPage';
import { CLITerminal } from './components/CLITerminal';
import { FilesByCategory } from './components/FilesByCategory';

export type Screen = 'login' | 'signup1' | 'signup2' | 'dashboard' | 'analysis' | 'results' | 'history' | 'models' | 'support' | 'settings' | 'cli' | 'files-mitigated' | 'files-quarantined' | 'files-blocked';

export interface AnalysisData {
  fileName: string;
  fileSize: number;
  threatLevel: number;
  status: string;
  mitreTactics: string[];
  timestamp: Date;
}

export interface SignUpData {
  fullName: string;
  email: string;
  organization: string;
  role: string;
  password: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | any>(null);
  const [signUpData, setSignUpData] = useState<SignUpData | null>(null);
  const [navigationData, setNavigationData] = useState<any>(null);

  const handleLogin = (demoMode: boolean) => {
    setCurrentScreen('dashboard');
  };

  const handleSignUpStep1 = (data: SignUpData) => {
    setSignUpData(data);
    setCurrentScreen('signup2');
  };

  const handleSignUpComplete = () => {
    setCurrentScreen('dashboard');
  };

  const handleFileUpload = (file: File) => {
    setCurrentFile(file);
    setCurrentScreen('analysis');
  };

  const handleAnalysisComplete = (data: AnalysisData) => {
    setAnalysisData(data);
    setCurrentScreen('results');
  };

  const handleNavigate = (screen: Screen, data?: any) => {
    setCurrentScreen(screen);
    if (data) {
      setNavigationData(data);
      if (data.analysisData) {
        setAnalysisData(data.analysisData);
      }
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0B0B0F' }}>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            border: '1px solid rgba(0, 255, 136, 0.3)',
            color: '#fff',
            backdropFilter: 'blur(12px)'
          }
        }}
      />
      
      {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} onNavigate={handleNavigate} />}
      {currentScreen === 'signup1' && <SignUpStep1 onNext={handleSignUpStep1} onNavigate={handleNavigate} />}
      {currentScreen === 'signup2' && signUpData && (
        <SignUpStep2 email={signUpData.email} onComplete={handleSignUpComplete} onNavigate={handleNavigate} signUpData={signUpData} />
      )}
      {currentScreen === 'dashboard' && (
        <DashboardHome onFileUpload={handleFileUpload} onNavigate={handleNavigate} />
      )}
      {currentScreen === 'analysis' && currentFile && (
        <FileAnalysis file={currentFile} onComplete={handleAnalysisComplete} onNavigate={handleNavigate} />
      )}
      {currentScreen === 'results' && analysisData && (
        <AnalysisResults data={analysisData} onNavigate={handleNavigate} />
      )}
      {currentScreen === 'history' && <HistoryScreen onNavigate={handleNavigate} />}
      {currentScreen === 'models' && <ModelsScreen onNavigate={handleNavigate} />}
      {currentScreen === 'support' && <SupportCenter onNavigate={handleNavigate} />}
      {currentScreen === 'settings' && <SettingsPage onNavigate={handleNavigate} />}
      {currentScreen === 'cli' && <CLITerminal onNavigate={handleNavigate} />}
      {currentScreen === 'files-mitigated' && <FilesByCategory category="mitigated" onNavigate={handleNavigate} />}
      {currentScreen === 'files-quarantined' && <FilesByCategory category="quarantined" onNavigate={handleNavigate} />}
      {currentScreen === 'files-blocked' && <FilesByCategory category="blocked" onNavigate={handleNavigate} />}
    </div>
  );
}
