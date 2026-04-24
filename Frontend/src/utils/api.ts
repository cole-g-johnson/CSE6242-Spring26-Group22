import { Patient } from './csvParser';

// --- SIMULATOR API ---

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

  const response = await fetch('https://counterfactual-api.onrender.com/counterfactual', {
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

// --- RECOMMENDER API ---

export interface SwapRecommendation {
  drug: string;
  new_risk: number;
}

export interface RecommendAPIResponse {
  patient_id: number;
  removed_drug: string;
  recommendations: SwapRecommendation[];
}

export const fetchSwapRecommendations = async (
  patient: Patient, 
  currentRxList: string[],
  drugToRemove: string,
  drugsToTest: string[] = [] // NEW: Pass the clinician's choices
): Promise<RecommendAPIResponse> => {
  const payload = {
    primaryid: parseInt(patient.id),
    sex_bin: patient.sex === 'Male' ? 1.0 : 0.0,
    age_years: patient.age,
    wt_kg: patient.weight,
    other_rx: patient.hasOtherPrescriptions ? 1 : 0,
    current_rx_list: currentRxList,
    drug_to_remove: drugToRemove,
    drugs_to_test: drugsToTest // NEW
  };

  const response = await fetch('https://YOUR-RENDER-APP-NAME.onrender.com/recommend_swaps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  
  return response.json();
};
