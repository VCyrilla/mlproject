import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'File I/O', calls: 45, color: '#00FF88' },
  { name: 'Registry', calls: 32, color: '#00D1FF' },
  { name: 'Network', calls: 28, color: '#FF1E56' },
  { name: 'Process', calls: 15, color: '#FFA500' },
  { name: 'Memory', calls: 38, color: '#00FF88' },
  { name: 'Crypto', calls: 12, color: '#FF1E56' }
];

export function BehaviorGraph() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
        <XAxis 
          dataKey="name" 
          stroke="rgba(255, 255, 255, 0.5)"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}
        />
        <YAxis 
          stroke="rgba(255, 255, 255, 0.5)"
          style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(11, 11, 15, 0.95)',
            border: '1px solid rgba(0, 255, 136, 0.2)',
            borderRadius: '12px',
            backdropFilter: 'blur(12px)',
            fontFamily: 'JetBrains Mono, monospace'
          }}
          labelStyle={{ color: '#00FF88' }}
          itemStyle={{ color: '#fff' }}
        />
        <Bar 
          dataKey="calls" 
          fill="url(#colorGradient)" 
          radius={[8, 8, 0, 0]}
        />
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00FF88" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#00D1FF" stopOpacity={0.8} />
          </linearGradient>
        </defs>
      </BarChart>
    </ResponsiveContainer>
  );
}
