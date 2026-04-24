import { useState, useEffect } from 'react';
import { TrendingDown, AlertCircle, CheckCircle, X, Plus } from 'lucide-react';
import { Patient } from '../utils/csvParser';
import { fetchDynamicCounterfactual, APIResponse } from '../utils/api';

// Paste your 550 drugs from the notebook here!
const ALL_DRUGS = [
  "ASPIRIN", "LISINOPRIL", "ATORVASTATIN", "METFORMIN", "AMLODIPINE", // ... add the rest
];

interface DrugSwapPanelProps {
  patient: Patient;
}

export function DrugSwapPanel({ patient }: DrugSwapPanelProps) {
  // State for the drugs currently being simulated
  const [activeDrugs, setActiveDrugs] = useState<string[]>([]);
  const [selectedDropdownDrug, setSelectedDropdownDrug] = useState<string>('');
  
  // State for the API
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<APIResponse | null>(null);

  // Reset the panel whenever a new patient is clicked
  useEffect(() => {
    setActiveDrugs(patient.mainPrescriptions || []);
    setSimulationResult(null);
  }, [patient]);

  // Handle adding a drug from the dropdown
  const handleAddDrug = () => {
    if (selectedDropdownDrug && !activeDrugs.includes(selectedDropdownDrug)) {
      setActiveDrugs([...activeDrugs, selectedDropdownDrug]);
      setSelectedDropdownDrug('');
    }
  };

  // Handle removing a drug
  const handleRemoveDrug = (drugToRemove: string) => {
    setActiveDrugs(activeDrugs.filter(d => d !== drugToRemove));
  };

  // Trigger the API Call
  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const result = await fetchDynamicCounterfactual(patient, activeDrugs);
      setSimulationResult(result);
    } catch (error) {
      console.error("Simulation failed:", error);
      alert("Failed to run simulation. Check console.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="bg-teal-50 rounded-lg border border-teal-200 p-6 h-fit flex flex-col gap-6">
      <div>
        <h3 className="text-teal-900 mb-2">Dynamic Simulator</h3>
        <p className="text-sm text-teal-700">
          Modify the patient's prescription list and run a counterfactual simulation.
        </p>
      </div>

      {/* Drug Selection UI */}
      <div className="bg-white p-4 rounded-lg border border-slate-200">
        <div className="flex gap-2 mb-4">
          <select 
            className="flex-1 p-2 border rounded text-sm"
            value={selectedDropdownDrug}
            onChange={(e) => setSelectedDropdownDrug(e.target.value)}
          >
            <option value="">Select a drug to add...</option>
            {ALL_DRUGS.map(drug => (
              <option key={drug} value={drug} disabled={activeDrugs.includes(drug)}>
                {drug}
              </option>
            ))}
          </select>
          <button 
            onClick={handleAddDrug}
            disabled={!selectedDropdownDrug}
            className="bg-slate-800 text-white p-2 rounded disabled:opacity-50"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* Current Drug Badges */}
        <div className="flex flex-wrap gap-2">
          {activeDrugs.map(drug => (
            <span key={drug} className="flex items-center gap-1 bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs border border-slate-200">
              {drug}
              <button onClick={() => handleRemoveDrug(drug)} className="hover:text-red-500">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
          {activeDrugs.length === 0 && (
            <span className="text-sm text-slate-400">No active medications.</span>
          )}
        </div>
      </div>

      {/* Simulate Button */}
      <button 
        onClick={handleSimulate}
        disabled={isSimulating}
        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
      >
        {isSimulating ? 'Running XGBoost Model...' : 'Calculate New Risk'}
      </button>

      {/* Results UI */}
      {simulationResult && (
        <div className={`p-5 rounded-lg border ${simulationResult.new_class === 'CRITICAL' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <h4 className="text-sm font-semibold mb-3">Simulation Results</h4>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-600">Original Risk:</span>
            <span className="font-medium">{patient.riskScore}%</span>
          </div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-slate-600">New Risk:</span>
            <span className="font-bold text-lg">{(simulationResult.new_risk_probability * 100).toFixed(2)}%</span>
          </div>
          
          <div className="flex items-center gap-2 pt-3 border-t border-slate-200/50">
             {simulationResult.new_class === 'CRITICAL' ? (
                <AlertCircle className="w-5 h-5 text-red-600" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              )}
             <span className={`font-semibold ${simulationResult.new_class === 'CRITICAL' ? 'text-red-700' : 'text-emerald-700'}`}>
               Predicted Class: {simulationResult.new_class}
             </span>
          </div>
        </div>
      )}
    </div>
  );
}
