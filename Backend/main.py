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
