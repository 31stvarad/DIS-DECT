# 🩺 MedSense AI: Technical & Architectural Documentation

> **Project Title:** Intelligent Clinical Disease Detection and Explainable Triage System  
> **Domain:** Healthcare Informatics / Applied Machine Learning & Web Technologies  
> **Core Concepts:** Probabilistic Inference, Multinomial Naive Bayes, Vector Space Model, Explainable AI (XAI), Clinical Decision Support.

---

## 1. Project Abstract & Motivation

### Abstract
In modern healthcare delivery, patients frequently struggle with self-triage—misinterpreting early symptoms, delaying clinical visits, or consulting inappropriate medical specialists. **MedSense AI** is a lightweight, explainable, and zero-latency clinical decision support system designed to predict potential health conditions based on self-reported patient symptoms.

By applying **Multinomial Naive Bayes and weighted probabilistic vector matching**, the system generates a primary diagnosis with a confidence percentage, produces ranked differential diagnoses, assigns a clinical severity triage rating (Mild to Critical), prescribes precautionary care, and directs the patient to the relevant medical specialist.

### Key Architectural Strengths:
- **100% Explainable (XAI):** Unlike "black-box" deep learning models, every calculation in this project is mathematically transparent and verifiable.
- **Zero-Dependency Frontend:** Runs instantly in any standard browser without server latency or network failure risks.
- **Dual Architecture:** Features both a client-side web application and an offline Python Scikit-Learn machine learning pipeline.

---

## 2. System Architecture & Data Flow

```
+-------------------------------------------------------------------------------+
|                             USER / PATIENT                                    |
|   Selects symptoms via search, categorized body system tabs, or 1-click presets|
+-------------------------------------------------------------------------------+
                                      │
                                      ▼
+───────────────────────────────────────────────────────────────────────────────+
|                           1. INPUT VECTORIZER                                 |
|   Encodes selected symptoms into a weighted binary feature vector:             |
|   X = [s_1, s_2, ..., s_n],  where each s_i has a clinical weight w_i        |
+───────────────────────────────────────────────────────────────────────────────+
                                      │
                                      ▼
+───────────────────────────────────────────────────────────────────────────────+
|                2. PROBABILISTIC INFERENCE & MATCHING ENGINE                   |
|   • Computes Posterior Probability: P(Disease | Symptoms)                     |
|   • Calculates Weighted Overlap: Primary (1.0x) + Secondary (0.45x)           |
|   • Applies Laplace smoothing / baseline normalization                        |
+───────────────────────────────────────────────────────────────────────────────+
                                      │
                                      ▼
+───────────────────────────────────────────────────────────────────────────────+
|                    3. DIFFERENTIAL RANKING & TRIAGE ENGINE                    |
|   • Top Rank: Primary Predicted Disease + Confidence Score Gauge              |
|   • Ranks 2-4: Differential Diagnoses (Alternative possibilities)             |
|   • Assigns Triage Severity (Mild / Moderate / High / Critical)               |
+───────────────────────────────────────────────────────────────────────────────+
                                      │
                                      ▼
+───────────────────────────────────────────────────────────────────────────────+
|                       4. CLINICAL OUTPUT & ACTION PLAN                        |
|   • Recommended Specialist Doctor (e.g. Pulmonologist, Neurologist)           |
|   • Clinical Precautions, Dietary Guidance & Suggested Diagnostic Lab Tests   |
|   • Exportable Medical Summary Report (PDF/Print)                             |
+───────────────────────────────────────────────────────────────────────────────+
```

---

## 3. Mathematical & Algorithmic Formulation

### 3.1 Bayes' Theorem in Clinical Diagnosis
Bayes' Theorem provides a mathematical framework for updating our belief in a disease hypothesis $D_k$ given observed symptoms $S$:

$$P(D_k | S) = \frac{P(S | D_k) \cdot P(D_k)}{P(S)}$$

Where:
- **$P(D_k | S)$ (Posterior Probability):** Probability that the patient has disease $D_k$ given the observed symptoms $S$.
- **$P(S | D_k)$ (Likelihood):** Probability that a patient with disease $D_k$ exhibits symptoms $S$.
- **$P(D_k)$ (Prior Probability):** Baseline prevalence of disease $D_k$ in the general population.
- **$P(S)$ (Evidence / Marginal):** Total probability of observing the symptoms across all diseases.

### 3.2 Naive Conditional Independence Assumption
Under the Naive Bayes assumption, individual symptoms are assumed to be conditionally independent given the disease:

$$P(S | D_k) = \prod_{i=1}^{n} P(s_i | D_k)$$

### 3.3 Clinical Specificity Weighting
In actual medical pathology, symptoms differ dramatically in diagnostic significance:
- **High Specificity ($w = 4.0$):** Jaundice (yellowing eyes/skin) $\to$ points directly to liver/biliary illness.
- **Moderate Specificity ($w = 2.5 - 3.5$):** Retro-orbital eye pain, Loss of smell/taste, Wheezing.
- **Low/Generic Specificity ($w = 1.5 - 2.0$):** Mild headache, fatigue, mild loss of appetite.

The weighted overlap matching score is calculated as:

$$\text{Score}(D_k) = \left( \frac{\text{Matched Primary Count}}{\text{Total Primary Count}} \times 0.65 \right) + \left( \frac{\sum w_{\text{matched}}}{\sum w_{\text{total\_selected}}} \times 0.35 \right)$$

---

## 4. Software Implementation

### 4.1 Frontend Architecture
- **HTML5 & Vanilla ES6+ JavaScript:** Ultra-fast client-side vector inference with zero external library overhead.
- **CSS3 Design System:** Responsive dark/light theme, glassmorphic cards, accessible interactive components, print media stylesheet for medical summary generation.

### 4.2 Python Engine & Desktop GUI
- **`dataset.py`:** Structured clinical database containing 40+ symptoms, 15+ disease profiles, and specificity weights.
- **`predictor.py`:** Standalone Bayesian inference engine with differential ranking and step-by-step mathematical breakdown.
- **`app_gui.py`:** Desktop interface built using standard Python `tkinter`.
- **`ml_model/train_model.py`:** Machine learning training pipeline supporting both Pure Python Naive Bayes and Scikit-Learn `MultinomialNB`.
