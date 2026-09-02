/**
 * MedSense AI - Disease & Symptom Knowledge Base
 * Structured for Clinical Matching, Naive Bayes Inference, and Clinical Decision Support.
 */

const SYMPTOM_CATEGORIES = {
    general: { name: "General & Constitutional", icon: "🌡️" },
    respiratory: { name: "Respiratory & Chest", icon: "🫁" },
    digestive: { name: "Digestive & Abdominal", icon: "🥣" },
    neurological: { name: "Neurological & Mental", icon: "🧠" },
    skin: { name: "Skin & Allergies", icon: "✨" },
    musculoskeletal: { name: "Muscles & Joints", icon: "🦴" },
    cardio: { name: "Heart & Circulation", icon: "❤️" },
    urinary: { name: "Urinary & Endocrine", icon: "💧" }
};

const SYMPTOMS_LIST = [
    // General
    { id: "high_fever", name: "High Fever (>101°F)", category: "general", weight: 3, icon: "🔥" },
    { id: "mild_fever", name: "Mild / Low-grade Fever", category: "general", weight: 2, icon: "🌡️" },
    { id: "chills_shivering", name: "Chills & Shivering", category: "general", weight: 2.5, icon: "🥶" },
    { id: "fatigue_weakness", name: "Extreme Fatigue & Weakness", category: "general", weight: 2, icon: "🔋" },
    { id: "excessive_sweating", name: "Night Sweats / Profuse Sweating", category: "general", weight: 2, icon: "💦" },
    { id: "unexplained_weight_loss", name: "Unexplained Weight Loss", category: "general", weight: 2.5, icon: "⚖️" },
    { id: "excessive_thirst", name: "Excessive Thirst (Polydipsia)", category: "general", weight: 3, icon: "🥤" },
    { id: "loss_of_appetite", name: "Loss of Appetite (Anorexia)", category: "general", weight: 1.5, icon: "🍽️" },

    // Respiratory
    { id: "dry_cough", name: "Dry Cough", category: "respiratory", weight: 2, icon: "💨" },
    { id: "productive_cough", name: "Cough with Phlegm / Mucus", category: "respiratory", weight: 2.5, icon: "🤧" },
    { id: "shortness_of_breath", name: "Shortness of Breath / Wheezing", category: "respiratory", weight: 3.5, icon: "🫁" },
    { id: "chest_tightness", name: "Chest Congestion / Tightness", category: "respiratory", weight: 3, icon: "🎽" },
    { id: "sore_throat", name: "Sore Throat & Hoarseness", category: "respiratory", weight: 2, icon: "🗣️" },
    { id: "runny_stuffy_nose", name: "Runny or Stuffy Nose (Rhinorrhea)", category: "respiratory", weight: 1.5, icon: "👃" },
    { id: "sneezing_fits", name: "Frequent Sneezing", category: "respiratory", weight: 1.5, icon: "🤧" },
    { id: "loss_of_smell_taste", name: "Loss of Smell or Taste", category: "respiratory", weight: 3, icon: "👃" },

    // Digestive
    { id: "nausea_vomiting", name: "Nausea & Vomiting", category: "digestive", weight: 2.5, icon: "🤢" },
    { id: "watery_diarrhea", name: "Watery Diarrhea / Loose Stools", category: "digestive", weight: 2.5, icon: "🚽" },
    { id: "abdominal_cramps", name: "Abdominal Pain / Cramping", category: "digestive", weight: 2.5, icon: "⚡" },
    { id: "acidity_heartburn", name: "Acid Reflux / Heartburn / Regurgitation", category: "digestive", weight: 2.5, icon: "🔥" },
    { id: "stomach_bloating", name: "Stomach Bloating & Gas", category: "digestive", weight: 1.5, icon: "🎈" },
    { id: "yellowing_eyes_skin", name: "Yellowing of Skin & Eyes (Jaundice)", category: "digestive", weight: 4, icon: "🟡" },
    { id: "dark_colored_urine", name: "Dark Coloured Urine", category: "digestive", weight: 3, icon: "🟤" },
    { id: "constipation", name: "Severe Constipation", category: "digestive", weight: 2, icon: "🛑" },

    // Neurological
    { id: "severe_headache", name: "Throbbing / Severe Headache", category: "neurological", weight: 2.5, icon: "🤕" },
    { id: "dizziness_vertigo", name: "Dizziness & Lightheadedness", category: "neurological", weight: 2, icon: "💫" },
    { id: "sensitivity_light_sound", name: "Sensitivity to Light & Sound (Photophobia)", category: "neurological", weight: 3, icon: "💡" },
    { id: "neck_stiffness", name: "Stiff Neck with High Fever", category: "neurological", weight: 4, icon: "🧣" },
    { id: "confusion_disorientation", name: "Mental Confusion / Brain Fog", category: "neurological", weight: 3.5, icon: "🌀" },
    { id: "tremors_shaky_hands", name: "Hand Tremors / Shakiness", category: "neurological", weight: 2.5, icon: "✋" },

    // Skin & Allergies
    { id: "skin_rash", name: "Red Itchy Skin Rash / Hives", category: "skin", weight: 2.5, icon: "🔴" },
    { id: "itching_pruritus", name: "Intense Itching all over Body", category: "skin", weight: 2, icon: "✋" },
    { id: "dry_scaly_skin", name: "Dry, Flaky or Scaly Patches", category: "skin", weight: 2, icon: "🍂" },
    { id: "swelling_face_eyes", name: "Swelling around Eyes / Face / Lips", category: "skin", weight: 3.5, icon: "👁️" },
    { id: "pimples_pus_lesions", name: "Acne, Pimples or Pus Lesions", category: "skin", weight: 2, icon: "🫧" },

    // Musculoskeletal
    { id: "joint_pain_swelling", name: "Joint Pain & Morning Stiffness", category: "musculoskeletal", weight: 3, icon: "🦴" },
    { id: "severe_body_aches", name: "Severe Generalized Body & Muscle Ache", category: "musculoskeletal", weight: 2.5, icon: "⚡" },
    { id: "back_pain", name: "Lower Back Pain", category: "musculoskeletal", weight: 2, icon: "🚶" },
    { id: "retro_orbital_pain", name: "Pain Behind the Eyes", category: "musculoskeletal", weight: 3.5, icon: "👀" },

    // Cardio & Circulatory
    { id: "palpitations_rapid_pulse", name: "Rapid Heartbeat / Palpitations", category: "cardio", weight: 3, icon: "💓" },
    { id: "chest_pressure_pain", name: "Crushing Chest Pain / Pressure", category: "cardio", weight: 4.5, icon: "💔" },
    { id: "swollen_ankles_legs", name: "Swelling in Ankles or Legs (Edema)", category: "cardio", weight: 2.5, icon: "🦶" },
    { id: "cold_hands_feet", name: "Cold Hands and Feet / Pale Skin", category: "cardio", weight: 2, icon: "🧊" },

    // Urinary & Metabolic
    { id: "frequent_urination", name: "Frequent Urination (Polyuria / Night Urination)", category: "urinary", weight: 3, icon: "🚽" },
    { id: "burning_urination", name: "Painful / Burning Sensation when Urinating", category: "urinary", weight: 3.5, icon: "🔥" },
    { id: "slow_healing_wounds", name: "Slow Healing of Wounds / Cuts", category: "urinary", weight: 3, icon: "🩹" },
    { id: "cloudy_foul_urine", name: "Cloudy or Strong-smelling Urine", category: "urinary", weight: 3, icon: "🧪" }
];

const DISEASES_DATABASE = [
    {
        id: "dengue_fever",
        name: "Dengue Fever",
        category: "Vector-borne Viral Infection",
        severity: "High",
        urgency: "Urgent Medical Attention",
        summary: "A mosquito-borne viral infection caused by the Dengue virus (Flaviviridae), transmitted primarily by female Aedes aegypti mosquitoes.",
        primarySymptoms: ["high_fever", "severe_body_aches", "retro_orbital_pain", "skin_rash"],
        secondarySymptoms: ["nausea_vomiting", "fatigue_weakness", "chills_shivering", "loss_of_appetite"],
        precautions: [
            "Get a Complete Blood Count (CBC) to monitor platelet levels immediately.",
            "Stay strictly hydrated with electrolyte fluids, ORS, and coconut water.",
            "Avoid NSAIDs (like Ibuprofen/Aspirin) as they increase bleeding risks; use Paracetamol only under doctor supervision.",
            "Use mosquito nets and repellents to prevent transmission to family members."
        ],
        recommendedSpecialist: "Infectious Disease Specialist / General Physician",
        dietaryAdvice: {
            recommended: ["Papaya leaf extract/juice (supports platelets)", "Pomegranate juice", "Coconut water", "Light lentil soup (Dal)", "Hydrating fruits"],
            avoid: ["Oily, spicy foods", "Caffeinated drinks", "Aspirin-containing foods", "Raw seafood"]
        },
        diagnosticTests: ["Dengue NS1 Antigen Test", "Dengue IgM/IgG Antibody Test", "Platelet Count (CBC)"],
        clinicalInsight: "Key differentiator: Characterized by the triad of high fever, retro-orbital eye pain, and severe bone/muscle pain ('Breakbone fever') with platelet reduction."
    },
    {
        id: "common_cold_flu",
        name: "Viral Influenza / Common Cold",
        category: "Upper Respiratory Infection",
        severity: "Mild",
        urgency: "Home Care & Rest",
        summary: "Acute contagious viral infection of the respiratory tract caused by Influenza viruses, Rhinovirus, or Coronaviruses.",
        primarySymptoms: ["runny_stuffy_nose", "sneezing_fits", "sore_throat", "mild_fever"],
        secondarySymptoms: ["dry_cough", "fatigue_weakness", "severe_headache", "chills_shivering"],
        precautions: [
            "Get plenty of bed rest and sleep to boost immune function.",
            "Inhale steam with eucalyptus oil or menthol 2-3 times daily.",
            "Gargle with warm salt water twice a day for throat relief.",
            "Wear a mask to protect vulnerable family members."
        ],
        recommendedSpecialist: "General Physician / Family Doctor",
        dietaryAdvice: {
            recommended: ["Warm herbal teas (ginger, tulsi, lemon-honey)", "Chicken/Vegetable broth", "Citrus fruits (Vitamin C)", "Warm turmeric milk"],
            avoid: ["Cold water / iced beverages", "Deep fried snacks", "Dairy products if phlegm is excessive"]
        },
        diagnosticTests: ["Clinical Examination", "Rapid Influenza Diagnostic Test (if fever persists > 5 days)"],
        clinicalInsight: "Key differentiator: Predominance of upper airway symptoms (sneezing, runny nose, sore throat) with mild to moderate constitutional fatigue."
    },
    {
        id: "covid19",
        name: "COVID-19 (Viral Pneumonitis)",
        category: "Viral Respiratory Infection",
        severity: "Moderate",
        urgency: "Consult Doctor Soon",
        summary: "Respiratory illness caused by SARS-CoV-2 coronavirus with systemic manifestations.",
        primarySymptoms: ["dry_cough", "high_fever", "loss_of_smell_taste", "fatigue_weakness"],
        secondarySymptoms: ["shortness_of_breath", "sore_throat", "severe_body_aches", "severe_headache"],
        precautions: [
            "Monitor oxygen saturation (SpO2) with a pulse oximeter every 6 hours.",
            "Isolate in a well-ventilated room for at least 7-10 days.",
            "Seek emergency care if SpO2 drops below 94% or shortness of breath worsens.",
            "Stay well hydrated and maintain adequate rest."
        ],
        recommendedSpecialist: "Pulmonologist / General Physician",
        dietaryAdvice: {
            recommended: ["High-protein meals (eggs, paneer, lentils)", "Zinc and Vitamin C rich foods", "Warm soups and herbal concoctions"],
            avoid: ["Sugary carbonated beverages", "Ultra-processed junk food", "Alcohol and smoking"]
        },
        diagnosticTests: ["RT-PCR Nasal/Throat Swab", "Rapid Antigen Test (RAT)", "Chest CT Scan (if hypoxic)"],
        clinicalInsight: "Key differentiator: Anosmia (loss of smell) and ageusia (loss of taste) combined with dry cough and progressive fever are classic pathognomonic markers."
    },
    {
        id: "malaria",
        name: "Malaria",
        category: "Protozoal Parasitic Infection",
        severity: "High",
        urgency: "Urgent Medical Attention",
        summary: "Life-threatening disease caused by Plasmodium parasites transmitted through the bites of infected female Anopheles mosquitoes.",
        primarySymptoms: ["high_fever", "chills_shivering", "excessive_sweating", "severe_headache"],
        secondarySymptoms: ["nausea_vomiting", "severe_body_aches", "fatigue_weakness", "loss_of_appetite"],
        precautions: [
            "Obtain immediate peripheral blood smear or Rapid Diagnostic Test (RDT).",
            "Complete the full course of prescribed antimalarial medications (e.g., ACT regimen).",
            "Maintain fluid balance to counter high sweat-induced dehydration.",
            "Eliminate standing water around residence to prevent mosquito breeding."
        ],
        recommendedSpecialist: "Infectious Disease Specialist / General Physician",
        dietaryAdvice: {
            recommended: ["Easily digestible carbohydrates (khichdi, oats)", "Fresh orange/sweet lime juice", "High calorie fluids"],
            avoid: ["Greasy spicy meals", "High-fat dairy", "Raw unpeeled foods"]
        },
        diagnosticTests: ["Peripheral Blood Smear (Thick and Thin)", "Malaria Antigen Rapid Test (Pf/Pv)", "Complete Blood Count"],
        clinicalInsight: "Key differentiator: Classic febrile paroxysm cycle (cold stage with violent chills -> hot stage with high fever -> sweating stage with defervescence)."
    },
    {
        id: "type_2_diabetes",
        name: "Type 2 Diabetes Mellitus",
        category: "Endocrine & Metabolic Disorder",
        severity: "Moderate",
        urgency: "Consult Doctor Soon",
        summary: "Chronic metabolic condition characterized by insulin resistance and relative insulin deficiency resulting in persistent hyperglycemia.",
        primarySymptoms: ["excessive_thirst", "frequent_urination", "unexplained_weight_loss", "fatigue_weakness"],
        secondarySymptoms: ["slow_healing_wounds", "dizziness_vertigo", "dry_scaly_skin"],
        precautions: [
            "Check Fasting Blood Sugar (FBS) and HbA1c levels promptly.",
            "Adopt daily 30-minute moderate aerobic exercise (brisk walking).",
            "Inspect feet daily for minor cuts or blisters to prevent diabetic neuropathy ulcers.",
            "Adhere strictly to oral hypoglycemic agents or insulin therapy."
        ],
        recommendedSpecialist: "Endocrinologist / Diabetologist",
        dietaryAdvice: {
            recommended: ["Low Glycemic Index foods (whole oats, quinoa, bitter gourd)", "High fiber vegetables (spinach, broccoli)", "Nuts and seeds"],
            avoid: ["Refined sugars and sweets", "White bread, white rice", "Sweetened sodas and fruit juices"]
        },
        diagnosticTests: ["Fasting Blood Sugar (FBS)", "Post-Prandial Blood Sugar (PPBS)", "HbA1c (3-month Glycated Hemoglobin)", "Lipid Profile"],
        clinicalInsight: "Key differentiator: The classic '3 Ps' triad (Polydipsia = thirst, Polyuria = urination, Polyphagia/weight loss) alongside slow wound healing."
    },
    {
        id: "gerd_gastritis",
        name: "GERD & Acid Peptic Disease",
        category: "Gastrointestinal Disorder",
        severity: "Mild",
        urgency: "Home Care & Rest",
        summary: "Gastroesophageal Reflux Disease occurs when stomach acid frequently flows back into the tube connecting mouth and stomach (esophagus).",
        primarySymptoms: ["acidity_heartburn", "nausea_vomiting", "stomach_bloating", "abdominal_cramps"],
        secondarySymptoms: ["chest_tightness", "dry_cough", "sore_throat"],
        precautions: [
            "Do not lie down for at least 2 to 3 hours after eating a meal.",
            "Elevate the head of your bed by 6-9 inches while sleeping.",
            "Eat smaller, more frequent meals rather than large heavy dinners.",
            "Avoid tight-fitting waist clothing that increases intra-abdominal pressure."
        ],
        recommendedSpecialist: "Gastroenterologist / General Physician",
        dietaryAdvice: {
            recommended: ["Non-citrus fruits (bananas, melons, apples)", "Oatmeal and brown rice", "Ginger tea", "Almond milk", "Boiled vegetables"],
            avoid: ["Deep-fried/fatty foods", "Tomatoes and citrus juices", "Coffee and carbonated drinks", "Chocolates and mint"]
        },
        diagnosticTests: ["Upper GI Endoscopy (if refractory)", "Helicobacter pylori Stool Antigen / Breath Test"],
        clinicalInsight: "Key differentiator: Postprandial substernal burning sensation ('heartburn') aggravated by recumbency, relieved by antacids."
    },
    {
        id: "bronchial_asthma",
        name: "Bronchial Asthma",
        category: "Chronic Respiratory Disease",
        severity: "High",
        urgency: "Consult Doctor Soon",
        summary: "Chronic inflammatory disease of the airways causing hyper-responsiveness, airflow obstruction, and bronchial spasms.",
        primarySymptoms: ["shortness_of_breath", "chest_tightness", "dry_cough"],
        secondarySymptoms: ["fatigue_weakness", "productive_cough", "sneezing_fits"],
        precautions: [
            "Always carry a prescribed fast-acting bronchodilator rescue inhaler (e.g., Salbutamol).",
            "Identify and avoid triggers: pollen, cold air, smoke, dust mites, and pet dander.",
            "Use a Peak Expiratory Flow (PEF) meter to track lung capacity daily.",
            "Maintain indoor air filtration / air purifiers if living in polluted areas."
        ],
        recommendedSpecialist: "Pulmonologist / Chest Specialist",
        dietaryAdvice: {
            recommended: ["Magnesium-rich foods (spinach, pumpkin seeds)", "Omega-3 fatty acids (flaxseeds, walnuts)", "Warm water throughout the day"],
            avoid: ["Cold drinks and ice creams", "Foods with sulfites/preservatives (dried fruits, wine)", "Heavy dairy before sleep"]
        },
        diagnosticTests: ["Spirometry / Pulmonary Function Test (PFT)", "Fractional Exhaled Nitric Oxide (FeNO)", "Chest X-Ray"],
        clinicalInsight: "Key differentiator: Episodic reversible expiratory wheeze, nocturnal cough, and chest tightness triggered by allergens or cold air."
    },
    {
        id: "migraine",
        name: "Migraine with/without Aura",
        category: "Neurological Disorder",
        severity: "Moderate",
        urgency: "Consult Doctor Soon",
        summary: "Neurovascular disorder characterized by recurrent attacks of severe throbbing, unilateral headache often accompanied by sensory disturbances.",
        primarySymptoms: ["severe_headache", "sensitivity_light_sound", "nausea_vomiting"],
        secondarySymptoms: ["dizziness_vertigo", "fatigue_weakness", "confusion_disorientation"],
        precautions: [
            "Rest in a quiet, dark, well-ventilated room during an acute attack.",
            "Apply a cold ice pack or damp cloth to the forehead or temples.",
            "Maintain a consistent sleep schedule and do not skip meals.",
            "Keep a migraine diary to track personal triggers (caffeine withdrawal, screen fatigue, stress)."
        ],
        recommendedSpecialist: "Neurologist / Pain Specialist",
        dietaryAdvice: {
            recommended: ["Magnesium & Vitamin B2 (Riboflavin) rich foods", "Hydrating herbal teas", "Salmon and leafy greens"],
            avoid: ["Aged cheeses", "Processed meats (nitrates)", "Monosodium glutamate (MSG)", "Excessive or sudden caffeine withdrawal"]
        },
        diagnosticTests: ["Clinical Neurological Assessment", "Brain MRI/CT (only to rule out secondary organic pathologies)"],
        clinicalInsight: "Key differentiator: Unilateral pulsating/throbbing headache with photo/phonophobia and nausea, worsened by routine physical activity."
    },
    {
        id: "urinary_tract_infection",
        name: "Urinary Tract Infection (UTI / Cystitis)",
        category: "Urogenital Bacterial Infection",
        severity: "Moderate",
        urgency: "Consult Doctor Soon",
        summary: "Bacterial infection commonly caused by Escherichia coli affecting the bladder, urethra, or kidneys.",
        primarySymptoms: ["burning_urination", "frequent_urination", "cloudy_foul_urine"],
        secondarySymptoms: ["mild_fever", "abdominal_cramps", "back_pain", "nausea_vomiting"],
        precautions: [
            "Drink 3 to 4 liters of water daily to flush bacteria from the urinary tract.",
            "Do not delay urination; empty bladder fully when the urge arises.",
            "Complete full course of prescribed oral antibiotics to avoid resistant recurrence.",
            "Practice proper genital hygiene (wipe front to back)."
        ],
        recommendedSpecialist: "Urologist / General Physician",
        dietaryAdvice: {
            recommended: ["Unsweetened Pure Cranberry juice (proanthocyanidins prevent bacterial adhesion)", "Barley water", "Probiotics (curd/yogurt)"],
            avoid: ["Alcohol and coffee (bladder irritants)", "Artificial sweeteners", "Excessive spicy seasonings"]
        },
        diagnosticTests: ["Routine Urine Examination & Microscopy", "Urine Culture and Sensitivity (Urine C&S)", "Ultrasound KUB (if recurrent)"],
        clinicalInsight: "Key differentiator: Dysuria (burning during micturition), urinary urgency and frequency with cloudy urine."
    },
    {
        id: "acute_gastroenteritis",
        name: "Acute Food Poisoning / Gastroenteritis",
        category: "Gastrointestinal Infection",
        severity: "Moderate",
        urgency: "Consult Doctor Soon",
        summary: "Inflammation of the stomach and intestines caused by contaminated food or water containing bacterial toxins (Salmonella, E. coli, Norovirus).",
        primarySymptoms: ["watery_diarrhea", "nausea_vomiting", "abdominal_cramps", "mild_fever"],
        secondarySymptoms: ["fatigue_weakness", "dizziness_vertigo", "loss_of_appetite", "chills_shivering"],
        precautions: [
            "Begin Oral Rehydration Salts (ORS) solution immediately after every loose motion.",
            "Avoid solid food during initial hours; transition to BRAT diet (Banana, Rice, Applesauce, Toast).",
            "Seek urgent attention if unable to keep liquids down or if blood appears in stool.",
            "Wash hands thoroughly with soap before food handling."
        ],
        recommendedSpecialist: "Gastroenterologist / General Physician",
        dietaryAdvice: {
            recommended: ["ORS electrolyte solution", "Rice gruel with salt (Kanji)", "Steamed mashed potatoes", "Coconut water", "Clear broth"],
            avoid: ["Dairy/milk products (temporary lactose intolerance)", "Oily fast foods", "Raw vegetables/salads", "Fizzy sodas"]
        },
        diagnosticTests: ["Stool Routine and Microscopy", "Stool Culture", "Serum Electrolytes (Na+, K+, Cl-)"],
        clinicalInsight: "Key differentiator: Sudden acute onset of concurrent vomiting and watery diarrhea following ingestion of questionable food."
    },
    {
        id: "hypertension_crisis",
        name: "Hypertension / Cardiovascular Stress",
        category: "Cardiovascular Condition",
        severity: "High",
        urgency: "Urgent Medical Attention",
        summary: "Elevated systemic arterial pressure causing excessive workload on the heart and arterial vascular beds.",
        primarySymptoms: ["severe_headache", "dizziness_vertigo", "palpitations_rapid_pulse"],
        secondarySymptoms: ["chest_tightness", "shortness_of_breath", "fatigue_weakness", "swollen_ankles_legs"],
        precautions: [
            "Measure Blood Pressure immediately using an automated or manual sphygmomanometer.",
            "Rest quietly in a seated position for 15 minutes and avoid stress or exertion.",
            "Seek emergency room triage if blood pressure exceeds 180/120 mmHg (Hypertensive Urgency/Crisis).",
            "Reduce dietary sodium (< 2g/day) and take prescribed antihypertensive drugs consistently."
        ],
        recommendedSpecialist: "Cardiologist / General Physician",
        dietaryAdvice: {
            recommended: ["DASH Diet (Dietary Approaches to Stop Hypertension)", "Potassium-rich foods (bananas, avocados, sweet potatoes)", "Garlic, beetroots", "Whole grains"],
            avoid: ["Pickles, papads, and high-sodium processed foods", "Red meat and trans fats", "Cigarette smoking and energy drinks"]
        },
        diagnosticTests: ["Serial BP Monitoring / 24-hr Ambulatory BP", "12-Lead Electrocardiogram (ECG)", "Echocardiogram (2D Echo)", "Serum Creatinine"],
        clinicalInsight: "Key differentiator: Occipital morning headache, dizziness, and palpitations coupled with elevated resting systolic/diastolic blood pressure."
    },
    {
        id: "allergic_dermatitis",
        name: "Allergic Dermatitis / Eczema / Urticaria",
        category: "Dermatological & Immune Reaction",
        severity: "Mild",
        urgency: "Home Care & Rest",
        summary: "Immunologically mediated inflammatory skin condition resulting from contact allergens, airborne antigens, or systemic hypersensitivity.",
        primarySymptoms: ["skin_rash", "itching_pruritus", "dry_scaly_skin"],
        secondarySymptoms: ["swelling_face_eyes", "pimples_pus_lesions", "mild_fever"],
        precautions: [
            "Do not scratch the affected skin area to avoid secondary bacterial infection (Impetiginization).",
            "Apply fragrance-free bland emollient moisturizers or calamine lotion immediately after bathing.",
            "Take an over-the-counter anti-histaminic (e.g., Cetirizine) if recommended by a doctor.",
            "Wash clothes with hypoallergenic, fragrance-free detergent."
        ],
        recommendedSpecialist: "Dermatologist / Allergist",
        dietaryAdvice: {
            recommended: ["Anti-inflammatory foods (turmeric, green tea, berries)", "Plenty of water", "Flaxseed oil"],
            avoid: ["Known personal food allergens (peanuts, shellfish, gluten if allergic)", "Synthetic food coloring and MSG"]
        },
        diagnosticTests: ["Skin Prick Test (Allergy Panel)", "Total Serum IgE Test", "Patch Test"],
        clinicalInsight: "Key differentiator: Erythematous pruritic plaques with intense itching, without severe constitutional systemic toxicity."
    },
    {
        id: "viral_hepatitis_jaundice",
        name: "Viral Hepatitis (Infectious Jaundice)",
        category: "Hepatic & Digestive Infection",
        severity: "High",
        urgency: "Urgent Medical Attention",
        summary: "Inflammation of the liver tissue caused by Hepatitis viruses (A, E transmitted enterically or B, C via blood/fluids) leading to impaired bilirubin clearance.",
        primarySymptoms: ["yellowing_eyes_skin", "dark_colored_urine", "loss_of_appetite", "fatigue_weakness"],
        secondarySymptoms: ["nausea_vomiting", "abdominal_cramps", "mild_fever", "itching_pruritus"],
        precautions: [
            "Get a Liver Function Test (LFT) and viral serology markers immediately.",
            "Maintain strict bed rest until serum transaminases and bilirubin levels normalize.",
            "Strictly avoid all alcohol and hepatotoxic medications (including unregulated herbal remedies).",
            "Ensure safe, boiled drinking water and sanitary food preparation."
        ],
        recommendedSpecialist: "Hepatologist / Gastroenterologist",
        dietaryAdvice: {
            recommended: ["High carbohydrate, easily absorbable meals (sugarcane juice, glucose water, boiled rice)", "Papaya, apples", "Clear coconut water"],
            avoid: ["Oily, deep-fried foods and rich curries", "Heavy proteins during acute jaundice phase", "Alcohol and packaged snacks"]
        },
        diagnosticTests: ["Liver Function Test (Serum Bilirubin, SGOT/AST, SGPT/ALT, Alk Phos)", "Viral Serology (HBsAg, Anti-HCV, IgM Anti-HAV, IgM Anti-HEV)", "Ultrasound Abdomen"],
        clinicalInsight: "Key differentiator: Icteric sclera (yellow eyes), bilirubinuria (dark tea-colored urine), and clay-colored stools caused by cholestasis."
    },
    {
        id: "rheumatoid_arthritis",
        name: "Rheumatoid Arthritis / Inflammatory Polyarthritis",
        category: "Autoimmune Musculoskeletal Disorder",
        severity: "Moderate",
        urgency: "Consult Doctor Soon",
        summary: "Chronic systemic autoimmune disease characterized by symmetrical polyarticular inflammation, synovial hypertrophy, and joint destruction.",
        primarySymptoms: ["joint_pain_swelling", "severe_body_aches", "fatigue_weakness"],
        secondarySymptoms: ["mild_fever", "loss_of_appetite", "dry_scaly_skin"],
        precautions: [
            "Consult a rheumatologist early for Disease-Modifying Antirheumatic Drugs (DMARDs) to prevent joint deformity.",
            "Perform gentle low-impact joint range-of-motion exercises (swimming, warm water therapy).",
            "Apply warm compresses to stiff morning joints and cold packs during acute inflammatory flares.",
            "Maintain an ergonomic posture and use joint-protective assistive aids."
        ],
        recommendedSpecialist: "Rheumatologist / Orthopedic Specialist",
        dietaryAdvice: {
            recommended: ["Mediterranean diet rich in Extra Virgin Olive Oil", "Fatty fish (Salmon, Mackerel) for Omega-3", "Walnuts, chia seeds", "Turmeric and ginger"],
            avoid: ["Red meat and processed sausages", "Refined sugars and trans fats", "Excessive nightshade vegetables if personally sensitive"]
        },
        diagnosticTests: ["Rheumatoid Factor (RF)", "Anti-CCP (Anti-Cyclic Citrullinated Peptide Antibody)", "C-Reactive Protein (CRP) & ESR", "Joint X-Ray / MRI"],
        clinicalInsight: "Key differentiator: Symmetrical small joint involvement (hands/wrists/feet) with morning stiffness lasting longer than 45-60 minutes."
    },
    {
        id: "pneumonia",
        name: "Bacterial / Community-Acquired Pneumonia",
        category: "Lower Respiratory Infection",
        severity: "Critical",
        urgency: "Urgent Medical Attention",
        summary: "Infection that inflames air sacs in one or both lungs, which may fill with fluid or pus (Streptococcus pneumoniae, Klebsiella).",
        primarySymptoms: ["productive_cough", "high_fever", "shortness_of_breath", "chest_tightness"],
        secondarySymptoms: ["chills_shivering", "severe_body_aches", "fatigue_weakness", "excessive_sweating"],
        precautions: [
            "Undergo immediate Chest Radiography (X-ray) and Sputum Culture examination.",
            "Administer targeted antibiotics or hospitalization based on CURB-65 pneumonia severity score.",
            "Monitor pulse oximetry continuously; provide oxygen therapy if SpO2 < 92%.",
            "Practice incentive spirometry and deep breathing exercises."
        ],
        recommendedSpecialist: "Pulmonologist / Critical Care Specialist",
        dietaryAdvice: {
            recommended: ["Warm nourishing protein soups", "Electrolyte fluids and warm water", "Easily digestible khichdi/porridge"],
            avoid: ["Cold dairy, refrigerated desserts", "Hard-to-digest heavy meats", "Tobacco smoke exposure"]
        },
        diagnosticTests: ["Chest X-Ray (PA View)", "Sputum Gram Stain & Culture", "Complete Blood Count (WBC & Neutrophil %)", "C-Reactive Protein (CRP)"],
        clinicalInsight: "Key differentiator: High fever with chills, productive purulent/rusty sputum, and auscultatory lung crepitations/consolidation."
    }
];

// Demo Presets for 1-Click Evaluation
const DEMO_PRESETS = [
    {
        title: "Dengue Fever Case",
        description: "High fever + Retro-orbital eye pain + Severe body aches + Rash",
        symptoms: ["high_fever", "retro_orbital_pain", "severe_body_aches", "skin_rash"]
    },
    {
        title: "Common Viral Cold",
        description: "Runny nose + Sneezing + Sore throat + Mild fever",
        symptoms: ["runny_stuffy_nose", "sneezing_fits", "sore_throat", "mild_fever"]
    },
    {
        title: "COVID-19 Case",
        description: "Dry cough + High fever + Loss of smell/taste + Fatigue",
        symptoms: ["dry_cough", "high_fever", "loss_of_smell_taste", "fatigue_weakness"]
    },
    {
        title: "Type 2 Diabetes Warning",
        description: "Excessive thirst + Frequent urination + Weight loss + Slow healing",
        symptoms: ["excessive_thirst", "frequent_urination", "unexplained_weight_loss", "slow_healing_wounds"]
    },
    {
        title: "Jaundice / Viral Hepatitis",
        description: "Yellow eyes/skin + Dark urine + Loss of appetite + Fatigue",
        symptoms: ["yellowing_eyes_skin", "dark_colored_urine", "loss_of_appetite", "fatigue_weakness"]
    },
    {
        title: "GERD / Acid Peptic",
        description: "Acid reflux + Heartburn + Nausea + Stomach bloating",
        symptoms: ["acidity_heartburn", "nausea_vomiting", "stomach_bloating", "abdominal_cramps"]
    },
    {
        title: "Urinary Tract Infection",
        description: "Burning micturition + Frequent urination + Cloudy urine",
        symptoms: ["burning_urination", "frequent_urination", "cloudy_foul_urine"]
    },
    {
        title: "Migraine Attack",
        description: "Severe throbbing headache + Light/sound sensitivity + Nausea",
        symptoms: ["severe_headache", "sensitivity_light_sound", "nausea_vomiting"]
    }
];
