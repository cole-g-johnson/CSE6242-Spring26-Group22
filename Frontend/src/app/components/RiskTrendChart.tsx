import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export function RiskTrendChart() {
  const data = [
    { date: 'Jan', risk: 45 },
    { date: 'Feb', risk: 52 },
    { date: 'Mar', risk: 58 },
    { date: 'Apr', risk: 67 }
  ];

  return (
    <div className="bg-white rounded-lg p-5 border border-slate-200">
      <div className="text-slate-700 mb-4">Risk Trend Over Time</div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
          <YAxis stroke="#64748b" style={{ fontSize: '12px' }} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            formatter={(value) => [`${value}%`, 'Risk Score']}
          />
          <Area type="monotone" dataKey="risk" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorRisk)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
