import { motion } from 'motion/react';
import { ArrowLeft, Brain, Zap, Target, TrendingUp, CheckCircle, Clock } from 'lucide-react';
import { Screen } from '../App';
import { RadialProgress } from './RadialProgress';

interface ModelsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const models = [
  {
    name: 'DeepMalware-v3',
    type: 'Neural Network',
    accuracy: 94.2,
    speed: 'Fast',
    status: 'Active',
    color: '#00FF88',
    description: 'Primary deep learning model for behavior analysis',
    stats: {
      trainingSamples: '2.4M',
      lastUpdated: '2025-06-01',
      detectionRate: '96.8%'
    }
  },
  {
    name: 'SignatureMatch-Pro',
    type: 'Pattern Matching',
    accuracy: 88.5,
    speed: 'Very Fast',
    status: 'Active',
    color: '#00D1FF',
    description: 'Signature-based detection with ML enhancement',
    stats: {
      trainingSamples: '5.2M',
      lastUpdated: '2025-05-28',
      detectionRate: '91.3%'
    }
  },
  {
    name: 'BehaviorClassifier',
    type: 'Random Forest',
    accuracy: 91.7,
    speed: 'Fast',
    status: 'Active',
    color: '#FFA500',
    description: 'API call pattern classification model',
    stats: {
      trainingSamples: '1.8M',
      lastUpdated: '2025-06-05',
      detectionRate: '93.5%'
    }
  },
  {
    name: 'Legacy-Scanner',
    type: 'Heuristic',
    accuracy: 76.3,
    speed: 'Very Fast',
    status: 'Deprecated',
    color: '#FF1E56',
    description: 'Traditional heuristic-based scanner',
    stats: {
      trainingSamples: 'N/A',
      lastUpdated: '2024-12-15',
      detectionRate: '78.1%'
    }
  }
];

export function ModelsScreen({ onNavigate }: ModelsScreenProps) {
  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#0B0B0F' }}>
      <div className="max-w-7xl mx-auto">
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
                ML Models
              </h1>
              <p 
                className="opacity-60"
                style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
              >
                Manage and monitor machine learning detection models
              </p>
            </div>
          </div>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Brain className="w-8 h-8 mb-3" style={{ color: '#00FF88' }} />
            <p className="text-2xl mb-1" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
              4
            </p>
            <p className="text-sm opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
              Total Models
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CheckCircle className="w-8 h-8 mb-3" style={{ color: '#00D1FF' }} />
            <p className="text-2xl mb-1" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
              3
            </p>
            <p className="text-sm opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
              Active Models
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Target className="w-8 h-8 mb-3" style={{ color: '#FFA500' }} />
            <p className="text-2xl mb-1" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
              93.2%
            </p>
            <p className="text-sm opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
              Avg. Accuracy
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl p-6 border"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(12px)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Zap className="w-8 h-8 mb-3" style={{ color: '#00FF88' }} />
            <p className="text-2xl mb-1" style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}>
              1.8s
            </p>
            <p className="text-sm opacity-60" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
              Avg. Speed
            </p>
          </motion.div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {models.map((model, index) => (
            <motion.div
              key={index}
              className="rounded-3xl p-8 border"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderColor: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(12px)'
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{
                y: -4,
                borderColor: `${model.color}40`,
                boxShadow: `0 8px 30px ${model.color}20`
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Brain className="w-6 h-6" style={{ color: model.color }} />
                    <h3 
                      className="text-2xl"
                      style={{ fontFamily: 'SF Pro Display, system-ui, sans-serif', color: '#fff' }}
                    >
                      {model.name}
                    </h3>
                  </div>
                  <p 
                    className="text-sm opacity-60 mb-4"
                    style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}
                  >
                    {model.description}
                  </p>
                  <div className="flex items-center space-x-4">
                    <span 
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{
                        backgroundColor: `${model.color}20`,
                        color: model.color,
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      {model.type}
                    </span>
                    <span 
                      className="px-3 py-1 rounded-lg text-sm"
                      style={{
                        backgroundColor: model.status === 'Active' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 30, 86, 0.2)',
                        color: model.status === 'Active' ? '#00FF88' : '#FF1E56',
                        fontFamily: 'JetBrains Mono, monospace'
                      }}
                    >
                      {model.status}
                    </span>
                  </div>
                </div>

                <RadialProgress value={model.accuracy} size={100} color={model.color} />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                <div>
                  <p className="text-xs opacity-60 mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                    Samples
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                    {model.stats.trainingSamples}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-60 mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                    Detection
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                    {model.stats.detectionRate}
                  </p>
                </div>
                <div>
                  <p className="text-xs opacity-60 mb-1" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                    Speed
                  </p>
                  <p className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                    {model.speed}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center text-xs opacity-40" style={{ fontFamily: 'JetBrains Mono, monospace', color: '#fff' }}>
                <Clock className="w-3 h-3 mr-1" />
                Last updated: {model.stats.lastUpdated}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
