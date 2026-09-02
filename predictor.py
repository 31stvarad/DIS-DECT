"""
=============================================================================
MedSense AI - Disease Detection & Inference Engine (Python Version)
File: predictor.py

HOW THE ALGORITHM WORKS IN 3 STEPS:
1. INPUT: Receives a list of symptom IDs selected by the user.
2. MATCHING & WEIGHTING: Compares inputs against primary & secondary symptoms
   of each disease, multiplying by clinical specificity weights (1.0 - 4.5).
3. RANKING & OUTPUT: Calculates confidence percentage, isolates the top primary
   disease, and generates the top 3 differential diagnoses.
=============================================================================
"""

from dataset import SYMPTOMS_LIST, DISEASES_DATABASE, DEMO_PRESETS

# Create a fast lookup dictionary for symptom weights: { "high_fever": 3.0, ... }
WEIGHT_MAP = {s["id"]: s.get("weight", 2.0) for s in SYMPTOMS_LIST}
NAME_MAP = {s["id"]: s["name"] for s in SYMPTOMS_LIST}

def detect_disease(selected_symptoms):
    """
    Main Disease Detection Function.
    
    Parameters:
        selected_symptoms (list of str): e.g. ['high_fever', 'retro_orbital_pain', 'skin_rash']
        
    Returns:
        dict: Containing 'primary' diagnosis, 'confidence', 'differentials', 'meta', and 'math_breakdown'.
    """
    if not selected_symptoms:
        return None

    selected_set = set(selected_symptoms)
    total_user_weight = sum(WEIGHT_MAP.get(s_id, 2.0) for s_id in selected_set)
    scored_candidates = []

    # -------------------------------------------------------------------------
    # STEP 1: Evaluate Each Disease in Knowledge Base
    # -------------------------------------------------------------------------
    for disease in DISEASES_DATABASE:
        matched_primary = []
        matched_secondary = []
        matched_primary_weight = 0.0
        matched_secondary_weight = 0.0

        # Check Primary Symptoms (Full weight multiplier: 1.0)
        for s_id in disease["primary_symptoms"]:
            if s_id in selected_set:
                matched_primary.append(s_id)
                matched_primary_weight += WEIGHT_MAP.get(s_id, 2.0) * 1.0

        # Check Secondary Symptoms (Partial weight multiplier: 0.45)
        for s_id in disease["secondary_symptoms"]:
            if s_id in selected_set:
                matched_secondary.append(s_id)
                matched_secondary_weight += WEIGHT_MAP.get(s_id, 2.0) * 0.45

        total_matched_weight = matched_primary_weight + matched_secondary_weight
        num_primary_required = len(disease["primary_symptoms"])

        # Primary Coverage = (Matched Primary Symptoms / Total Primary Symptoms of this disease)
        primary_coverage = len(matched_primary) / num_primary_required if num_primary_required > 0 else 0.0
        
        # User Precision = (Matched Weight / Total Weight of Symptoms User Entered)
        user_precision = total_matched_weight / total_user_weight if total_user_weight > 0 else 0.0

        # Combined Clinical Matching Score
        raw_score = (primary_coverage * 0.65) + (user_precision * 0.35)

        # Boost score if at least 2 primary symptoms match
        if len(matched_primary) >= 2:
            raw_score *= (1.0 + (len(matched_primary) * 0.15))

        if total_matched_weight > 0:
            scored_candidates.append({
                "disease": disease,
                "raw_score": raw_score,
                "matched_primary": matched_primary,
                "matched_secondary": matched_secondary,
                "primary_coverage": primary_coverage,
                "total_matched_weight": total_matched_weight
            })

    if not scored_candidates:
        return None

    # -------------------------------------------------------------------------
    # STEP 2: Sort Candidates Descending by Score
    # -------------------------------------------------------------------------
    scored_candidates.sort(key=lambda x: x["raw_score"], reverse=True)
    top_candidate = scored_candidates[0]

    # Calculate Top Confidence % (scaled between 70% and 98%)
    coverage_pct = top_candidate["primary_coverage"]
    num_matches = len(top_candidate["matched_primary"])
    top_confidence = int(min(98, max(70, round((coverage_pct * 60) + (num_matches * 10) + 20))))

    # -------------------------------------------------------------------------
    # STEP 3: Differential Diagnosis (Top 3 Runner-Up Conditions)
    # -------------------------------------------------------------------------
    max_raw = top_candidate["raw_score"]
    differentials = []
    for cand in scored_candidates[1:4]:
        ratio = cand["raw_score"] / max_raw if max_raw > 0 else 0.0
        diff_conf = int(max(15, min(round(top_confidence * ratio * 0.85), top_confidence - 8)))
        differentials.append({
            "name": cand["disease"]["name"],
            "category": cand["disease"]["category"],
            "confidence": diff_conf
        })

    # Prepare Math Breakdown Explanation
    matched_names = [NAME_MAP.get(s_id, s_id) for s_id in top_candidate["matched_primary"]]
    math_breakdown = (
        f"1. Input Vector Size: {len(selected_symptoms)} symptoms selected.\n"
        f"2. Matched Core Markers: {len(top_candidate['matched_primary'])} primary symptoms ({', '.join(matched_names)}).\n"
        f"3. Core Coverage: {int(coverage_pct * 100)}% of disease profile matched -> Final Confidence: {top_confidence}%."
    )

    return {
        "primary_disease": top_candidate["disease"],
        "confidence": top_confidence,
        "matched_primary_symptoms": matched_names,
        "differentials": differentials,
        "math_breakdown": math_breakdown
    }


# Quick test when running this file directly
if __name__ == "__main__":
    test_inputs = ["high_fever", "retro_orbital_pain", "severe_body_aches", "skin_rash"]
    print("Testing with symptoms:", test_inputs)
    result = detect_disease(test_inputs)
    if result:
        print("\nPrimary Diagnosis :", result["primary_disease"]["name"])
        print("Confidence        :", f"{result['confidence']}%")
        print("Specialist Doctor :", result["primary_disease"]["specialist"])
        print("Urgency           :", result["primary_disease"]["urgency"])
        print("\nDifferential Diagnoses:")
        for d in result["differentials"]:
            print(f" - {d['name']} ({d['confidence']}%)")
        print("\nMathematical Breakdown:\n" + result["math_breakdown"])
