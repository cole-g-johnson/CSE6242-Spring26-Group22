import { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import * as Switch from '@radix-ui/react-switch';
import { Search, X, AlertTriangle } from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  originalDose: number;
  currentDose: number;
  unit: string;
  enabled: boolean;
  maxDose: number;
  minDose: number;
}

interface WhatIfSimulatorProps {
  onSimulationChange: (medications: Medication[]) => void;
}

export function WhatIfSimulator({ onSimulationChange }: WhatIfSimulatorProps) {
  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: 'Warfarin', originalDose: 5, currentDose: 5, unit: 'mg', enabled: true, maxDose: 10, minDose: 1 },
    { id: '2', name: 'Metformin', originalDose: 1000, currentDose: 1000, unit: 'mg', enabled: true, maxDose: 2000, minDose: 500 },
    { id: '3', name: 'Lisinopril', originalDose: 20, currentDose: 20, unit: 'mg', enabled: true, maxDose: 40, minDose: 5 },
    { id: '4', name: 'Atorvastatin', originalDose: 40, currentDose: 40, unit: 'mg', enabled: true, maxDose: 80, minDose: 10 },
    { id: '5', name: 'Aspirin', originalDose: 81, currentDose: 81, unit: 'mg', enabled: true, maxDose: 325, minDose: 81 }
  ]);

  const [showWarning, setShowWarning] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDoseChange = (id: string, value: number[]) => {
    const newMedications = medications.map(med => {
      if (med.id === id) {
        const newDose = value[0];

        if (newDose < med.minDose * 1.2 || newDose > med.maxDose * 0.9) {
          setShowWarning(`Warning: ${med.name} dose of ${newDose}${med.unit} is outside recommended range`);
          setTimeout(() => setShowWarning(null), 3000);
        }

        return { ...med, currentDose: newDose };
      }
      return med;
    });
    setMedications(newMedications);
    onSimulationChange(newMedications);
  };

  const handleToggle = (id: string, enabled: boolean) => {
    const newMedications = medications.map(med =>
      med.id === id ? { ...med, enabled } : med
    );
    setMedications(newMedications);
    onSimulationChange(newMedications);
  };

  return (
    <div className="bg-teal-50 rounded-lg p-6 border border-teal-200 h-full overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-teal-900 mb-2">Treatment Modification Sandbox</h3>
        <p className="text-sm text-teal-700">Adjust dosages and medications to simulate outcomes</p>
      </div>

      {showWarning && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-amber-800">{showWarning}</div>
        </div>
      )}

      <div className="space-y-6">
        {medications.map(med => (
          <div key={med.id} className="bg-white rounded-lg p-4 border border-slate-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="text-slate-900">{med.name}</div>
                  <Switch.Root
                    checked={med.enabled}
                    onCheckedChange={(checked) => handleToggle(med.id, checked)}
                    className={`w-11 h-6 rounded-full relative transition-colors ${
                      med.enabled ? 'bg-teal-600' : 'bg-slate-300'
                    }`}
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
                  </Switch.Root>
                </div>
                {!med.enabled && (
                  <div className="text-sm text-slate-500 mt-1">Medication disabled</div>
                )}
              </div>
            </div>

            {med.enabled && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Dosage</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-900">{med.currentDose}{med.unit}</span>
                    {med.currentDose !== med.originalDose && (
                      <span className="text-teal-600">
                        ({med.currentDose > med.originalDose ? '+' : ''}{med.currentDose - med.originalDose}{med.unit})
                      </span>
                    )}
                  </div>
                </div>

                <Slider.Root
                  value={[med.currentDose]}
                  onValueChange={(value) => handleDoseChange(med.id, value)}
                  min={med.minDose}
                  max={med.maxDose}
                  step={med.unit === 'mg' && med.maxDose > 100 ? 50 : 1}
                  className="relative flex items-center w-full h-5"
                >
                  <Slider.Track className="bg-slate-200 relative flex-grow rounded-full h-2">
                    <Slider.Range className="absolute bg-teal-600 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-teal-600 rounded-full hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </Slider.Root>

                <div className="flex justify-between text-xs text-slate-500">
                  <span>{med.minDose}{med.unit}</span>
                  <span>{med.maxDose}{med.unit}</span>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="border-t border-teal-200 pt-6">
          <label className="text-slate-700 mb-2 block">Swap or Add Medication</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medication database..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">Search for alternative medications to replace current regimen</p>
        </div>
      </div>
    </div>
  );
}
