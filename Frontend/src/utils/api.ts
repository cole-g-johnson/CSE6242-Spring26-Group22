import { Patient } from './csvParser';

export interface APIResponse {
  patient_id: number;
  new_risk_probability: number;
  new_class: string;
  threshold_used: number;
}

export const fetchDynamicCounterfactual = async (
  patient: Patient, 
  newRxList: string[]
): Promise<APIResponse> => {
  const payload = {
    primaryid: parseInt(patient.id),
    sex_bin: patient.sex === 'Male' ? 1.0 : 0.0,
    age_years: patient.age,
    wt_kg: patient.weight,
    other_rx: patient.hasOtherPrescriptions ? 1 : 0,
    rx_list: newRxList 
  };

  // Replace with your actual Render URL
  const response = await fetch('https://nodose-api.onrender.com/counterfactual', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};
