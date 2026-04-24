import { AlertTriangle, Heart, Droplet, Brain } from 'lucide-react';

interface RiskItemProps {
  icon: React.ReactNode;
  label: string;
  risk: number;
  color: string;
}

function RiskItem({ icon, label, risk, color }: RiskItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className="text-slate-700">{label}</div>
      </div>
      <div className="text-slate-900">{risk}%</div>
    </div>
  );
}

export function RiskBreakdown() {
  const risks = [
    { icon: <AlertTriangle className="w-5 h-5 text-red-600" />, label: 'Hospitalization Risk', risk: 67, color: 'bg-red-100' },
    { icon: <Droplet className="w-5 h-5 text-orange-600" />, label: 'Bleeding/Toxicity', risk: 52, color: 'bg-orange-100' },
    { icon: <Heart className="w-5 h-5 text-rose-600" />, label: 'Cardiovascular Event', risk: 43, color: 'bg-rose-100' },
    { icon: <Brain className="w-5 h-5 text-purple-600" />, label: 'Cognitive Impairment', risk: 28, color: 'bg-purple-100' }
  ];

  return (
    <div className="space-y-3">
      <div className="text-slate-700 mb-4">Predicted Adverse Events</div>
      {risks.map((risk, index) => (
        <RiskItem key={index} {...risk} />
      ))}
    </div>
  );
}
