import { User, Activity, Pill } from 'lucide-react';

export function PatientSidebar() {
  const demographics = {
    name: 'Margaret Thompson',
    age: 68,
    sex: 'Female',
    weight: '72 kg',
    height: '165 cm',
    bmi: 26.4
  };

  const medications = [
    { name: 'Warfarin', dose: '5 mg', frequency: 'Daily' },
    { name: 'Metformin', dose: '1000 mg', frequency: 'Twice daily' },
    { name: 'Lisinopril', dose: '20 mg', frequency: 'Daily' },
    { name: 'Atorvastatin', dose: '40 mg', frequency: 'Evening' },
    { name: 'Aspirin', dose: '81 mg', frequency: 'Daily' }
  ];

  const medicalHistory = [
    'Type 2 Diabetes (2015)',
    'Hypertension (2012)',
    'Atrial Fibrillation (2019)',
    'Hyperlipidemia (2014)',
    'Chronic Kidney Disease Stage 2'
  ];

  return (
    <div className="bg-slate-50 border-r border-slate-200 w-80 h-full overflow-y-auto p-6">
      <div className="space-y-6">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-teal-600" />
            <h3 className="text-slate-900">Patient Profile</h3>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-slate-500 text-sm">Name</div>
              <div className="text-slate-900">{demographics.name}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-slate-500 text-sm">Age</div>
                <div className="text-slate-900">{demographics.age} years</div>
              </div>
              <div>
                <div className="text-slate-500 text-sm">Sex</div>
                <div className="text-slate-900">{demographics.sex}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-slate-500 text-sm">Weight</div>
                <div className="text-slate-900">{demographics.weight}</div>
              </div>
              <div>
                <div className="text-slate-500 text-sm">BMI</div>
                <div className="text-slate-900">{demographics.bmi}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-5 h-5 text-teal-600" />
            <h3 className="text-slate-900">Active Medications</h3>
          </div>

          <div className="space-y-3">
            {medications.map((med, index) => (
              <div key={index} className="pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="text-slate-900">{med.name}</div>
                <div className="text-sm text-slate-500">{med.dose} - {med.frequency}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-teal-600" />
            <h3 className="text-slate-900">Medical History</h3>
          </div>

          <ul className="space-y-2">
            {medicalHistory.map((item, index) => (
              <li key={index} className="text-sm text-slate-700 flex items-start gap-2">
                <span className="text-teal-600 mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
