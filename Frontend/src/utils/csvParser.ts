import Papa from 'papaparse';

interface CounterfactualRow {
  ID: string;
  'Current Drug': string;
  'New Drug': string;
  'Current Risk': string;
  'New Risk': string;
  'Change in Risk': string;
  'Old Class': string;
  'New Class': string;
  'New Status': string;
}

export interface Counterfactual {
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

export const parseCounterfactualsCSV = (csvText: string): Counterfactual[] => {
  return new Promise((resolve, reject) => {
    Papa.parse<CounterfactualRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const counterfactuals: Counterfactual[] = results.data
            .filter((row): row is CounterfactualRow => !!row.ID)
            .map((row) => ({
              patientId: row.ID,
              originalDrug: row['Current Drug'],
              alternativeDrug: row['New Drug'],
              originalRisk: parseFloat(row['Current Risk']),
              newRisk: parseFloat(row['New Risk']),
              delta: parseFloat(row['Change in Risk']),
              oldClass: row['Old Class'],
              newClass: row['New Class'],
              newStatus: row['New Status'] === 'CRITICAL' ? 'Severe' : 'Non-Severe',
            }));
          resolve(counterfactuals);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

interface PatientRow {
  index: string;
  primaryid: string;
  sex_bin: string;
  age_years: string;
  wt_kg: string;
  other_rx: string;
  target_label: string;
  risk_score: string;
  [key: string]: string; // For drug columns
}

export interface Patient {
  id: string;
  sex: 'Male' | 'Female';
  age: number;
  weight: number;
  hasOtherPrescriptions: boolean;
  mainPrescriptions: string[];
  riskScore: number;
  riskCategory: 'Severe' | 'Non-Severe';
}

export const parsePatientsCSV = (csvText: string): Patient[] => {
  return new Promise((resolve, reject) => {
    Papa.parse<PatientRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const patients: Patient[] = results.data
            .filter((row): row is PatientRow => !!row.primaryid)
            .map((row) => {
              // Extract drug names where value is '1'
              const mainPrescriptions: string[] = [];
              Object.keys(row).forEach(key => {
                // Skip non-drug columns
                if (!['index', 'primaryid', 'sex_bin', 'age_years', 'wt_kg', 'other_rx', 'target_label', 'risk_score'].includes(key)) {
                  if (row[key] === '1') {
                    mainPrescriptions.push(key);
                  }
                }
              });

              return {
                id: row.primaryid,
                sex: row.sex_bin === '1' ? 'Male' : 'Female',
                age: parseInt(row.age_years),
                weight: parseFloat(row.wt_kg),
                hasOtherPrescriptions: row.other_rx === '1',
                mainPrescriptions: mainPrescriptions,
                riskScore: (parseFloat(row.risk_score) * 100).toFixed(2),
                riskCategory: row.target_label === '1' ? 'Critical/permanent' : 'Severe but recoverable',
              };
            });
          resolve(patients);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

