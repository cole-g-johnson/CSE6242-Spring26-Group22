import { useState } from 'react';
import { ArrowRight, TrendingDown, Activity } from 'lucide-react';
import { Patient } from '../../utils/csvParser';
import { fetchSwapRecommendations, SwapRecommendation } from '../../utils/api';

interface DrugRecommenderProps {
  patient: Patient;
}

export function DrugRecommender({ patient }: DrugRecommenderProps) {
  const [selectedDrug, setSelectedDrug] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<SwapRecommendation[]>([]);

  // We only want to let them swap drugs they are currently taking!
  const activeDrugs = patient.mainPrescriptions || [];

  const handleFindSwaps = async () => {
    if (!selectedDrug) return;
    
    setIsLoading(true);
    try {
      const result = await fetchSwapRecommendations(patient, activeDrugs, selectedDrug);
      setRecommendations(result.recommendations);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (activeDrugs.length === 0) return null; // Don't show if they take no drugs

  return (
    <div className="bg-indigo-50 rounded-lg border border-indigo-200 p-6 h-fit mt-6 flex flex-col gap-4">
      <div>
        <h3 className="text-indigo-900 mb-1 flex items-center gap-2">
          <Activity className="w-5 h-5" /> AI Recommender
        </h3>
        <p className="text-sm text-indigo-700">
          Select an active medication to replace, and the model will find the top 5 safest alternatives.
        </p>
      </div>

      <div className="flex gap-2">
        <select 
          className="flex-1 p-2 border rounded text-sm bg-white"
          value={selectedDrug}
          onChange={(e) => setSelectedDrug(e.target.value)}
        >
          <option value="">Select drug to replace...</option>
          {activeDrugs.map(drug => (
            <option key={drug} value={drug}>{drug}</option>
          ))}
        </select>
        
        <button 
          onClick={handleFindSwaps}
          disabled={!selectedDrug || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Scanning...' : 'Find Swaps'}
        </button>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-2 bg-white rounded border border-indigo-100 overflow-hidden">
          <div className="bg-indigo-100/50 px-4 py-2 text-xs font-semibold text-indigo-800 border-b border-indigo-100">
            Top 5 Safest Alternatives
          </div>
          <div className="divide-y divide-slate-100">
            {recommendations.map((rec, index) => (
              <div key={rec.drug} className="p-3 flex items-center justify-between hover:bg-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs font-mono">#{index + 1}</span>
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <span className="line-through text-slate-400">{selectedDrug}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                    <span className="text-indigo-700">{rec.drug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-medium">
                  <TrendingDown className="w-3 h-3" />
                  {(rec.new_risk * 100).toFixed(2)}% Risk
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
