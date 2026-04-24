import { User, Pill, AlertCircle, AlertTriangle } from 'lucide-react';

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

interface PatientDetailsProps {
  patient: Patient;
}

export function PatientDetails({ patient }: PatientDetailsProps) {
  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-teal-600" />
          <h3 className="text-slate-900">Patient Profile</h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1">Patient ID</div>
            <div className="text-slate-900">{patient.id}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Sex</div>
            <div className="text-slate-900">{patient.sex}</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Age</div>
            <div className="text-slate-900">{patient.age} years</div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-1">Weight</div>
            <div className="text-slate-900">{patient.weight} kg</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs text-slate-500 mb-1">Other Prescriptions</div>
            <div className="text-slate-900">{patient.hasOtherPrescriptions ? 'Yes' : 'No'}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-slate-900">Adverse Event Risk</h3>
          {patient.riskCategory === 'Critical/permanent' ? (
            <AlertCircle className="w-6 h-6 text-red-600" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-amber-600" />
          )}
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          <div className={`text-7xl mb-4 ${
            patient.riskCategory === 'Critical/permanent' ? 'text-red-600' : 'text-amber-600'
          }`}>
            {patient.riskScore}%
          </div>

          <div className={`px-4 py-2 rounded-lg mb-6 ${
            patient.riskCategory === 'Critical/permanent'
              ? 'bg-red-100 text-red-700'
              : 'bg-amber-100 text-amber-700'
          }`}>
            {patient.riskCategory} Risk
          </div>

          <div className="w-full max-w-md">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
              <span>Severe but recoverable</span>
              <span>Critical/permanent</span>
            </div>
            <div className="w-full h-4 bg-gradient-to-r from-amber-500 to-red-500 rounded-full relative">
              <div
                className="absolute w-1 h-6 bg-slate-900 rounded-full -top-1"
                style={{ left: `${patient.riskScore}%`, transform: 'translateX(-50%)' }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="w-5 h-5 text-teal-600" />
          <h3 className="text-slate-900">Current Medications</h3>
        </div>

        <div className="space-y-2">
          {patient.mainPrescriptions.map((med, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-teal-600" />
              <div className="text-slate-900">{med}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
