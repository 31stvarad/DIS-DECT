# 🩺 MedSense AI - Smart Disease Detector & Clinical Decision Support

A simple, fast, and explainable Disease Detection Web Application with Bayesian probabilistic inference, differential diagnosis engine, and Python Scikit-Learn training pipeline.

---

## 🚀 Quick Start

### 1. Web Application (Zero Setup Required)
Simply open `index.html` in any web browser, or serve locally:
```bash
python -m http.server 8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### 2. Desktop GUI Application
```bash
python app_gui.py
```

### 3. Interactive Terminal Console
```bash
python main.py
```

### 4. Python ML Pipeline & CLI
```bash
cd ml_model
pip install -r requirements.txt
python train_model.py
python predict_cli.py
```

---

## ✨ Key Features
- **Instant Probabilistic Disease Inference**: Multi-symptom Bayesian matching with confidence percentage.
- **Differential Diagnoses Ranking**: Displays top 3 runner-up conditions for clinical transparency.
- **Clinical Triage & Action Plan**: Severity rating (Mild, Moderate, High, Critical), precautions, dietary advice, and doctor specialization mapping.
- **Algorithmic Explainability**: Step-by-step vectorization and coverage breakdown for every prediction.
- **Official Medical Summary Export**: 1-click formatted print/PDF generation.
- **Light & Dark Theme**: Responsive glassmorphic UI.

---

## 📚 Technical Documentation
For full architectural details, block diagrams, and mathematical formulation, read [`DOCUMENTATION.md`](./DOCUMENTATION.md).
