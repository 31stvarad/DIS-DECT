"""
=============================================================================
MedSense AI - Interactive Console Disease Detector
File: main.py
Zero dependencies - runs in any standard Python 3 installation.
=============================================================================
"""

import sys
from dataset import SYMPTOMS_LIST, DEMO_PRESETS
from predictor import detect_disease

def print_header():
    print("=" * 68)
    print("       MEDSENSE AI - CLINICAL DISEASE DETECTOR (PYTHON)")
    print("=" * 68)

def show_symptom_menu():
    print("\n--- SYMPTOM CATALOG ---")
    for idx, sym in enumerate(SYMPTOMS_LIST, start=1):
        cat = sym["category"].ljust(14)
        name = sym["name"].ljust(35)
        print(f"[{idx:2d}] {cat} : {name}", end="\n" if idx % 2 == 0 else "   ")
    print("\n" + "-" * 68)

def print_results(result):
    if not result:
        print("\n[!] No matching disease could be identified. Please select more symptoms.")
        return

    disease = result["primary_disease"]
    
    print("\n" + "=" * 68)
    print("                    CLINICAL DIAGNOSIS REPORT")
    print("=" * 68)
    print(f" PRIMARY DIAGNOSIS     : {disease['name'].upper()}")
    print(f" CONFIDENCE LEVEL      : {result['confidence']}%")
    print(f" SEVERITY & URGENCY    : [{disease['severity'].upper()}] - {disease['urgency']}")
    print(f" RECOMMENDED DOCTOR    : {disease['specialist']}")
    print("-" * 68)
    print(f" CLINICAL SUMMARY      : {disease['summary']}")
    insight = disease.get('clinical_insight', '')
    print(f" DIAGNOSTIC TRIAD      : {insight}")
    print("-" * 68)
    
    print(" PRECAUTIONS & FIRST AID:")
    for p in disease["precautions"]:
        print(f"   * {p}")
        
    print("\n RECOMMENDED DIET:")
    for d in disease["diet"]:
        print(f"   * {d}")

    print("\n SUGGESTED DIAGNOSTIC LAB TESTS:")
    for t in disease["tests"]:
        print(f"   * {t}")

    print("-" * 68)
    print(" DIFFERENTIAL DIAGNOSES (TOP ALTERNATIVE CANDIDATES):")
    if result["differentials"]:
        for idx, diff in enumerate(result["differentials"], start=1):
            print(f"   {idx}. {diff['name'].ljust(30)} ({diff['confidence']}%)")
    else:
        print("   No close secondary candidates.")

    print("-" * 68)
    print(" MATHEMATICAL CALCULATION BREAKDOWN:")
    print(result["math_breakdown"])
    print("=" * 68)

def run_interactive():
    print_header()
    print("\n1-CLICK QUICK DEMO SCENARIOS:")
    for idx, preset in enumerate(DEMO_PRESETS, start=1):
        print(f"  [{idx}] {preset['title']}")
    print("  [9] Custom Symptom Selection (Pick by number)")
    print("  [0] Exit")

    choice = input("\nEnter choice (1-9, 0 to exit): ").strip()

    if choice == '0':
        print("Exiting MedSense AI. Stay healthy!")
        return
    elif choice in [str(i) for i in range(1, len(DEMO_PRESETS) + 1)]:
        preset_idx = int(choice) - 1
        preset = DEMO_PRESETS[preset_idx]
        print(f"\n>> Running Scenario: {preset['title']}")
        print(f">> Symptoms: {preset['symptoms']}")
        result = detect_disease(preset["symptoms"])
        print_results(result)
    elif choice == '9':
        show_symptom_menu()
        user_input = input("\nEnter symptom numbers separated by commas (e.g. 1, 31, 32): ").strip()
        try:
            indices = [int(x.strip()) - 1 for x in user_input.split(",") if x.strip().isdigit()]
            chosen_symptoms = [SYMPTOMS_LIST[i]["id"] for i in indices if 0 <= i < len(SYMPTOMS_LIST)]
            if not chosen_symptoms:
                print("No valid symptoms selected.")
                return
            print(f"\n>> Processing {len(chosen_symptoms)} symptoms...")
            result = detect_disease(chosen_symptoms)
            print_results(result)
        except Exception as e:
            print(f"Error parsing input: {e}")
    else:
        print("Invalid choice.")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        # Allow passing preset number as argument for quick tests
        preset_idx = int(sys.argv[1]) - 1
        if 0 <= preset_idx < len(DEMO_PRESETS):
            preset = DEMO_PRESETS[preset_idx]
            result = detect_disease(preset["symptoms"])
            print_results(result)
    else:
        run_interactive()
