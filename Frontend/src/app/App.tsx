import { useState, useEffect } from 'react';
import { TopNavigation } from './components/TopNavigation';
import { PatientList } from './components/PatientList';
import { PatientDetails } from './components/PatientDetails';
import { DrugSwapPanel } from './components/DrugSwapPanel';
import { parsePatientsCSV, Patient } from '../utils/csvParser';

export default function App() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Only load the patients now!
        const patientsResponse = await fetch(`${import.meta.env.BASE_URL}data/pool_critical.csv`);
        if (!patientsResponse.ok) throw new Error('Failed to fetch patients');
        
        const patientsText = await patientsResponse.text();
        const allPatientsData = await parsePatientsCSV(patientsText);

        setPatients(allPatientsData);

        if (allPatientsData.length > 0) {
          setSelectedPatientId(allPatientsData[0].id);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  if (isLoading) return <div className="p-8 text-center">Loading patient data...</div>;

  return (
    <div className="size-full flex flex-col bg-slate-50">
      <TopNavigation />

      <div className="flex flex-1 overflow-hidden">
        <PatientList
          patients={patients}
          selectedPatientId={selectedPatientId}
          onSelectPatient={setSelectedPatientId}
        />

        <div className="flex-1 flex gap-6 p-6 overflow-hidden">
          <div className="flex-1">
            {selectedPatient && <PatientDetails patient={selectedPatient} />}
          </div>

          <div className="w-96 overflow-y-auto">
            {selectedPatient && <DrugSwapPanel patient={selectedPatient} />}
            {selectedPatient && <DrugRecommender patient={selectedPatient} />}
          </div>
        </div>
      </div>
    </div>
  );
}
