from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import xgboost as xgb
import numpy as np
import json

app = FastAPI(title="Nodose Counterfactual API")

# 1. Setup CORS so your GitHub Pages frontend isn't blocked
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For production, replace "*" with your GitHub Pages URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Load the Model
print("🚀 API Starting up...")
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

print("📦 Attempting to load XGBoost model...")
model_path = os.path.join(BASE_DIR, "xgboost_model_final3.json")
model = xgb.XGBClassifier()
model.load_model(model_path)
print("✅ Model loaded successfully!")

# 3. Extract the exact feature list dynamically from the model!
with open(model_path, "r") as f:
    model_data = json.load(f)

# The model expects exactly 555 columns. 
# The first 5 are demographics, the remaining 550 are the drugs.
ALL_FEATURES = model_data["learner"]["feature_names"]
DRUG_FEATURES = ALL_FEATURES[5:] 

# 4. Load the Optimal Threshold
try:
    with open("model_config_opt_threshold.json3", "r") as f:
        config = json.load(f)
        # Note: If your teammate named the key something different (like "threshold" instead of "optimal_threshold"), 
        # just change the string below to match!
        OPTIMAL_THRESHOLD = config.get("optimal_threshold", 0.5)
except FileNotFoundError:
    print("Warning: Threshold config not found. Defaulting to 0.5")
    OPTIMAL_THRESHOLD = 0.5

# 5. Define what JSON data the React frontend needs to send us
class CounterfactualRequest(BaseModel):
    primaryid: int       
    sex_bin: float
    age_years: float
    wt_kg: float
    other_rx: int        
    rx_list: list[str]   # The new list of drugs the user selected in the UI

@app.post("/counterfactual")
def run_counterfactual(req: CounterfactualRequest):
    
    # Reconstruct the base demographic features
    base_features = [req.primaryid, req.sex_bin, req.age_years, req.wt_kg, req.other_rx]
    
    # Convert the requested drugs to a multi-hot encoded vector (0s and 1s)
    active_drugs = set(req.rx_list) # Using a set makes lookups incredibly fast
    drug_vector = [1 if drug in active_drugs else 0 for drug in DRUG_FEATURES]
    
    # Combine everything into a 1x555 array for XGBoost
    X_inference = np.array([base_features + drug_vector])
    
    # Run the model to get the probability of the positive class
    risk_prob = float(model.predict_proba(X_inference)[0][1])
    
    # Apply your teammate's optimal threshold
    risk_class = "CRITICAL" if risk_prob >= OPTIMAL_THRESHOLD else "SERIOUS"
    
    return {
        "patient_id": req.primaryid,
        "new_risk_probability": risk_prob,
        "new_class": risk_class,
        "threshold_used": OPTIMAL_THRESHOLD
    }
