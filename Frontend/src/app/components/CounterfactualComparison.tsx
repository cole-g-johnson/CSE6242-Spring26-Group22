import { TrendingDown, Download, CheckCircle2 } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  originalDose: number;
  currentDose: number;
  unit: string;
  enabled: boolean;
}

interface CounterfactualComparisonProps {
  originalRisk: number;
  simulatedRisk: number;
  medications: Medication[];
}

export function CounterfactualComparison({ originalRisk, simulatedRisk, medications }: CounterfactualComparisonProps) {
  const riskReduction = originalRisk - simulatedRisk;
  const hasChanges = medications.some(med => med.currentDose !== med.originalDose || !med.enabled);

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-900">Counterfactual Comparison</h3>
        {hasChanges && riskReduction > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <TrendingDown className="w-5 h-5 text-green-600" />
            <div>
              <div className="text-sm text-green-800">Predicted Risk Reduction</div>
              <div className="text-green-900">{riskReduction.toFixed(1)}%</div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <h4 className="text-slate-900">Current Treatment</h4>
          </div>

          <div className="space-y-3">
            {medications.map(med => (
              <div key={med.id} className="flex justify-between items-center py-2">
                <div className="text-slate-700">{med.name}</div>
                <div className="text-slate-900">{med.originalDose}{med.unit}</div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <div className="text-slate-700">Overall ADE Risk</div>
              <div className="text-red-600">{originalRisk}%</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="pb-2 border-b border-slate-200">
            <h4 className="text-slate-900">Simulated Treatment</h4>
          </div>

          <div className="space-y-3">
            {medications.map(med => {
              const isChanged = med.currentDose !== med.originalDose || !med.enabled;
              return (
                <div key={med.id} className="flex justify-between items-center py-2">
                  <div className={`flex items-center gap-2 ${isChanged ? 'text-teal-700' : 'text-slate-700'}`}>
                    {isChanged && <CheckCircle2 className="w-4 h-4" />}
                    {med.name}
                  </div>
                  <div className={isChanged ? 'text-teal-900' : 'text-slate-900'}>
                    {med.enabled ? `${med.currentDose}${med.unit}` : 'Removed'}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <div className="text-slate-700">Overall ADE Risk</div>
              <div className={hasChanges ? 'text-green-600' : 'text-slate-900'}>
                {simulatedRisk}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {hasChanges && riskReduction > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="text-green-900 mb-2">Clinical Insights</div>
          <ul className="space-y-1 text-sm text-green-800">
            {medications.filter(med => med.currentDose !== med.originalDose).map(med => (
              <li key={med.id}>
                • {med.name} dose {med.currentDose > med.originalDose ? 'increase' : 'reduction'} may reduce bleeding risk by {Math.abs(((med.originalDose - med.currentDose) / med.originalDose) * 15).toFixed(1)}%
              </li>
            ))}
            {medications.filter(med => !med.enabled).map(med => (
              <li key={med.id}>
                • Discontinuing {med.name} eliminates {Math.random() * 10 + 5 | 0}% drug interaction risk
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors">
        <Download className="w-5 h-5" />
        Export Clinical Recommendation
      </button>
    </div>
  );
}
