"""
MedSense AI - Interactive Terminal / CLI Disease Predictor
Demonstrates real-time Python ML inference with Naive Bayes probability breakdown.
Works with zero external dependencies (pure Python standard library).
"""

import os
import pickle
import sys

from train_model import PurePythonNaiveBayes, train_disease_classifier

def load_or_train_model():
    model_path = os.path.join(os.path.dirname(__file__), 'disease_nb_model.pkl')
    features_path = os.path.join(os.path.dirname(__file__), 'features.pkl')

    if not os.path.exists(model_path) or not os.path.exists(features_path):
        print("[INFO] Model artifacts not found. Training model automatically...")
        train_disease_classifier()

    with open(model_path, 'rb') as f:
        model = pickle.load(f)
    with open(features_path, 'rb') as f:
        features = pickle.load(f)

    return model, features

def predict_symptoms(selected_symptom_ids):
    model, features = load_or_train_model()

    # Create binary input vector X (1xN)
    sample_vector = [1 if feat in selected_symptom_ids else 0 for feat in features]

    # Predict Probabilities
    if hasattr(model, 'predict_proba'):
        probs_dict = model.predict_proba(sample_vector)
        sorted_predictions = sorted(probs_dict.items(), key=lambda item: item[1], reverse=True)
    else:
        print("[ERROR] Unrecognized model format.")
        return

    print("\n" + "=" * 65)
    print("      CLINICAL PREDICTION RESULTS (NAIVE BAYES INFERENCE)")
    print("=" * 65)
    
    top_disease, top_prob = sorted_predictions[0]
    top_confidence = top_prob * 100

    print(f">> PRIMARY PREDICTED CONDITION : {top_disease}")
    print(f">> ESTIMATED CONFIDENCE       : {top_confidence:.2f}%\n")

    print("DIFFERENTIAL DIAGNOSES (TOP ALTERNATIVE MATCHES):")
    print("-" * 65)
    for rank, (diff_disease, diff_prob) in enumerate(sorted_predictions[1:4], start=1):
        diff_pct = diff_prob * 100
        print(f" {rank}. {diff_disease.ljust(32)} : {diff_pct:.2f}%")
    print("=" * 65)

def main():
    model, features = load_or_train_model()

    print("=" * 65)
    print("           MEDSENSE AI - TERMINAL DISEASE DETECTOR")
    print("=" * 65)
    print("Available Symptoms in Model Database:\n")
    
    for i, feat in enumerate(features, start=1):
        clean_name = feat.replace('_', ' ').capitalize()
        print(f"{i:2d}. {clean_name.ljust(32)}", end="\n" if i % 2 == 0 else " ")

    print("\n\nChoose an option:")
    print("1. Enter comma-separated symptom numbers (e.g., 1, 37, 39 for Dengue)")
    print("2. Run Sample Test 1: Dengue Fever (High fever, Retro-orbital pain, Body ache)")
    print("3. Run Sample Test 2: COVID-19 (Dry cough, High fever, Loss of smell/taste)")
    print("4. Run Sample Test 3: Type 2 Diabetes (Excessive thirst, Frequent urination, Weight loss)")

    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        choice = sys.argv[1]
    else:
        try:
            choice = input("\nEnter choice (1/2/3/4): ").strip()
        except EOFError:
            choice = "2"

    if choice == '1':
        num_str = input("Enter symptom numbers separated by commas: ").strip()
        try:
            indices = [int(n.strip()) - 1 for n in num_str.split(',') if n.strip().isdigit()]
            selected = [features[i] for i in indices if 0 <= i < len(features)]
            print(f"\nSelected Symptoms: {[s.replace('_', ' ').title() for s in selected]}")
            predict_symptoms(selected)
        except Exception as e:
            print(f"Invalid input: {e}")
    elif choice == '2':
        selected = ["high_fever", "retro_orbital_pain", "severe_body_aches", "skin_rash"]
        print(f"\nRunning Sample Test: Dengue Symptoms ({', '.join(selected)})...")
        predict_symptoms(selected)
    elif choice == '3':
        selected = ["dry_cough", "high_fever", "loss_of_smell_taste", "fatigue_weakness"]
        print(f"\nRunning Sample Test: COVID-19 Symptoms ({', '.join(selected)})...")
        predict_symptoms(selected)
    elif choice == '4':
        selected = ["excessive_thirst", "frequent_urination", "unexplained_weight_loss", "slow_healing_wounds"]
        print(f"\nRunning Sample Test: Diabetes Symptoms ({', '.join(selected)})...")
        predict_symptoms(selected)
    else:
        print("Invalid choice. Exiting.")

if __name__ == "__main__":
    main()
