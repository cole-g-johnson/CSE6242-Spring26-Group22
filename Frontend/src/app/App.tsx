import { useState, useEffect } from 'react';
import { TopNavigation } from './components/TopNavigation';
import { PatientList } from './components/PatientList';
import { PatientDetails } from './components/PatientDetails';
import { DrugSwapPanel } from './components/DrugSwapPanel';
import { parseCounterfactualsCSV, parsePatientsCSV, Counterfactual, Patient } from '../utils/csvParser';

export default function App() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [counterfactuals, setCounterfactuals] = useState<Counterfactual[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load counterfactuals locally
        const counterfactualsResponse = await fetch('data/counterfactuals.csv');
        const csvText = await counterfactualsResponse.text();
        const counterfactualsData = await parseCounterfactualsCSV(csvText);
        setCounterfactuals(counterfactualsData);

        // Get unique patient IDs from counterfactuals
        const counterfactualPatientIds = [...new Set(counterfactualsData.map(c => c.patientId))];

        // Load patients locally
        const patientsResponse = await fetch('data/pool_critical.csv');
        if (!patientsResponse.ok) {
          throw new Error(`Failed to fetch CSV file: ${patientsResponse.status} ${patientsResponse.statusText}`);
        }
        const patientsText = await patientsResponse.text();
        if (!patientsText.trim()) {
          throw new Error('CSV file is empty');
        }
        console.log(`Loaded CSV file: ${patientsText.length} characters`);
        const allPatientsData = await parsePatientsCSV(patientsText);

        // Filter patients to only include those that have counterfactuals
        const filteredPatients = allPatientsData.filter(patient =>
          counterfactualPatientIds.includes(patient.id)
        );

        setPatients(filteredPatients);

        // Set initial selected patient from filtered list
        if (filteredPatients.length > 0) {
          setSelectedPatientId(filteredPatients[0].id);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, []);

  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const patientCounterfactuals = counterfactuals.filter(c => c.patientId === selectedPatientId);

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
            {selectedPatient && (
              <PatientDetails patient={selectedPatient} />
            )}
          </div>

          <div className="w-96 overflow-y-auto">
            {selectedPatient && (
              <DrugSwapPanel
                patient={selectedPatient}
                counterfactuals={patientCounterfactuals}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
