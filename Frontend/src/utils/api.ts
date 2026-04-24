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
  drugToRemove: string
): Promise<RecommendAPIResponse> => {
  const payload = {
    primaryid: parseInt(patient.id),
    sex_bin: patient.sex === 'Male' ? 1.0 : 0.0,
    age_years: patient.age,
    wt_kg: patient.weight,
    other_rx: patient.hasOtherPrescriptions ? 1 : 0,
    current_rx_list: currentRxList,
    drug_to_remove: drugToRemove
  };

  const response = await fetch('https://YOUR-RENDER-APP-NAME.onrender.com/recommend_swaps', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to get recommendations");
  return response.json();
};
