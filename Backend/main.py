import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import xgboost as xgb
import numpy as np

app = FastAPI(title="Nodose Counterfactual API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print("🚀 Starting API and loading optimized assets...")

# 1. Load the tiny list of 550 drugs
features_path = os.path.join(BASE_DIR, "drug_features.json")
with open(features_path, "r") as f:
    DRUG_FEATURES = json.load(f)

# 2. Load the binary model (Uses almost zero RAM!)
model_path = os.path.join(BASE_DIR, "model_optimized.ubj")
model = xgb.XGBClassifier()
model.load_model(model_path)

# 3. Load the Threshold
threshold_path = os.path.join(BASE_DIR, "model_config_opt_threshold.json3")
try:
    with open(threshold_path, "r") as f:
        config = json.load(f)
        OPTIMAL_THRESHOLD = config.get("optimal_threshold", 0.5)
except FileNotFoundError:
    print("Warning: Threshold config not found. Defaulting to 0.5")
    OPTIMAL_THRESHOLD = 0.5

print("✅ API is fully loaded and ready!")

# --- SIMULATOR ENDPOINT ---

class CounterfactualRequest(BaseModel):
    primaryid: int       
    sex_bin: float
    age_years: float
    wt_kg: float
    other_rx: int        
    rx_list: list[str]   

@app.post("/counterfactual")
def run_counterfactual(req: CounterfactualRequest):
    base_features = [req.primaryid, req.sex_bin, req.age_years, req.wt_kg, req.other_rx]
    
    active_drugs = set(req.rx_list)
    drug_vector = [1 if drug in active_drugs else 0 for drug in DRUG_FEATURES]
    
    X_inference = np.array([base_features + drug_vector])
    
    risk_prob = float(model.predict_proba(X_inference)[0][1])
    risk_class = "CRITICAL" if risk_prob >= OPTIMAL_THRESHOLD else "SERIOUS"
    
    return {
        "patient_id": req.primaryid,
        "new_risk_probability": risk_prob,
        "new_class": risk_class,
        "threshold_used": OPTIMAL_THRESHOLD
    }

# --- RECOMMENDER ENDPOINT ---

class SwapRecommendationRequest(BaseModel):
    primaryid: int       
    sex_bin: float
    age_years: float
    wt_kg: float
    other_rx: int        
    current_rx_list: list[str] 
    drug_to_remove: str        

@app.post("/recommend_swaps")
def recommend_swaps(req: SwapRecommendationRequest):
    # 1. Reconstruct base demographics
    base_features = [req.primaryid, req.sex_bin, req.age_years, req.wt_kg, req.other_rx]
    
    # 2. Get the list of drugs they are keeping
    remaining_drugs = set(req.current_rx_list)
    if req.drug_to_remove in remaining_drugs:
        remaining_drugs.remove(req.drug_to_remove)
        
    # 3. Find out what drugs are available to test
    available_drugs = [d for d in DRUG_FEATURES if d not in remaining_drugs]
    
    # 4. Build a massive 2D matrix
    batch_matrix = []
    for test_drug in available_drugs:
        test_scenario_set = remaining_drugs.copy()
        test_scenario_set.add(test_drug)
        drug_vector = [1 if d in test_scenario_set else 0 for d in DRUG_FEATURES]
        batch_matrix.append(base_features + drug_vector)
        
    X_batch = np.array(batch_matrix)
    
    # 5. Run XGBoost on all scenarios simultaneously
    probabilities = model.predict_proba(X_batch)[:, 1]
    
    # 6. Pair the test drugs with their new scores and sort them
    results = [{"drug": available_drugs[i], "new_risk": float(probabilities[i])} for i in range(len(available_drugs))]
    results = sorted(results, key=lambda x: x["new_risk"])
    
    # 7. Return the Top 5 safest swaps
    top_5 = results[:5]
    
    return {
        "patient_id": req.primaryid,
        "removed_drug": req.drug_to_remove,
        "recommendations": top_5
    }
