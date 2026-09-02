"""
=============================================================================
MedSense AI - Medical Knowledge Base (Python Version)
File: dataset.py
Contains structured medical data for diseases, symptoms, and demo presets.
=============================================================================
"""

# Categorized symptom list with specificity weights (1.0 to 4.5)
# Higher weight = More specific to a particular disease
SYMPTOMS_LIST = [
    # General Symptoms
    {"id": "high_fever", "name": "High Fever (>101°F)", "category": "General", "weight": 3.0},
    {"id": "mild_fever", "name": "Mild / Low-grade Fever", "category": "General", "weight": 2.0},
    {"id": "chills_shivering", "name": "Chills & Shivering", "category": "General", "weight": 2.5},
    {"id": "fatigue_weakness", "name": "Extreme Fatigue & Weakness", "category": "General", "weight": 2.0},
    {"id": "excessive_sweating", "name": "Night Sweats / Profuse Sweating", "category": "General", "weight": 2.0},
    {"id": "unexplained_weight_loss", "name": "Unexplained Weight Loss", "category": "General", "weight": 2.5},
    {"id": "excessive_thirst", "name": "Excessive Thirst (Polydipsia)", "category": "General", "weight": 3.0},
    {"id": "loss_of_appetite", "name": "Loss of Appetite", "category": "General", "weight": 1.5},

    # Respiratory Symptoms
    {"id": "dry_cough", "name": "Dry Cough", "category": "Respiratory", "weight": 2.0},
    {"id": "productive_cough", "name": "Cough with Phlegm / Mucus", "category": "Respiratory", "weight": 2.5},
    {"id": "shortness_of_breath", "name": "Shortness of Breath / Wheezing", "category": "Respiratory", "weight": 3.5},
    {"id": "chest_tightness", "name": "Chest Congestion / Tightness", "category": "Respiratory", "weight": 3.0},
    {"id": "sore_throat", "name": "Sore Throat & Hoarseness", "category": "Respiratory", "weight": 2.0},
    {"id": "runny_stuffy_nose", "name": "Runny or Stuffy Nose", "category": "Respiratory", "weight": 1.5},
    {"id": "sneezing_fits", "name": "Frequent Sneezing", "category": "Respiratory", "weight": 1.5},
    {"id": "loss_of_smell_taste", "name": "Loss of Smell or Taste (Anosmia)", "category": "Respiratory", "weight": 3.5},

    # Digestive Symptoms
    {"id": "nausea_vomiting", "name": "Nausea & Vomiting", "category": "Digestive", "weight": 2.5},
    {"id": "watery_diarrhea", "name": "Watery Diarrhea / Loose Stools", "category": "Digestive", "weight": 2.5},
    {"id": "abdominal_cramps", "name": "Abdominal Pain / Cramping", "category": "Digestive", "weight": 2.5},
    {"id": "acidity_heartburn", "name": "Acid Reflux / Heartburn", "category": "Digestive", "weight": 2.5},
    {"id": "stomach_bloating", "name": "Stomach Bloating & Gas", "category": "Digestive", "weight": 1.5},
    {"id": "yellowing_eyes_skin", "name": "Yellowing of Eyes & Skin (Jaundice)", "category": "Digestive", "weight": 4.0},
    {"id": "dark_colored_urine", "name": "Dark Coloured Urine", "category": "Digestive", "weight": 3.0},

    # Neurological Symptoms
    {"id": "severe_headache", "name": "Throbbing / Severe Headache", "category": "Neurological", "weight": 2.5},
    {"id": "dizziness_vertigo", "name": "Dizziness & Lightheadedness", "category": "Neurological", "weight": 2.0},
    {"id": "sensitivity_light_sound", "name": "Sensitivity to Light & Sound", "category": "Neurological", "weight": 3.0},

    # Skin Symptoms
    {"id": "skin_rash", "name": "Red Itchy Skin Rash / Hives", "category": "Skin", "weight": 2.5},
    {"id": "itching_pruritus", "name": "Intense Itching on Body", "category": "Skin", "weight": 2.0},
    {"id": "dry_scaly_skin", "name": "Dry, Flaky or Scaly Patches", "category": "Skin", "weight": 2.0},

    # Musculoskeletal & Cardio Symptoms
    {"id": "joint_pain_swelling", "name": "Joint Pain & Morning Stiffness", "category": "Joints/Muscles", "weight": 3.0},
    {"id": "severe_body_aches", "name": "Severe Generalized Body Ache", "category": "Joints/Muscles", "weight": 2.5},
    {"id": "retro_orbital_pain", "name": "Pain Behind the Eyes", "category": "Joints/Muscles", "weight": 3.5},
    {"id": "palpitations_rapid_pulse", "name": "Rapid Heartbeat / Palpitations", "category": "Cardio", "weight": 3.0},
    {"id": "frequent_urination", "name": "Frequent Urination (Polyuria)", "category": "Urinary", "weight": 3.0},
    {"id": "burning_urination", "name": "Burning Sensation when Urinating", "category": "Urinary", "weight": 3.5},
    {"id": "slow_healing_wounds", "name": "Slow Healing of Wounds/Cuts", "category": "Metabolic", "weight": 3.0}
]

# Database of Common Diseases with Clinical Information
DISEASES_DATABASE = [
    {
        "id": "dengue_fever",
        "name": "Dengue Fever",
        "category": "Vector-borne Viral Infection",
        "severity": "High",
        "urgency": "Urgent Medical Attention",
        "summary": "A viral infection transmitted by Aedes mosquitoes, causing sudden high fever, eye pain, and platelet drop.",
        "primary_symptoms": ["high_fever", "severe_body_aches", "retro_orbital_pain", "skin_rash"],
        "secondary_symptoms": ["nausea_vomiting", "fatigue_weakness", "chills_shivering"],
        "precautions": [
            "Get a Complete Blood Count (CBC) test to monitor platelets.",
            "Stay strictly hydrated with ORS, coconut water, and fluids.",
            "Avoid Aspirin/Ibuprofen to prevent bleeding; take Paracetamol only."
        ],
        "specialist": "Infectious Disease Specialist / General Physician",
        "diet": ["Papaya leaf extract", "Pomegranate juice", "Coconut water", "Dal soup"],
        "tests": ["Dengue NS1 Antigen Test", "Platelet Count (CBC)"],
        "clinical_insight": "Triad: High fever + Pain behind the eyes (retro-orbital) + Sudden platelet drop."
    },
    {
        "id": "common_cold",
        "name": "Viral Influenza / Common Cold",
        "category": "Upper Respiratory Infection",
        "severity": "Mild",
        "urgency": "Home Care & Rest",
        "summary": "Contagious viral infection affecting the upper respiratory tract.",
        "primary_symptoms": ["runny_stuffy_nose", "sneezing_fits", "sore_throat", "mild_fever"],
        "secondary_symptoms": ["dry_cough", "fatigue_weakness", "severe_headache"],
        "precautions": [
            "Take adequate rest and sleep.",
            "Inhale warm steam 2-3 times daily.",
            "Gargle with warm salt water for throat relief."
        ],
        "specialist": "General Physician / Family Doctor",
        "diet": ["Warm ginger tea", "Chicken/Veg soup", "Citrus fruits (Vitamin C)"],
        "tests": ["Clinical Examination", "Throat Swab (if fever persists > 5 days)"],
        "clinical_insight": "Triad: Runny nose + Frequent sneezing + Sore throat with mild fever."
    },
    {
        "id": "covid19",
        "name": "COVID-19 (Viral Pneumonitis)",
        "category": "Viral Respiratory Infection",
        "severity": "Moderate",
        "urgency": "Consult Doctor Soon",
        "summary": "Respiratory infection caused by SARS-CoV-2 coronavirus with loss of smell/taste.",
        "primary_symptoms": ["dry_cough", "high_fever", "loss_of_smell_taste", "fatigue_weakness"],
        "secondary_symptoms": ["shortness_of_breath", "sore_throat", "severe_body_aches"],
        "precautions": [
            "Monitor oxygen saturation (SpO2) with a pulse oximeter every 6 hours.",
            "Isolate in a well-ventilated room.",
            "Seek emergency care if SpO2 drops below 94%."
        ],
        "specialist": "Pulmonologist / General Physician",
        "diet": ["High protein meals (eggs, lentils)", "Zinc and Vitamin C", "Warm water"],
        "tests": ["RT-PCR Nasal Swab", "Rapid Antigen Test (RAT)"],
        "clinical_insight": "Triad: Loss of smell/taste (Anosmia) + Dry cough + Continuous fever."
    },
    {
        "id": "malaria",
        "name": "Malaria",
        "category": "Protozoal Parasitic Infection",
        "severity": "High",
        "urgency": "Urgent Medical Attention",
        "summary": "Parasitic disease transmitted by female Anopheles mosquitoes causing periodic fever paroxysms.",
        "primary_symptoms": ["high_fever", "chills_shivering", "excessive_sweating", "severe_headache"],
        "secondary_symptoms": ["nausea_vomiting", "severe_body_aches", "fatigue_weakness"],
        "precautions": [
            "Obtain immediate peripheral blood smear or Rapid Malaria Test.",
            "Complete full course of prescribed antimalarial medications.",
            "Drink plenty of fluids to counter dehydration."
        ],
        "specialist": "Infectious Disease Specialist",
        "diet": ["Easily digestible porridge (Khichdi)", "Fresh orange/lime juice"],
        "tests": ["Peripheral Blood Smear (Thick and Thin)", "Malaria Antigen Rapid Test"],
        "clinical_insight": "Triad: Cold stage (chills) -> Hot stage (high fever) -> Sweating stage."
    },
    {
        "id": "type_2_diabetes",
        "name": "Type 2 Diabetes Mellitus",
        "category": "Endocrine & Metabolic Disorder",
        "severity": "Moderate",
        "urgency": "Consult Doctor Soon",
        "summary": "Metabolic condition characterized by elevated blood glucose and insulin resistance.",
        "primary_symptoms": ["excessive_thirst", "frequent_urination", "unexplained_weight_loss", "fatigue_weakness"],
        "secondary_symptoms": ["slow_healing_wounds", "dizziness_vertigo", "dry_scaly_skin"],
        "precautions": [
            "Check Fasting Blood Sugar (FBS) and HbA1c levels.",
            "Engage in 30 minutes of daily moderate walking.",
            "Inspect feet daily to prevent diabetic ulcers."
        ],
        "specialist": "Endocrinologist / Diabetologist",
        "diet": ["Low Glycemic Index foods (oats, bitter gourd)", "High fiber vegetables"],
        "tests": ["Fasting Blood Sugar (FBS)", "Post-Prandial (PPBS)", "HbA1c Test"],
        "clinical_insight": "Triad: Polydipsia (thirst) + Polyuria (frequent urination) + Slow healing wounds."
    },
    {
        "id": "gerd_gastritis",
        "name": "GERD & Acid Peptic Disease",
        "category": "Gastrointestinal Disorder",
        "severity": "Mild",
        "urgency": "Home Care & Rest",
        "summary": "Stomach acid reflux into the esophagus causing burning chest sensation.",
        "primary_symptoms": ["acidity_heartburn", "nausea_vomiting", "stomach_bloating", "abdominal_cramps"],
        "secondary_symptoms": ["chest_tightness", "dry_cough", "sore_throat"],
        "precautions": [
            "Do not lie down for 2-3 hours after eating a meal.",
            "Elevate head of bed by 6 inches while sleeping.",
            "Avoid spicy, oily, and highly acidic foods."
        ],
        "specialist": "Gastroenterologist",
        "diet": ["Bananas, melons, apples", "Oatmeal and boiled vegetables", "Ginger tea"],
        "tests": ["Upper GI Endoscopy (if severe)", "H. pylori Test"],
        "clinical_insight": "Triad: Post-meal heartburn + Acid regurgitation + Relief after antacids."
    },
    {
        "id": "migraine",
        "name": "Migraine Headache",
        "category": "Neurological Disorder",
        "severity": "Moderate",
        "urgency": "Consult Doctor Soon",
        "summary": "Severe recurring throbbing unilateral headache with sensory sensitivity.",
        "primary_symptoms": ["severe_headache", "sensitivity_light_sound", "nausea_vomiting"],
        "secondary_symptoms": ["dizziness_vertigo", "fatigue_weakness"],
        "precautions": [
            "Rest in a quiet, dark, well-ventilated room.",
            "Apply an ice pack to the forehead or temples.",
            "Maintain a consistent sleep and meal routine."
        ],
        "specialist": "Neurologist",
        "diet": ["Magnesium-rich foods (spinach, almonds)", "Hydrating fluids"],
        "tests": ["Clinical Neurological Assessment", "Brain MRI (if atypical)"],
        "clinical_insight": "Triad: One-sided throbbing headache + Light/sound sensitivity + Nausea."
    },
    {
        "id": "jaundice_hepatitis",
        "name": "Viral Hepatitis (Infectious Jaundice)",
        "category": "Hepatic & Digestive Infection",
        "severity": "High",
        "urgency": "Urgent Medical Attention",
        "summary": "Inflammation of the liver causing bilirubin build-up and yellow discoloration.",
        "primary_symptoms": ["yellowing_eyes_skin", "dark_colored_urine", "loss_of_appetite", "fatigue_weakness"],
        "secondary_symptoms": ["nausea_vomiting", "abdominal_cramps", "mild_fever"],
        "precautions": [
            "Get Liver Function Tests (LFT) and viral markers immediately.",
            "Maintain strict bed rest until bilirubin normalizes.",
            "Strictly avoid alcohol and oily/greasy foods."
        ],
        "specialist": "Hepatologist / Gastroenterologist",
        "diet": ["Sugarcane juice", "Boiled rice with light dal", "Papaya and apples"],
        "tests": ["Liver Function Test (LFT - Bilirubin, SGOT, SGPT)", "Viral Hepatitis Serology"],
        "clinical_insight": "Triad: Yellow sclera/eyes + Dark tea-colored urine + Loss of appetite."
    },
    {
        "id": "uti_infection",
        "name": "Urinary Tract Infection (UTI)",
        "category": "Urogenital Bacterial Infection",
        "severity": "Moderate",
        "urgency": "Consult Doctor Soon",
        "summary": "Bacterial infection in the urinary tract causing pain and frequent urination.",
        "primary_symptoms": ["burning_urination", "frequent_urination", "dark_colored_urine"],
        "secondary_symptoms": ["mild_fever", "abdominal_cramps"],
        "precautions": [
            "Drink 3 to 4 liters of water daily to flush bacteria.",
            "Do not delay urination when the urge arises.",
            "Complete the full antibiotic course prescribed by your doctor."
        ],
        "specialist": "Urologist / General Physician",
        "diet": ["Unsweetened cranberry juice", "Barley water", "Probiotics (curd/yogurt)"],
        "tests": ["Routine Urine Examination & Microscopy", "Urine Culture and Sensitivity"],
        "clinical_insight": "Triad: Painful burning during urination (dysuria) + Urgency + Frequency."
    }
]

# Demo Scenarios for 1-Click Evaluation
DEMO_PRESETS = [
    {
        "title": "Dengue Fever",
        "symptoms": ["high_fever", "retro_orbital_pain", "severe_body_aches", "skin_rash"]
    },
    {
        "title": "Common Cold",
        "symptoms": ["runny_stuffy_nose", "sneezing_fits", "sore_throat", "mild_fever"]
    },
    {
        "title": "COVID-19",
        "symptoms": ["dry_cough", "high_fever", "loss_of_smell_taste", "fatigue_weakness"]
    },
    {
        "title": "Type 2 Diabetes",
        "symptoms": ["excessive_thirst", "frequent_urination", "unexplained_weight_loss", "slow_healing_wounds"]
    },
    {
        "title": "Jaundice / Hepatitis",
        "symptoms": ["yellowing_eyes_skin", "dark_colored_urine", "loss_of_appetite", "fatigue_weakness"]
    },
    {
        "title": "Migraine Attack",
        "symptoms": ["severe_headache", "sensitivity_light_sound", "nausea_vomiting"]
    },
    {
        "title": "Acid Reflux / GERD",
        "symptoms": ["acidity_heartburn", "nausea_vomiting", "stomach_bloating", "abdominal_cramps"]
    },
    {
        "title": "Urinary Tract Infection",
        "symptoms": ["burning_urination", "frequent_urination", "dark_colored_urine"]
    }
]
