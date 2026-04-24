import { ArrowRight, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';

interface Patient {
  id: string;
  riskScore: number;
  riskCategory: 'Severe' | 'Non-Severe';
}

interface Counterfactual {
  patientId: string;
  originalDrug: string;
  alternativeDrug: string;
  originalRisk: number;
  newRisk: number;
  delta: number;
  oldClass: string;
  newClass: string;
  newStatus: 'Severe' | 'Non-Severe';
}

interface DrugSwapPanelProps {
  patient: Patient;
  counterfactuals: Counterfactual[];
}

export function DrugSwapPanel({ patient, counterfactuals }: DrugSwapPanelProps) {
  const sortedCounterfactuals = [...counterfactuals].sort((a, b) => a.delta - b.delta);

  return (
    <div className="bg-teal-50 rounded-lg border border-teal-200 p-6 h-fit">
      <div className="mb-6">
        <h3 className="text-teal-900 mb-2">Drug Swap Options</h3>
        <p className="text-sm text-teal-700">
          Explore alternative medications to reduce adverse event risk
        </p>
      </div>

      {counterfactuals.length === 0 ? (
        <div className="bg-white rounded-lg p-6 text-center border border-slate-200">
          <p className="text-slate-600">No drug swap options available for this patient</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCounterfactuals.map((cf, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">Replace</div>
                  <div className="text-slate-900">{cf.originalDrug}</div>
                  <div className="text-xs text-slate-500 mt-1">{cf.oldClass}</div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-400 mx-3 mt-4" />
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-1">With</div>
                  <div className="text-teal-700">{cf.alternativeDrug}</div>
                  <div className="text-xs text-slate-500 mt-1">{cf.newClass}</div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-600">Risk Change</span>
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className={`flex items-center gap-1 ${
                    cf.delta < 0 ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    <span className="text-lg">
                      {cf.delta > 0 ? '+' : ''}{cf.delta}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-slate-50 rounded p-2">
                    <div className="text-xs text-slate-500">Current</div>
                    <div className="text-slate-900">{cf.originalRisk}%</div>
                  </div>
                  <div className="bg-teal-50 rounded p-2">
                    <div className="text-xs text-teal-700">Predicted</div>
                    <div className="text-teal-900">{cf.newRisk}%</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {cf.newStatus === 'Severe' ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      cf.newStatus === 'Severe'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {cf.newStatus}
                    </span>
                  </div>

                  <button
                    className="text-xs bg-teal-600 text-white px-3 py-1.5 rounded hover:bg-teal-700 transition-colors"
                  >
                    Simulate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
        <div className="text-xs text-slate-600">
          <strong>Note:</strong> These predictions are based on the binary risk model using patient demographics and current medication profile. Dosage information is not included in the model.
        </div>
      </div>
    </div>
  );
}
