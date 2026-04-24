import { Users, AlertCircle, AlertTriangle } from 'lucide-react';

interface Patient {
  id: string;
  sex: 'Male' | 'Female';
  age: number;
  weight: number;
  hasOtherPrescriptions: boolean;
  mainPrescriptions: string[];
  riskScore: number;
  riskCategory: 'Critical/permanent' | 'Severe but recoverable';
}

interface PatientListProps {
  patients: Patient[];
  selectedPatientId: string;
  onSelectPatient: (id: string) => void;
}

export function PatientList({ patients, selectedPatientId, onSelectPatient }: PatientListProps) {
  const sortedPatients = [...patients].sort((a, b) => {
    const aBoundary = Math.abs(a.riskScore - 50);
    const bBoundary = Math.abs(b.riskScore - 50);
    return aBoundary - bBoundary;
  });

  return (
    <div className="bg-white border-r border-slate-200 w-80 h-full overflow-y-auto">
      <div className="p-4 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-teal-600" />
          <h2 className="text-slate-900">Patients Near Boundary</h2>
        </div>
        <p className="text-xs text-slate-600">Sorted by proximity to severe threshold (50%)</p>
      </div>

      <div className="p-2">
        {sortedPatients.map((patient) => (
          <button
            key={patient.id}
            onClick={() => onSelectPatient(patient.id)}
            className={`w-full text-left p-4 rounded-lg mb-2 transition-colors ${
              selectedPatientId === patient.id
                ? 'bg-teal-50 border-2 border-teal-500'
                : 'bg-slate-50 border-2 border-transparent hover:bg-slate-100'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="text-slate-900 mb-1">{patient.id}</div>
                <div className="text-xs text-slate-600">
                  {patient.sex}, {patient.age}y, {patient.weight}kg
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className={`text-lg ${
                  patient.riskCategory === 'Critical/permanent' ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {patient.riskScore}%
                </div>
                {patient.riskCategory === 'Critical/permanent' ? (
                  <AlertCircle className="w-4 h-4 text-red-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs px-2 py-1 rounded ${
                patient.riskCategory === 'Critical/permanent'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {patient.riskCategory}
              </span>
              <span className="text-xs text-slate-500">
                {patient.mainPrescriptions.length} meds
              </span>
            </div>

            <div className="mt-2 w-full bg-slate-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  patient.riskCategory === 'Critical/permanent' ? 'bg-red-500' : 'bg-amber-500'
                }`}
                style={{ width: `${patient.riskScore}%` }}
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
