class SwapRecommendationRequest(BaseModel):
    primaryid: int       
    sex_bin: float
    age_years: float
    wt_kg: float
    other_rx: int        
    current_rx_list: list[str] # The drugs they are currently taking
    drug_to_remove: str        # The specific drug they want an alternative for

@app.post("/recommend_swaps")
def recommend_swaps(req: SwapRecommendationRequest):
    # 1. Reconstruct base demographics
    base_features = [req.primaryid, req.sex_bin, req.age_years, req.wt_kg, req.other_rx]
    
    # 2. Get the list of drugs they are keeping (remove the target drug)
    remaining_drugs = set(req.current_rx_list)
    if req.drug_to_remove in remaining_drugs:
        remaining_drugs.remove(req.drug_to_remove)
        
    # 3. Find out what drugs are available to test 
    # (We don't want to recommend a drug they are already taking)
    available_drugs = [d for d in DRUG_FEATURES if d not in remaining_drugs]
    
    # 4. Build a massive 2D matrix (One row for every possible drug swap)
    # This is how we test hundreds of scenarios in milliseconds!
    batch_matrix = []
    for test_drug in available_drugs:
        # Create a vector with the remaining drugs PLUS the test drug
        test_scenario_set = remaining_drugs.copy()
        test_scenario_set.add(test_drug)
        drug_vector = [1 if d in test_scenario_set else 0 for d in DRUG_FEATURES]
        batch_matrix.append(base_features + drug_vector)
        
    X_batch = np.array(batch_matrix)
    
    # 5. Run XGBoost on all scenarios simultaneously
    probabilities = model.predict_proba(X_batch)[:, 1] # Get probabilities for the positive class
    
    # 6. Pair the test drugs with their new scores and sort them from lowest risk to highest
    results = [{"drug": available_drugs[i], "new_risk": float(probabilities[i])} for i in range(len(available_drugs))]
    results = sorted(results, key=lambda x: x["new_risk"])
    
    # 7. Return the Top 5 safest swaps
    top_5 = results[:5]
    
    return {
        "patient_id": req.primaryid,
        "removed_drug": req.drug_to_remove,
        "recommendations": top_5
    }
