import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Palette, Lock, Key, Settings as SettingsIcon, Save, Trash2 } from 'lucide-react';
import { Screen } from '../App';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { toast } from 'sonner';

interface SettingsPageProps {
  onNavigate: (screen: Screen) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [theme, setTheme] = useState('dark');
  const [fontSize, setFontSize] = useState([14]);
  const [accentColor, setAccentColor] = useState('mint');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: 'Production API', key: 'nxs_sk_a3b5c7d9e1f3g5h7', created: '2025-05-15' },
    { id: 2, name: 'Development API', key: 'nxs_sk_9k7m5n3p1q2r4s6t', created: '2025-06-01' }
  ]);

  const handleSaveChanges = () => {
    toast.success('Settings saved successfully!', {
      description: 'Your preferences have been updated.',
    });
  };

  const handleGenerateAPIKey = () => {
    const newKey = {
      id: apiKeys.length + 1,
      name: `API Key ${apiKeys.length + 1}`,
      key: `nxs_sk_${Math.random().toString(36).substring(2, 18)}`,
      created: new Date().toISOString().split('T')[0]
    };
    setApiKeys([...apiKeys, newKey]);
    toast.success('New API key generated!');
  };

  const handleRevokeKey = (id: number) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
    toast.info('API key revoked');
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

          <h1 
            className="text-4xl mb-2"
            style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
          >
            Settings
          </h1>
          <p 
            className="opacity-60"
            style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
          >
            Manage your account and preferences
          </p>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="general" className="w-full">
            <TabsList 
              className="w-full grid grid-cols-5 mb-8 p-1 rounded-2xl"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <TabsTrigger value="general" className="data-[state=active]:bg-white/10">
                <SettingsIcon className="w-4 h-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger value="appearance" className="data-[state=active]:bg-white/10">
                <Palette className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="account" className="data-[state=active]:bg-white/10">
                <User className="w-4 h-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-white/10">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="api" className="data-[state=active]:bg-white/10">
                <Key className="w-4 h-4 mr-2" />
                API
              </TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general">
              <div 
                className="rounded-3xl p-8 border"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <h3 className="text-2xl mb-6" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                  General Settings
                </h3>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label style={{ color: '#fff' }}>Email Address</Label>
                      <div className="flex gap-2">
                        <Input
                          type="email"
                          value="vanessa@strathmore.ac.ke"
                          className="bg-white/5 border-white/10 text-white"
                          readOnly
                        />
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                          Change
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label style={{ color: '#fff' }}>Organization</Label>
                      <Input
                        type="text"
                        value="Strathmore University"
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#fff' }}>Full Name</Label>
                    <Input
                      type="text"
                      value="Vanessa Cyrilla"
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Appearance Tab */}
            <TabsContent value="appearance">
              <div 
                className="rounded-3xl p-8 border"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <h3 className="text-2xl mb-6" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                  Appearance Settings
                </h3>

                <div className="space-y-8">
                  {/* Theme */}
                  <div>
                    <Label className="mb-3 block" style={{ color: '#fff' }}>Theme</Label>
                    <div className="flex gap-4">
                      {['light', 'dark', 'system'].map((t) => (
                        <button
                          key={t}
                          onClick={() => setTheme(t)}
                          className="flex-1 p-4 rounded-xl border-2 transition-all"
                          style={{
                            backgroundColor: theme === t ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                            borderColor: theme === t ? '#00FF88' : 'rgba(255, 255, 255, 0.1)',
                            color: '#fff'
                          }}
                        >
                          {t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font Size */}
                  <div>
                    <div className="flex justify-between mb-3">
                      <Label style={{ color: '#fff' }}>Font Size</Label>
                      <span style={{ color: '#00FF88', fontFamily: 'JetBrains Mono, monospace' }}>
                        {fontSize[0]}px
                      </span>
                    </div>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      min={12}
                      max={18}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between mt-2 text-xs" style={{ color: '#fff', opacity: 0.5 }}>
                      <span>Small</span>
                      <span>Medium</span>
                      <span>Large</span>
                    </div>
                  </div>

                  {/* Accent Color */}
                  <div>
                    <Label className="mb-3 block" style={{ color: '#fff' }}>Accent Color</Label>
                    <div className="flex gap-4">
                      {[
                        { name: 'mint', color: '#00FF88' },
                        { name: 'cyan', color: '#00D1FF' },
                        { name: 'pink', color: '#FF1E56' }
                      ].map((accent) => (
                        <button
                          key={accent.name}
                          onClick={() => setAccentColor(accent.name)}
                          className="flex-1 p-4 rounded-xl border-2 transition-all"
                          style={{
                            backgroundColor: accentColor === accent.name ? `${accent.color}20` : 'rgba(255, 255, 255, 0.02)',
                            borderColor: accentColor === accent.name ? accent.color : 'rgba(255, 255, 255, 0.1)',
                            color: accent.color
                          }}
                        >
                          {accent.name.charAt(0).toUpperCase() + accent.name.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Account Tab */}
            <TabsContent value="account">
              <div 
                className="rounded-3xl p-8 border"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <h3 className="text-2xl mb-6" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                  Account Management
                </h3>

                <div className="space-y-6">
                  <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(0, 209, 255, 0.1)' }}>
                    <h4 className="mb-2" style={{ color: '#00D1FF', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                      Export Your Data
                    </h4>
                    <p className="text-sm mb-4 opacity-70" style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
                      Download all your analysis history and data
                    </p>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/5">
                      Export Data (JSON)
                    </Button>
                  </div>

                  <div className="p-6 rounded-xl border-2" style={{ backgroundColor: 'rgba(255, 30, 86, 0.05)', borderColor: 'rgba(255, 30, 86, 0.3)' }}>
                    <h4 className="mb-2" style={{ color: '#FF1E56', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                      Delete Account
                    </h4>
                    <p className="text-sm mb-4 opacity-70" style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button 
                      style={{ backgroundColor: '#FF1E56', color: '#fff' }}
                      className="hover:opacity-80"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div 
                className="rounded-3xl p-8 border"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <h3 className="text-2xl mb-6" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                  Security Settings
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-6 rounded-xl" style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
                    <div>
                      <h4 className="mb-1" style={{ color: '#fff', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                        Two-Factor Authentication
                      </h4>
                      <p className="text-sm opacity-60" style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                  </div>

                  <div className="space-y-2">
                    <Label style={{ color: '#fff' }}>Change Password</Label>
                    <Input
                      type="password"
                      placeholder="Current password"
                      className="bg-white/5 border-white/10 text-white mb-2"
                    />
                    <Input
                      type="password"
                      placeholder="New password"
                      className="bg-white/5 border-white/10 text-white mb-2"
                    />
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      className="bg-white/5 border-white/10 text-white"
                    />
                    <Button className="mt-4" variant="outline" style={{ borderColor: 'rgba(255, 255, 255, 0.1)', color: '#fff' }}>
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* API Tab */}
            <TabsContent value="api">
              <div 
                className="rounded-3xl p-8 border"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  borderColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
                    API Keys
                  </h3>
                  <Button
                    onClick={handleGenerateAPIKey}
                    style={{ background: 'linear-gradient(135deg, #00FF88 0%, #00D1FF 100%)', color: '#0B0B0F' }}
                  >
                    Generate New Key
                  </Button>
                </div>

                <div className="space-y-4">
                  {apiKeys.map((key) => (
                    <div
                      key={key.id}
                      className="p-4 rounded-xl border flex items-center justify-between"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderColor: 'rgba(255, 255, 255, 0.05)' }}
                    >
                      <div className="flex-1">
                        <p className="mb-1" style={{ color: '#fff', fontFamily: 'SF Pro Display, system-ui, sans-serif' }}>
                          {key.name}
                        </p>
                        <p className="text-sm mb-1" style={{ color: '#00FF88', fontFamily: 'JetBrains Mono, monospace' }}>
                          {key.key}
                        </p>
                        <p className="text-xs opacity-50" style={{ color: '#fff', fontFamily: 'JetBrains Mono, monospace' }}>
                          Created: {key.created}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleRevokeKey(key.id)}
                        variant="outline"
                        className="border-red-500/20 text-red-500 hover:bg-red-500/10"
                      >
                        Revoke
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Save Button (Sticky) */}
        <motion.div
          className="fixed bottom-8 right-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={handleSaveChanges}
            className="shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #00FF88 0%, #00D1FF 100%)',
              color: '#0B0B0F',
              padding: '12px 32px'
            }}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
