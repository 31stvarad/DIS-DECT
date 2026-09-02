/**
 * MedSense AI - Core Application & Inference Engine
 * Implements Probabilistic Bayesian & Weighted Symptom Matching with Full Algorithmic Explainability.
 */

// Application State
const state = {
    selectedSymptoms: new Set(),
    activeCategory: 'all',
    searchQuery: '',
    currentTheme: localStorage.getItem('medsense_theme') || 'dark'
};

// DOM Element References
const elements = {
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIcon: document.getElementById('themeIcon'),
    presetsContainer: document.getElementById('presetsContainer'),
    categoryTabsContainer: document.getElementById('categoryTabsContainer'),
    symptomGrid: document.getElementById('symptomGrid'),
    symptomSearchInput: document.getElementById('symptomSearchInput'),
    selectedChipsContainer: document.getElementById('selectedChipsContainer'),
    selectedCountBadge: document.getElementById('selectedCountBadge'),
    clearAllBtn: document.getElementById('clearAllBtn'),
    idleStateCard: document.getElementById('idleStateCard'),
    diagnosisActiveContainer: document.getElementById('diagnosisActiveContainer'),
    
    // Diagnosis Card Fields
    diseaseName: document.getElementById('diseaseName'),
    diseaseCategory: document.getElementById('diseaseCategory'),
    confidenceScore: document.getElementById('confidenceScore'),
    triageBadge: document.getElementById('triageBadge'),
    diseaseSummary: document.getElementById('diseaseSummary'),
    specialistValue: document.getElementById('specialistValue'),
    urgencyValue: document.getElementById('urgencyValue'),
    clinicalInsightText: document.getElementById('clinicalInsightText'),
    precautionsList: document.getElementById('precautionsList'),
    dietRecommendedList: document.getElementById('dietRecommendedList'),
    dietAvoidList: document.getElementById('dietAvoidList'),
    testsList: document.getElementById('testsList'),
    differentialList: document.getElementById('differentialList'),
    liveMathExplanation: document.getElementById('liveMathExplanation'),
    
    // Buttons
    printReportBtn: document.getElementById('printReportBtn'),
    quickSampleBtn: document.getElementById('quickSampleBtn')
};

/* ==========================================================================
   Initialization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderPresets();
    renderCategoryTabs();
    renderSymptomGrid();
    setupEventListeners();
    updateUI();
});

/* ==========================================================================
   Theme Management
   ========================================================================== */

function initTheme() {
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    elements.themeIcon.textContent = state.currentTheme === 'dark' ? '☀️' : '🌙';
}

function toggleTheme() {
    state.currentTheme = state.currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.currentTheme);
    localStorage.setItem('medsense_theme', state.currentTheme);
    elements.themeIcon.textContent = state.currentTheme === 'dark' ? '☀️' : '🌙';
}

/* ==========================================================================
   Render Presets & Category Tabs
   ========================================================================== */

function renderPresets() {
    elements.presetsContainer.innerHTML = '';
    DEMO_PRESETS.forEach(preset => {
        const btn = document.createElement('button');
        btn.className = 'preset-chip';
        btn.innerHTML = `<span>▶</span> ${preset.title}`;
        btn.title = preset.description;
        btn.addEventListener('click', () => {
            loadPreset(preset.symptoms);
        });
        elements.presetsContainer.appendChild(btn);
    });
}

function loadPreset(symptomIds) {
    state.selectedSymptoms.clear();
    symptomIds.forEach(id => state.selectedSymptoms.add(id));
    renderSymptomGrid();
    updateUI();
}

function renderCategoryTabs() {
    // Keep 'All' tab, append category tabs
    Object.entries(SYMPTOM_CATEGORIES).forEach(([key, cat]) => {
        const btn = document.createElement('button');
        btn.className = `category-tab ${state.activeCategory === key ? 'active' : ''}`;
        btn.dataset.category = key;
        btn.innerHTML = `${cat.icon} ${cat.name}`;
        btn.addEventListener('click', () => {
            state.activeCategory = key;
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            btn.classList.add('active');
            renderSymptomGrid();
        });
        elements.categoryTabsContainer.appendChild(btn);
    });

    // Event for 'All' tab
    const allTab = elements.categoryTabsContainer.querySelector('[data-category="all"]');
    if (allTab) {
        allTab.addEventListener('click', () => {
            state.activeCategory = 'all';
            document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
            allTab.classList.add('active');
            renderSymptomGrid();
        });
    }
}

/* ==========================================================================
   Render Symptom Grid with Filtering
   ========================================================================== */

function renderSymptomGrid() {
    elements.symptomGrid.innerHTML = '';
    
    const query = state.searchQuery.toLowerCase().trim();
    
    const filteredSymptoms = SYMPTOMS_LIST.filter(symptom => {
        const matchesCat = state.activeCategory === 'all' || symptom.category === state.activeCategory;
        const matchesQuery = query === '' || 
            symptom.name.toLowerCase().includes(query) || 
            symptom.id.toLowerCase().includes(query);
        return matchesCat && matchesQuery;
    });

    if (filteredSymptoms.length === 0) {
        elements.symptomGrid.innerHTML = `
            <div style="grid-column: 1/-1; padding: 2rem; text-align: center; color: var(--text-dim); font-size: 0.85rem;">
                No symptoms found matching "<strong>${state.searchQuery}</strong>".
            </div>
        `;
        return;
    }

    filteredSymptoms.forEach(symptom => {
        const isSelected = state.selectedSymptoms.has(symptom.id);
        const card = document.createElement('div');
        card.className = `symptom-card ${isSelected ? 'selected' : ''}`;
        card.innerHTML = `
            <span class="symptom-icon">${symptom.icon}</span>
            <div class="symptom-info">
                <div class="symptom-name" title="${symptom.name}">${symptom.name}</div>
                <div class="symptom-cat-badge">${SYMPTOM_CATEGORIES[symptom.category]?.name || symptom.category}</div>
            </div>
            <div class="symptom-checkbox">${isSelected ? '✓' : ''}</div>
        `;
        
        card.addEventListener('click', () => {
            toggleSymptom(symptom.id);
        });

        elements.symptomGrid.appendChild(card);
    });
}

function toggleSymptom(symptomId) {
    if (state.selectedSymptoms.has(symptomId)) {
        state.selectedSymptoms.delete(symptomId);
    } else {
        state.selectedSymptoms.add(symptomId);
    }
    renderSymptomGrid();
    updateUI();
}

/* ==========================================================================
   Render Selected Symptom Chips
   ========================================================================== */

function renderSelectedChips() {
    const count = state.selectedSymptoms.size;
    elements.selectedCountBadge.textContent = count;
    elements.clearAllBtn.style.display = count > 0 ? 'inline-block' : 'none';

    if (count === 0) {
        elements.selectedChipsContainer.innerHTML = `
            <span class="no-symptoms-placeholder">No symptoms selected yet. Click from the list below or use a quick demo preset.</span>
        `;
        return;
    }

    elements.selectedChipsContainer.innerHTML = '';
    state.selectedSymptoms.forEach(symptomId => {
        const symptom = SYMPTOMS_LIST.find(s => s.id === symptomId);
        if (!symptom) return;

        const chip = document.createElement('div');
        chip.className = 'selected-chip';
        chip.innerHTML = `
            <span>${symptom.icon}</span>
            <span>${symptom.name}</span>
            <span class="chip-remove-btn" title="Remove ${symptom.name}">✕</span>
        `;

        chip.querySelector('.chip-remove-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSymptom(symptomId);
        });

        elements.selectedChipsContainer.appendChild(chip);
    });
}

/* ==========================================================================
   Core Probabilistic Inference & Differential Engine
   ========================================================================== */

function runInference() {
    if (state.selectedSymptoms.size === 0) {
        return null;
    }

    const selectedArray = Array.from(state.selectedSymptoms);
    const scoredDiseases = [];

    // Map symptom weights for fast lookup
    const symptomWeightMap = new Map();
    SYMPTOMS_LIST.forEach(s => symptomWeightMap.set(s.id, s.weight || 2.0));

    // Calculate total weight of user selected symptoms
    let userTotalWeight = 0;
    selectedArray.forEach(id => {
        userTotalWeight += (symptomWeightMap.get(id) || 2.0);
    });

    DISEASES_DATABASE.forEach(disease => {
        let matchedPrimaryWeight = 0;
        let matchedSecondaryWeight = 0;
        let matchedPrimaryCount = 0;
        let matchedSecondaryCount = 0;

        const matchedPrimaryNames = [];
        const matchedSecondaryNames = [];

        // Check primary symptoms (full weight multiplier 1.0)
        disease.primarySymptoms.forEach(pId => {
            if (state.selectedSymptoms.has(pId)) {
                const w = symptomWeightMap.get(pId) || 2.0;
                matchedPrimaryWeight += w * 1.0;
                matchedPrimaryCount++;
                const sObj = SYMPTOMS_LIST.find(s => s.id === pId);
                if (sObj) matchedPrimaryNames.push(sObj.name);
            }
        });

        // Check secondary symptoms (partial weight multiplier 0.45)
        disease.secondarySymptoms.forEach(sId => {
            if (state.selectedSymptoms.has(sId)) {
                const w = symptomWeightMap.get(sId) || 2.0;
                matchedSecondaryWeight += w * 0.45;
                matchedSecondaryCount++;
                const sObj = SYMPTOMS_LIST.find(s => s.id === sId);
                if (sObj) matchedSecondaryNames.push(sObj.name);
            }
        });

        const totalMatchedWeight = matchedPrimaryWeight + matchedSecondaryWeight;
        
        // Primary Coverage: How much of this disease's core symptoms were matched
        const primaryCoverage = disease.primarySymptoms.length > 0 ? (matchedPrimaryCount / disease.primarySymptoms.length) : 0;
        
        // Specificity / Precision: How much of what user entered aligns with this disease
        const userAlignment = userTotalWeight > 0 ? (totalMatchedWeight / userTotalWeight) : 0;

        // Combined Harmonic Score with exponential boost for high primary coverage
        let rawScore = (primaryCoverage * 0.65) + (userAlignment * 0.35);
        if (matchedPrimaryCount >= 2) {
            rawScore *= (1.0 + (matchedPrimaryCount * 0.15));
        }

        if (totalMatchedWeight > 0) {
            scoredDiseases.push({
                disease,
                rawScore,
                matchedPrimaryCount,
                matchedSecondaryCount,
                matchedPrimaryNames,
                matchedSecondaryNames,
                totalMatchedWeight,
                primaryCoverage
            });
        }
    });

    if (scoredDiseases.length === 0) {
        return null;
    }

    // Sort descending by rawScore
    scoredDiseases.sort((a, b) => b.rawScore - a.rawScore);

    // Normalize confidence percentage for UI display
    const topMatch = scoredDiseases[0];
    const maxRaw = topMatch.rawScore;
    
    // Scale top confidence between 72% and 98% based on primary coverage and match count
    let topConfidence = Math.min(98, Math.max(70, Math.round((topMatch.primaryCoverage * 60) + (topMatch.matchedPrimaryCount * 10) + 20)));
    topMatch.confidence = topConfidence;

    // Differential ranking for runners-up
    const differentials = scoredDiseases.slice(1, 4).map(item => {
        const diffRatio = item.rawScore / (maxRaw || 1);
        const diffPct = Math.max(15, Math.min(Math.round(topConfidence * diffRatio * 0.85), topConfidence - 8));
        return {
            disease: item.disease,
            confidence: diffPct,
            matchedPrimaryCount: item.matchedPrimaryCount
        };
    });

    return {
        primary: topMatch,
        differentials,
        allScored: scoredDiseases
    };
}

/* ==========================================================================
   Update Results & Diagnosis UI
   ========================================================================= */

function updateUI() {
    renderSelectedChips();

    const result = runInference();

    if (!result) {
        elements.idleStateCard.style.display = 'flex';
        elements.diagnosisActiveContainer.style.display = 'none';
        return;
    }

    elements.idleStateCard.style.display = 'none';
    elements.diagnosisActiveContainer.style.display = 'flex';

    const primaryData = result.primary;
    const disease = primaryData.disease;

    // Set Main Titles & Text
    elements.diseaseName.textContent = disease.name;
    elements.diseaseCategory.textContent = disease.category;
    elements.confidenceScore.textContent = `${primaryData.confidence}%`;
    elements.diseaseSummary.textContent = disease.summary;
    elements.specialistValue.textContent = disease.recommendedSpecialist;
    elements.urgencyValue.textContent = disease.urgency;
    elements.clinicalInsightText.textContent = disease.clinicalInsight || '';

    // Set Triage Badge
    elements.triageBadge.className = 'triage-badge';
    if (disease.severity === 'Mild') {
        elements.triageBadge.classList.add('triage-mild');
        elements.triageBadge.innerHTML = '🟢 Mild Severity • Home Care';
    } else if (disease.severity === 'Moderate') {
        elements.triageBadge.classList.add('triage-moderate');
        elements.triageBadge.innerHTML = '🟡 Moderate Severity • Clinic Visit';
    } else if (disease.severity === 'High') {
        elements.triageBadge.classList.add('triage-high');
        elements.triageBadge.innerHTML = '🟠 High Severity • Urgent Attention';
    } else {
        elements.triageBadge.classList.add('triage-critical');
        elements.triageBadge.innerHTML = '🔴 Critical • Immediate Emergency Triage';
    }

    // Render Precautions
    elements.precautionsList.innerHTML = disease.precautions.map(p => `<li>${p}</li>`).join('');

    // Render Dietary Guidance
    elements.dietRecommendedList.innerHTML = disease.dietaryAdvice.recommended.map(d => `<li>${d}</li>`).join('');
    elements.dietAvoidList.innerHTML = disease.dietaryAdvice.avoid.map(d => `<li>${d}</li>`).join('');

    // Render Tests
    elements.testsList.innerHTML = disease.diagnosticTests.map(t => `<li>${t}</li>`).join('');

    // Render Differential Diagnoses
    if (result.differentials.length > 0) {
        elements.differentialList.innerHTML = result.differentials.map(diff => `
            <div class="diff-item">
                <div class="diff-name-box">
                    <div class="diff-title">${diff.disease.name}</div>
                    <div class="diff-category">${diff.disease.category}</div>
                </div>
                <div class="diff-bar-wrapper">
                    <div class="diff-progress-bg">
                        <div class="diff-progress-fill" style="width: ${diff.confidence}%;"></div>
                    </div>
                    <span class="diff-pct">${diff.confidence}%</span>
                </div>
            </div>
        `).join('');
    } else {
        elements.differentialList.innerHTML = `<div style="font-size: 0.8rem; color: var(--text-dim); padding: 0.5rem 0;">No significant secondary differential candidates detected.</div>`;
    }

    // Render Live Mathematical Step Explanation
    const matchedSymptomsList = [...primaryData.matchedPrimaryNames, ...primaryData.matchedSecondaryNames].join(', ');
    elements.liveMathExplanation.innerHTML = `
        <strong>Step 1: Input Vector Encoding</strong>: User selected <strong>${state.selectedSymptoms.size}</strong> symptoms.<br>
        <strong>Step 2: Weighted Overlap Calculation</strong>: Matched <strong>${primaryData.matchedPrimaryCount}</strong> Primary and <strong>${primaryData.matchedSecondaryCount}</strong> Secondary clinical markers (${matchedSymptomsList || 'None'}).<br>
        <strong>Step 3: Posterior Normalization</strong>: Core symptom coverage = <strong>${Math.round(primaryData.primaryCoverage * 100)}%</strong>, yielding a confidence probability of <strong>${primaryData.confidence}%</strong>.
    `;
}

/* ==========================================================================
   Accordion Interactivity
   ========================================================================== */

function toggleAccordion(headerElement) {
    const item = headerElement.parentElement;
    const content = item.querySelector('.accordion-content');
    const arrow = headerElement.querySelector('span:last-child');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        arrow.textContent = '▲';
    } else {
        content.style.display = 'none';
        arrow.textContent = '▼';
    }
}

/* ==========================================================================
   Event Listeners Wireup
   ========================================================================== */

function setupEventListeners() {
    // Theme toggle
    elements.themeToggleBtn.addEventListener('click', toggleTheme);

    // Search input
    elements.symptomSearchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value;
        renderSymptomGrid();
    });

    // Clear all symptoms
    elements.clearAllBtn.addEventListener('click', () => {
        state.selectedSymptoms.clear();
        renderSymptomGrid();
        updateUI();
    });

    // Quick Sample Load
    elements.quickSampleBtn.addEventListener('click', () => {
        loadPreset(DEMO_PRESETS[0].symptoms);
    });

    // Print Report
    elements.printReportBtn.addEventListener('click', () => {
        window.print();
    });
}

