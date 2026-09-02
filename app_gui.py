"""
=============================================================================
MedSense AI - Desktop GUI Disease Detector (Python Tkinter)
File: app_gui.py
Zero external dependencies - Uses Python's built-in standard library (tkinter).
=============================================================================
"""

import tkinter as tk
from tkinter import ttk, messagebox
from dataset import SYMPTOMS_LIST, DEMO_PRESETS
from predictor import detect_disease

class MedSenseGUI:
    def __init__(self, root):
        self.root = root
        self.root.title("MedSense AI - Clinical Disease Detector & Decision Support System")
        self.root.geometry("1100x720")
        self.root.minsize(950, 600)
        self.root.configure(bg="#0f172a")

        # Variables
        self.symptom_vars = {}  # { "symptom_id": tk.BooleanVar() }
        self.search_var = tk.StringVar()
        self.search_var.trace("w", self.filter_symptoms)

        self.setup_styles()
        self.build_ui()
        self.load_symptoms()

    def setup_styles(self):
        style = ttk.Style()
        style.theme_use("clam")
        
        # Configure Colors & Fonts
        style.configure("TFrame", background="#0f172a")
        style.configure("Card.TFrame", background="#1e293b", relief="flat")
        style.configure("Header.TLabel", background="#0f172a", foreground="#38bdf8", font=("Segoe UI", 16, "bold"))
        style.configure("Sub.TLabel", background="#0f172a", foreground="#94a3b8", font=("Segoe UI", 10))
        style.configure("CardTitle.TLabel", background="#1e293b", foreground="#f8fafc", font=("Segoe UI", 12, "bold"))
        style.configure("CardText.TLabel", background="#1e293b", foreground="#cbd5e1", font=("Segoe UI", 10))
        style.configure("Badge.TLabel", background="#0284c7", foreground="#ffffff", font=("Segoe UI", 11, "bold"), padding=4)
        style.configure("TCheckbutton", background="#1e293b", foreground="#f1f5f9", font=("Segoe UI", 9))

    def build_ui(self):
        # 1. Top Navbar
        top_bar = tk.Frame(self.root, bg="#1e293b", height=60, padx=20, pady=10)
        top_bar.pack(fill="x", side="top")

        brand_lbl = tk.Label(top_bar, text="🩺 MedSense AI", bg="#1e293b", fg="#38bdf8", font=("Segoe UI", 16, "bold"))
        brand_lbl.pack(side="left")

        # 2. Demo Presets Banner
        presets_bar = tk.Frame(self.root, bg="#0f172a", padx=20, pady=6)
        presets_bar.pack(fill="x", side="top")

        tk.Label(presets_bar, text="⚡ 1-Click Demos:", bg="#0f172a", fg="#94a3b8", font=("Segoe UI", 9, "bold")).pack(side="left", padx=(0, 8))
        for p in DEMO_PRESETS[:6]:
            btn = tk.Button(
                presets_bar, text=p["title"], bg="#334155", fg="#e2e8f0", 
                font=("Segoe UI", 8), padx=8, pady=2, relief="flat", cursor="hand2",
                command=lambda syms=p["symptoms"]: self.apply_preset(syms)
            )
            btn.pack(side="left", padx=3)

        # 3. Main Split Workspace
        workspace = tk.Frame(self.root, bg="#0f172a", padx=15, pady=10)
        workspace.pack(fill="both", expand=True)

        # LEFT PANEL: Symptom Catalog (Width 400)
        left_panel = tk.Frame(workspace, bg="#1e293b", bd=1, relief="solid")
        left_panel.pack(side="left", fill="both", expand=False, padx=(0, 10), ipadx=10, ipady=10)
        left_panel.config(width=420)

        tk.Label(left_panel, text="📋 Select Symptoms", bg="#1e293b", fg="#38bdf8", font=("Segoe UI", 13, "bold")).pack(anchor="w", padx=10, pady=(5, 2))
        
        # Search Box
        search_frame = tk.Frame(left_panel, bg="#1e293b")
        search_frame.pack(fill="x", padx=10, pady=5)
        tk.Label(search_frame, text="🔍", bg="#1e293b", fg="#94a3b8").pack(side="left")
        search_entry = tk.Entry(search_frame, textvariable=self.search_var, bg="#0f172a", fg="#f8fafc", insertbackground="white", relief="flat", font=("Segoe UI", 10))
        search_entry.pack(side="left", fill="x", expand=True, padx=5, ipady=4)

        # Action Buttons under search
        btn_frame = tk.Frame(left_panel, bg="#1e293b")
        btn_frame.pack(fill="x", padx=10, pady=(0, 5))
        
        clear_btn = tk.Button(btn_frame, text="Clear All", bg="#ef4444", fg="white", font=("Segoe UI", 8, "bold"), relief="flat", command=self.clear_all, cursor="hand2")
        clear_btn.pack(side="right")

        # Scrollable Symptom List
        symptom_container = tk.Frame(left_panel, bg="#1e293b")
        symptom_container.pack(fill="both", expand=True, padx=5, pady=5)

        self.canvas = tk.Canvas(symptom_container, bg="#1e293b", highlightthickness=0)
        scrollbar = ttk.Scrollbar(symptom_container, orient="vertical", command=self.canvas.yview)
        self.scrollable_frame = tk.Frame(self.canvas, bg="#1e293b")

        self.scrollable_frame.bind(
            "<Configure>",
            lambda e: self.canvas.configure(scrollregion=self.canvas.bbox("all"))
        )

        self.canvas.create_window((0, 0), window=self.scrollable_frame, anchor="nw")
        self.canvas.configure(yscrollcommand=scrollbar.set)

        self.canvas.pack(side="left", fill="both", expand=True)
        scrollbar.pack(side="right", fill="y")

        # RIGHT PANEL: Results & Diagnosis
        right_panel = tk.Frame(workspace, bg="#1e293b", bd=1, relief="solid")
        right_panel.pack(side="right", fill="both", expand=True, ipadx=15, ipady=15)

        # Output Components
        self.res_title = tk.Label(right_panel, text="Awaiting Symptom Selection...", bg="#1e293b", fg="#38bdf8", font=("Segoe UI", 18, "bold"))
        self.res_title.pack(anchor="w", pady=(5, 2))

        self.res_conf_badge = tk.Label(right_panel, text="Confidence: --%", bg="#334155", fg="#f8fafc", font=("Segoe UI", 11, "bold"), padx=8, pady=3)
        self.res_conf_badge.pack(anchor="w", pady=(0, 10))

        # Metadata Box (Severity & Doctor)
        meta_box = tk.Frame(right_panel, bg="#0f172a", padx=10, pady=8)
        meta_box.pack(fill="x", pady=5)

        self.lbl_severity = tk.Label(meta_box, text="Severity: --", bg="#0f172a", fg="#fbbf24", font=("Segoe UI", 10, "bold"))
        self.lbl_severity.pack(side="left", padx=(0, 20))

        self.lbl_doctor = tk.Label(meta_box, text="Specialist: --", bg="#0f172a", fg="#38bdf8", font=("Segoe UI", 10, "bold"))
        self.lbl_doctor.pack(side="left")

        # Summary & Clinical Triad
        self.lbl_summary = tk.Label(right_panel, text="Select symptoms from the left to view diagnosis.", bg="#1e293b", fg="#94a3b8", font=("Segoe UI", 10), wraplength=550, justify="left")
        self.lbl_summary.pack(anchor="w", pady=8)

        self.lbl_triad = tk.Label(right_panel, text="", bg="#2e1065", fg="#e9d5ff", font=("Segoe UI", 9, "italic"), padx=8, pady=4, wraplength=550, justify="left")
        self.lbl_triad.pack(fill="x", pady=5)

        # Precautions & Diet Section
        details_frame = tk.Frame(right_panel, bg="#1e293b")
        details_frame.pack(fill="both", expand=True, pady=10)

        # Precautions Text
        p_frame = tk.Frame(details_frame, bg="#0f172a", padx=10, pady=8)
        p_frame.pack(side="left", fill="both", expand=True, padx=(0, 5))
        tk.Label(p_frame, text="🛡️ Precautions & Care", bg="#0f172a", fg="#34d399", font=("Segoe UI", 10, "bold")).pack(anchor="w")
        self.txt_precautions = tk.Text(p_frame, bg="#0f172a", fg="#cbd5e1", font=("Segoe UI", 9), relief="flat", wrap="word", height=6)
        self.txt_precautions.pack(fill="both", expand=True, pady=4)

        # Differentials & Math Box
        d_frame = tk.Frame(details_frame, bg="#0f172a", padx=10, pady=8)
        d_frame.pack(side="right", fill="both", expand=True, padx=(5, 0))
        tk.Label(d_frame, text="📊 Differential Diagnoses", bg="#0f172a", fg="#818cf8", font=("Segoe UI", 10, "bold")).pack(anchor="w")
        self.txt_differentials = tk.Text(d_frame, bg="#0f172a", fg="#cbd5e1", font=("Segoe UI", 9), relief="flat", wrap="word", height=6)
        self.txt_differentials.pack(fill="both", expand=True, pady=4)

    def load_symptoms(self):
        for widget in self.scrollable_frame.winfo_children():
            widget.destroy()

        query = self.search_var.get().lower().strip()

        for sym in SYMPTOMS_LIST:
            s_id = sym["id"]
            name = sym["name"]
            cat = sym["category"]

            if query and query not in name.lower() and query not in cat.lower():
                continue

            if s_id not in self.symptom_vars:
                self.symptom_vars[s_id] = tk.BooleanVar(value=False)

            cb = tk.Checkbutton(
                self.scrollable_frame,
                text=f"{name}  [{cat}]",
                variable=self.symptom_vars[s_id],
                command=self.run_diagnosis,
                bg="#1e293b",
                fg="#f8fafc",
                selectcolor="#0f172a",
                activebackground="#334155",
                activeforeground="#38bdf8",
                anchor="w",
                font=("Segoe UI", 9)
            )
            cb.pack(fill="x", padx=5, pady=2)

    def filter_symptoms(self, *args):
        self.load_symptoms()

    def get_selected_symptoms(self):
        return [s_id for s_id, var in self.symptom_vars.items() if var.get()]

    def run_diagnosis(self):
        selected = self.get_selected_symptoms()
        if not selected:
            self.res_title.config(text="Awaiting Symptom Selection...", fg="#38bdf8")
            self.res_conf_badge.config(text="Confidence: --%", bg="#334155")
            self.lbl_severity.config(text="Severity: --")
            self.lbl_doctor.config(text="Specialist: --")
            self.lbl_summary.config(text="Select symptoms from the left to view diagnosis.")
            self.lbl_triad.pack_forget()
            self.txt_precautions.delete("1.0", tk.END)
            self.txt_differentials.delete("1.0", tk.END)
            return

        result = detect_disease(selected)
        if not result:
            self.res_title.config(text="No Match Found", fg="#ef4444")
            return

        disease = result["primary_disease"]
        conf = result["confidence"]

        self.res_title.config(text=disease["name"], fg="#38bdf8")
        self.res_conf_badge.config(text=f"Confidence: {conf}%", bg="#0284c7" if conf > 80 else "#d97706")
        self.lbl_severity.config(text=f"Severity: {disease['severity']} ({disease['urgency']})")
        self.lbl_doctor.config(text=f"Specialist: {disease['specialist']}")
        self.lbl_summary.config(text=disease["summary"])

        self.lbl_triad.pack(fill="x", pady=5)
        insight = disease.get('clinical_insight', '')
        self.lbl_triad.config(text=f"💡 Diagnostic Insight: {insight}")

        # Update Precautions Text
        self.txt_precautions.delete("1.0", tk.END)
        for p in disease["precautions"]:
            self.txt_precautions.insert(tk.END, f"• {p}\n")
        self.txt_precautions.insert(tk.END, "\nRecommended Diet:\n")
        for d in disease["diet"]:
            self.txt_precautions.insert(tk.END, f"  + {d}\n")

        # Update Differentials
        self.txt_differentials.delete("1.0", tk.END)
        for d in result["differentials"]:
            self.txt_differentials.insert(tk.END, f"• {d['name']} ({d['confidence']}%)\n")
        self.txt_differentials.insert(tk.END, "\nMathematical Calculation Breakdown:\n")
        self.txt_differentials.insert(tk.END, result["math_breakdown"])

    def apply_preset(self, symptom_ids):
        for s_id, var in self.symptom_vars.items():
            var.set(s_id in symptom_ids)
        self.run_diagnosis()

    def clear_all(self):
        for var in self.symptom_vars.values():
            var.set(False)
        self.run_diagnosis()

if __name__ == "__main__":
    root = tk.Tk()
    app = MedSenseGUI(root)
    root.mainloop()
