interface RiskGaugeProps {
  score: number;
  label?: string;
}

export function RiskGauge({ score, label = "Current ADE Risk Score" }: RiskGaugeProps) {
  const getColor = (score: number) => {
    if (score < 30) return { bg: 'bg-green-100', stroke: 'stroke-green-500', text: 'text-green-700' };
    if (score < 60) return { bg: 'bg-amber-100', stroke: 'stroke-amber-500', text: 'text-amber-700' };
    return { bg: 'bg-red-100', stroke: 'stroke-red-500', text: 'text-red-700' };
  };

  const colors = getColor(score);
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="text-slate-700 mb-4">{label}</div>
      <div className="relative w-52 h-52">
        <svg className="transform -rotate-90 w-full h-full">
          <circle
            cx="104"
            cy="104"
            r="90"
            className="stroke-slate-200"
            strokeWidth="20"
            fill="none"
          />
          <circle
            cx="104"
            cy="104"
            r="90"
            className={colors.stroke}
            strokeWidth="20"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-5xl ${colors.text}`}>{score}%</div>
          <div className="text-sm text-slate-500 mt-1">Risk Level</div>
        </div>
      </div>
    </div>
  );
}
