/**
 * MedSense AI - Core Application & Inference Engine
 * Implements Probabilistic Bayesian & Weighted Symptom Matching
 * with Full Algorithmic Explainability.
 */

/* ==========================================================================
   Application State
   ========================================================================== */

const state = {
    selectedSymptoms: new Set(),
    activeCategory: 'all',
    searchQuery: '',
    currentTheme: localStorage.getItem('medsense_theme') || 'dark'
};

/* ==========================================================================
   DOM Element References
   ========================================================================== */

// IMPORTANT:
// DOM references are initialized inside DOMContentLoaded.
// This prevents null references when app.js loads before the HTML.

let elements = {};

/* ==========================================================================
   Initialization
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // Initialize DOM references AFTER HTML has loaded
    elements = {
        // Theme
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        themeIcon: document.getElementById('themeIcon'),

        // Main containers
        presetsContainer: document.getElementById('presetsContainer'),
        categoryTabsContainer: document.getElementById('categoryTabsContainer'),
        symptomGrid: document.getElementById('symptomGrid'),
        symptomSearchInput: document.getElementById('symptomSearchInput'),

        // Selected symptoms
        selectedChipsContainer: document.getElementById('selectedChipsContainer'),
        selectedCountBadge: document.getElementById('selectedCountBadge'),
        clearAllBtn: document.getElementById('clearAllBtn'),

        // Diagnosis containers
        idleStateCard: document.getElementById('idleStateCard'),
        diagnosisActiveContainer: document.getElementById('diagnosisActiveContainer'),

        // Diagnosis card fields
        diseaseName: document.getElementById('diseaseName'),
        diseaseCategory: document.getElementById('diseaseCategory'),
        confidenceScore: document.getElementById('confidenceScore'),
        triageBadge: document.getElementById('triageBadge'),
        diseaseSummary: document.getElementById('diseaseSummary'),
        specialistValue: document.getElementById('specialistValue'),
        urgencyValue: document.getElementById('urgencyValue'),
        clinicalInsightText: document.getElementById('clinicalInsightText'),

        // Lists
        precautionsList: document.getElementById('precautionsList'),
        dietRecommendedList: document.getElementById('dietRecommendedList'),
        dietAvoidList: document.getElementById('dietAvoidList'),
        testsList: document.getElementById('testsList'),
        differentialList: document.getElementById('differentialList'),

        // Explanation
        liveMathExplanation: document.getElementById('liveMathExplanation'),

        // Buttons
        printReportBtn: document.getElementById('printReportBtn'),
        quickSampleBtn: document.getElementById('quickSampleBtn')
    };

    // Check for missing required DOM elements
    validateDOMElements();

    // Initialize application
    initTheme();
    renderPresets();
    renderCategoryTabs();
    renderSymptomGrid();
    setupEventListeners();
    updateUI();
});


/* ==========================================================================
   DOM Validation
   ========================================================================== */

function validateDOMElements() {
    const requiredElements = {
        themeToggleBtn: 'themeToggleBtn',
        themeIcon: 'themeIcon',
        presetsContainer: 'presetsContainer',
        categoryTabsContainer: 'categoryTabsContainer',
        symptomGrid: 'symptomGrid',
        symptomSearchInput: 'symptomSearchInput',
        selectedChipsContainer: 'selectedChipsContainer',
        selectedCountBadge: 'selectedCountBadge',
        clearAllBtn: 'clearAllBtn',
        idleStateCard: 'idleStateCard',
        diagnosisActiveContainer: 'diagnosisActiveContainer',
        diseaseName: 'diseaseName',
        diseaseCategory: 'diseaseCategory',
        confidenceScore: 'confidenceScore',
        triageBadge: 'triageBadge',
        diseaseSummary: 'diseaseSummary',
        specialistValue: 'specialistValue',
        urgencyValue: 'urgencyValue',
        clinicalInsightText: 'clinicalInsightText',
        precautionsList: 'precautionsList',
        dietRecommendedList: 'dietRecommendedList',
        dietAvoidList: 'dietAvoidList',
        testsList: 'testsList',
        differentialList: 'differentialList',
        liveMathExplanation: 'liveMathExplanation',
        printReportBtn: 'printReportBtn',
        quickSampleBtn: 'quickSampleBtn'
    };

    const missing = [];

    Object.entries(requiredElements).forEach(([property, id]) => {
        if (!elements[property]) {
            missing.push(`#${id}`);
        }
    });

    if (missing.length > 0) {
        console.error(
            'MedSense AI: The following HTML elements were not found:',
            missing.join(', ')
        );

        console.error(
            'Please make sure these IDs exist in your HTML.'
        );
    }
}


/* ==========================================================================
   Theme Management
   ========================================================================== */

function initTheme() {
    document.documentElement.setAttribute(
        'data-theme',
        state.currentTheme
    );

    if (elements.themeIcon) {
        elements.themeIcon.textContent =
            state.currentTheme === 'dark' ? '☀️' : '🌙';
    }
}


function toggleTheme() {
    state.currentTheme =
        state.currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute(
        'data-theme',
        state.currentTheme
    );

    localStorage.setItem(
        'medsense_theme',
        state.currentTheme
    );

    if (elements.themeIcon) {
        elements.themeIcon.textContent =
            state.currentTheme === 'dark' ? '☀️' : '🌙';
    }
}


/* ==========================================================================
   Render Presets
   ========================================================================== */

function renderPresets() {

    if (!elements.presetsContainer) return;

    elements.presetsContainer.innerHTML = '';

    if (
        typeof DEMO_PRESETS === 'undefined' ||
        !Array.isArray(DEMO_PRESETS)
    ) {
        console.error(
            'MedSense AI: DEMO_PRESETS is not defined.'
        );
        return;
    }

    DEMO_PRESETS.forEach(preset => {

        const btn = document.createElement('button');

        btn.className = 'preset-chip';

        btn.innerHTML = `
            <span>▶</span>
            ${escapeHTML(preset.title || 'Demo')}
        `;

        btn.title = preset.description || '';

        btn.addEventListener('click', () => {
            loadPreset(preset.symptoms || []);
        });

        elements.presetsContainer.appendChild(btn);
    });
}


/* ==========================================================================
   Load Preset
   ========================================================================== */

function loadPreset(symptomIds) {

    state.selectedSymptoms.clear();

    if (Array.isArray(symptomIds)) {

        symptomIds.forEach(id => {
            state.selectedSymptoms.add(id);
        });

    }

    renderSymptomGrid();
    updateUI();
}


/* ==========================================================================
   Render Category Tabs
   ========================================================================== */

function renderCategoryTabs() {

    if (!elements.categoryTabsContainer) return;

    /*
     * Clear existing generated tabs.
     *
     * If your HTML already contains an "All" button,
     * we preserve it.
     */
    const existingAllTab =
        elements.categoryTabsContainer.querySelector(
            '[data-category="all"]'
        );

    // Remove generated category tabs except "All"
    elements.categoryTabsContainer
        .querySelectorAll('.category-tab:not([data-category="all"])')
        .forEach(tab => tab.remove());


    if (
        typeof SYMPTOM_CATEGORIES === 'undefined' ||
        !SYMPTOM_CATEGORIES
    ) {
        console.error(
            'MedSense AI: SYMPTOM_CATEGORIES is not defined.'
        );
        return;
    }


    Object.entries(SYMPTOM_CATEGORIES).forEach(([key, cat]) => {

        // Don't create a duplicate All tab
        if (key === 'all') return;

        const btn = document.createElement('button');

        btn.className =
            `category-tab ${
                state.activeCategory === key ? 'active' : ''
            }`;

        btn.dataset.category = key;

        btn.innerHTML = `
            ${cat.icon || ''}
            ${escapeHTML(cat.name || key)}
        `;

        btn.addEventListener('click', () => {

            state.activeCategory = key;

            document
                .querySelectorAll('.category-tab')
                .forEach(tab => {
                    tab.classList.remove('active');
                });

            btn.classList.add('active');

            renderSymptomGrid();
        });

        elements.categoryTabsContainer.appendChild(btn);
    });


    // Handle All tab if it exists
    if (existingAllTab) {

        existingAllTab.addEventListener('click', () => {

            state.activeCategory = 'all';

            document
                .querySelectorAll('.category-tab')
                .forEach(tab => {
                    tab.classList.remove('active');
                });

            existingAllTab.classList.add('active');

            renderSymptomGrid();
        });

    } else {

        // If All doesn't exist in HTML, create it
        const allTab = document.createElement('button');

        allTab.className =
            `category-tab ${
                state.activeCategory === 'all' ? 'active' : ''
            }`;

        allTab.dataset.category = 'all';

        allTab.innerHTML = '📋 All';

        allTab.addEventListener('click', () => {

            state.activeCategory = 'all';

            document
                .querySelectorAll('.category-tab')
                .forEach(tab => {
                    tab.classList.remove('active');
                });

            allTab.classList.add('active');

            renderSymptomGrid();
        });

        elements.categoryTabsContainer.prepend(allTab);
    }
}


/* ==========================================================================
   Render Symptom Grid
   ========================================================================== */

function renderSymptomGrid() {

    if (!elements.symptomGrid) return;

    elements.symptomGrid.innerHTML = '';

    if (
        typeof SYMPTOMS_LIST === 'undefined' ||
        !Array.isArray(SYMPTOMS_LIST)
    ) {
        elements.symptomGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                padding:2rem;
                text-align:center;
                color:var(--text-dim);
            ">
                Symptom database could not be loaded.
            </div>
        `;

        console.error(
            'MedSense AI: SYMPTOMS_LIST is not defined.'
        );

        return;
    }


    const query =
        state.searchQuery.toLowerCase().trim();


    const filteredSymptoms =
        SYMPTOMS_LIST.filter(symptom => {

            const matchesCat =
                state.activeCategory === 'all' ||
                symptom.category === state.activeCategory;

            const symptomName =
                String(symptom.name || '').toLowerCase();

            const symptomId =
                String(symptom.id || '').toLowerCase();

            const matchesQuery =
                query === '' ||
                symptomName.includes(query) ||
                symptomId.includes(query);

            return matchesCat && matchesQuery;
        });


    // No results
    if (filteredSymptoms.length === 0) {

        elements.symptomGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                padding:2rem;
                text-align:center;
                color:var(--text-dim);
                font-size:0.85rem;
            ">
                No symptoms found matching
                "<strong>${escapeHTML(state.searchQuery)}</strong>".
            </div>
        `;

        return;
    }


    // Render symptoms
    filteredSymptoms.forEach(symptom => {

        const isSelected =
            state.selectedSymptoms.has(symptom.id);


        const card =
            document.createElement('div');


        card.className =
            `symptom-card ${
                isSelected ? 'selected' : ''
            }`;


        const categoryName =
            SYMPTOM_CATEGORIES?.[symptom.category]?.name ||
            symptom.category ||
            'General';


        card.innerHTML = `
            <span class="symptom-icon">
                ${symptom.icon || '🩺'}
            </span>

            <div class="symptom-info">

                <div
                    class="symptom-name"
                    title="${escapeHTML(symptom.name || '')}"
                >
                    ${escapeHTML(symptom.name || 'Unknown')}
                </div>

                <div class="symptom-cat-badge">
                    ${escapeHTML(categoryName)}
                </div>

            </div>

            <div class="symptom-checkbox">
                ${isSelected ? '✓' : ''}
            </div>
        `;


        card.addEventListener('click', () => {
            toggleSymptom(symptom.id);
        });


        elements.symptomGrid.appendChild(card);
    });
}


/* ==========================================================================
   Toggle Symptom
   ========================================================================== */

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

    if (
        !elements.selectedChipsContainer ||
        !elements.selectedCountBadge ||
        !elements.clearAllBtn
    ) {
        return;
    }


    const count =
        state.selectedSymptoms.size;


    elements.selectedCountBadge.textContent =
        count;


    elements.clearAllBtn.style.display =
        count > 0 ? 'inline-block' : 'none';


    if (count === 0) {

        elements.selectedChipsContainer.innerHTML = `
            <span class="no-symptoms-placeholder">
                No symptoms selected yet.
                Click from the list below or use a quick demo preset.
            </span>
        `;

        return;
    }


    elements.selectedChipsContainer.innerHTML = '';


    state.selectedSymptoms.forEach(symptomId => {

        const symptom =
            SYMPTOMS_LIST.find(
                s => s.id === symptomId
            );


        if (!symptom) return;


        const chip =
            document.createElement('div');


        chip.className =
            'selected-chip';


        chip.innerHTML = `
            <span>${symptom.icon || '🩺'}</span>

            <span>
                ${escapeHTML(symptom.name || 'Unknown')}
            </span>

            <span
                class="chip-remove-btn"
                title="Remove ${escapeHTML(symptom.name || '')}"
            >
                ✕
            </span>
        `;


        const removeButton =
            chip.querySelector(
                '.chip-remove-btn'
            );


        if (removeButton) {

            removeButton.addEventListener(
                'click',
                event => {

                    event.stopPropagation();

                    toggleSymptom(symptomId);
                }
            );
        }


        elements.selectedChipsContainer
            .appendChild(chip);
    });
}


/* ==========================================================================
   Core Probabilistic Inference Engine
   ========================================================================== */

function runInference() {

    if (
        state.selectedSymptoms.size === 0
    ) {
        return null;
    }


    if (
        typeof SYMPTOMS_LIST === 'undefined' ||
        !Array.isArray(SYMPTOMS_LIST)
    ) {
        console.error(
            'MedSense AI: SYMPTOMS_LIST is unavailable.'
        );

        return null;
    }


    if (
        typeof DISEASES_DATABASE === 'undefined' ||
        !Array.isArray(DISEASES_DATABASE)
    ) {
        console.error(
            'MedSense AI: DISEASES_DATABASE is unavailable.'
        );

        return null;
    }


    const selectedArray =
        Array.from(state.selectedSymptoms);


    const scoredDiseases = [];


    /* ----------------------------------------------------------------------
       Build symptom weight map
       ---------------------------------------------------------------------- */

    const symptomWeightMap =
        new Map();


    SYMPTOMS_LIST.forEach(symptom => {

        symptomWeightMap.set(
            symptom.id,
            symptom.weight || 2.0
        );

    });


    /* ----------------------------------------------------------------------
       Calculate total weight of selected symptoms
       ---------------------------------------------------------------------- */

    let userTotalWeight = 0;


    selectedArray.forEach(id => {

        userTotalWeight +=
            symptomWeightMap.get(id) || 2.0;

    });


    /* ----------------------------------------------------------------------
       Score each disease
       ---------------------------------------------------------------------- */

    DISEASES_DATABASE.forEach(disease => {

        let matchedPrimaryWeight = 0;
        let matchedSecondaryWeight = 0;

        let matchedPrimaryCount = 0;
        let matchedSecondaryCount = 0;


        const matchedPrimaryNames = [];
        const matchedSecondaryNames = [];


        const primarySymptoms =
            Array.isArray(disease.primarySymptoms)
                ? disease.primarySymptoms
                : [];


        const secondarySymptoms =
            Array.isArray(disease.secondarySymptoms)
                ? disease.secondarySymptoms
                : [];


        /* ------------------------------------------------------------------
           Primary symptoms
           ------------------------------------------------------------------ */

        primarySymptoms.forEach(pId => {

            if (
                state.selectedSymptoms.has(pId)
            ) {

                const weight =
                    symptomWeightMap.get(pId) || 2.0;


                matchedPrimaryWeight +=
                    weight * 1.0;


                matchedPrimaryCount++;


                const symptom =
                    SYMPTOMS_LIST.find(
                        s => s.id === pId
                    );


                if (symptom) {
                    matchedPrimaryNames.push(
                        symptom.name
                    );
                }
            }
        });


        /* ------------------------------------------------------------------
           Secondary symptoms
           ------------------------------------------------------------------ */

        secondarySymptoms.forEach(sId => {

            if (
                state.selectedSymptoms.has(sId)
            ) {

                const weight =
                    symptomWeightMap.get(sId) || 2.0;


                matchedSecondaryWeight +=
                    weight * 0.45;


                matchedSecondaryCount++;


                const symptom =
                    SYMPTOMS_LIST.find(
                        s => s.id === sId
                    );


                if (symptom) {
                    matchedSecondaryNames.push(
                        symptom.name
                    );
                }
            }
        });


        /* ------------------------------------------------------------------
           Calculate scores
           ------------------------------------------------------------------ */

        const totalMatchedWeight =
            matchedPrimaryWeight +
            matchedSecondaryWeight;


        const primaryCoverage =
            primarySymptoms.length > 0
                ? matchedPrimaryCount /
                  primarySymptoms.length
                : 0;


        const userAlignment =
            userTotalWeight > 0
                ? totalMatchedWeight /
                  userTotalWeight
                : 0;


        let rawScore =
            (primaryCoverage * 0.65) +
            (userAlignment * 0.35);


        /*
         * Boost when multiple primary symptoms match.
         */
        if (matchedPrimaryCount >= 2) {

            rawScore *=
                1.0 +
                (matchedPrimaryCount * 0.15);
        }


        /*
         * Only include diseases with at least one match.
         */
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


    /* ----------------------------------------------------------------------
       Sort by score
       ---------------------------------------------------------------------- */

    scoredDiseases.sort(
        (a, b) =>
            b.rawScore - a.rawScore
    );


    /* ----------------------------------------------------------------------
       Calculate top confidence
       ---------------------------------------------------------------------- */

    const topMatch =
        scoredDiseases[0];


    const maxRaw =
        topMatch.rawScore;


    /*
     * UI confidence score.
     *
     * NOTE:
     * This is a heuristic matching score, NOT a medically validated
     * probability of having the disease.
     */

    let topConfidence =
        Math.min(
            98,
            Math.max(
                70,
                Math.round(
                    (topMatch.primaryCoverage * 60) +
                    (topMatch.matchedPrimaryCount * 10) +
                    20
                )
            )
        );


    topMatch.confidence =
        topConfidence;


    /* ----------------------------------------------------------------------
       Differential diagnoses
       ---------------------------------------------------------------------- */

    const differentials =
        scoredDiseases
            .slice(1, 4)
            .map(item => {

                const diffRatio =
                    item.rawScore /
                    (maxRaw || 1);


                const diffPct =
                    Math.max(
                        15,
                        Math.min(
                            Math.round(
                                topConfidence *
                                diffRatio *
                                0.85
                            ),
                            topConfidence - 8
                        )
                    );


                return {

                    disease: item.disease,

                    confidence: diffPct,

                    matchedPrimaryCount:
                        item.matchedPrimaryCount

                };

            });


    return {

        primary: topMatch,

        differentials,

        allScored: scoredDiseases

    };
}


/* ==========================================================================
   Update Diagnosis UI
   ========================================================================== */

function updateUI() {

    renderSelectedChips();


    const result =
        runInference();


    /* ----------------------------------------------------------------------
       No diagnosis
       ---------------------------------------------------------------------- */

    if (!result) {

        if (elements.idleStateCard) {
            elements.idleStateCard.style.display =
                'flex';
        }

        if (elements.diagnosisActiveContainer) {
            elements.diagnosisActiveContainer.style.display =
                'none';
        }

        return;
    }


    /* ----------------------------------------------------------------------
       Show diagnosis
       ---------------------------------------------------------------------- */

    if (elements.idleStateCard) {
        elements.idleStateCard.style.display =
            'none';
    }


    if (elements.diagnosisActiveContainer) {
        elements.diagnosisActiveContainer.style.display =
            'flex';
    }


    const primaryData =
        result.primary;


    const disease =
        primaryData.disease;


    /* ----------------------------------------------------------------------
       Main diagnosis information
       ---------------------------------------------------------------------- */

    setText(
        elements.diseaseName,
        disease.name
    );


    setText(
        elements.diseaseCategory,
        disease.category
    );


    setText(
        elements.confidenceScore,
        `${primaryData.confidence}%`
    );


    setText(
        elements.diseaseSummary,
        disease.summary
    );


    setText(
        elements.specialistValue,
        disease.recommendedSpecialist
    );


    setText(
        elements.urgencyValue,
        disease.urgency
    );


    setText(
        elements.clinicalInsightText,
        disease.clinicalInsight || ''
    );


    /* ----------------------------------------------------------------------
       Triage badge
       ---------------------------------------------------------------------- */

    if (elements.triageBadge) {

        elements.triageBadge.className =
            'triage-badge';


        switch (disease.severity) {

            case 'Mild':

                elements.triageBadge.classList.add(
                    'triage-mild'
                );

                elements.triageBadge.innerHTML =
                    '🟢 Mild Severity • Home Care';

                break;


            case 'Moderate':

                elements.triageBadge.classList.add(
                    'triage-moderate'
                );

                elements.triageBadge.innerHTML =
                    '🟡 Moderate Severity • Clinic Visit';

                break;


            case 'High':

                elements.triageBadge.classList.add(
                    'triage-high'
                );

                elements.triageBadge.innerHTML =
                    '🟠 High Severity • Urgent Attention';

                break;


            default:

                elements.triageBadge.classList.add(
                    'triage-critical'
                );

                elements.triageBadge.innerHTML =
                    '🔴 Critical • Immediate Emergency Triage';

                break;
        }
    }


    /* ----------------------------------------------------------------------
       Precautions
       ---------------------------------------------------------------------- */

    const precautions =
        Array.isArray(disease.precautions)
            ? disease.precautions
            : [];


    if (elements.precautionsList) {

        elements.precautionsList.innerHTML =
            precautions
                .map(item => `<li>${escapeHTML(item)}</li>`)
                .join('');
    }


    /* ----------------------------------------------------------------------
       Dietary recommendations
       ---------------------------------------------------------------------- */

    const dietaryAdvice =
        disease.dietaryAdvice || {};


    const recommended =
        Array.isArray(dietaryAdvice.recommended)
            ? dietaryAdvice.recommended
            : [];


    const avoid =
        Array.isArray(dietaryAdvice.avoid)
            ? dietaryAdvice.avoid
            : [];


    if (elements.dietRecommendedList) {

        elements.dietRecommendedList.innerHTML =
            recommended
                .map(item => `<li>${escapeHTML(item)}</li>`)
                .join('');
    }


    if (elements.dietAvoidList) {

        elements.dietAvoidList.innerHTML =
            avoid
                .map(item => `<li>${escapeHTML(item)}</li>`)
                .join('');
    }


    /* ----------------------------------------------------------------------
       Diagnostic tests
       ---------------------------------------------------------------------- */

    const diagnosticTests =
        Array.isArray(disease.diagnosticTests)
            ? disease.diagnosticTests
            : [];


    if (elements.testsList) {

        elements.testsList.innerHTML =
            diagnosticTests
                .map(item => `<li>${escapeHTML(item)}</li>`)
                .join('');
    }


    /* ----------------------------------------------------------------------
       Differential diagnoses
       ---------------------------------------------------------------------- */

    if (elements.differentialList) {

        if (result.differentials.length > 0) {

            elements.differentialList.innerHTML =
                result.differentials
                    .map(diff => {

                        return `
                            <div class="diff-item">

                                <div class="diff-name-box">

                                    <div class="diff-title">
                                        ${escapeHTML(
                                            diff.disease.name || 'Unknown'
                                        )}
                                    </div>

                                    <div class="diff-category">
                                        ${escapeHTML(
                                            diff.disease.category || ''
                                        )}
                                    </div>

                                </div>

                                <div class="diff-bar-wrapper">

                                    <div class="diff-progress-bg">

                                        <div
                                            class="diff-progress-fill"
                                            style="width:${diff.confidence}%"
                                        ></div>

                                    </div>

                                    <span class="diff-pct">
                                        ${diff.confidence}%
                                    </span>

                                </div>

                            </div>
                        `;

                    })
                    .join('');

        } else {

            elements.differentialList.innerHTML = `
                <div style="
                    font-size:0.8rem;
                    color:var(--text-dim);
                    padding:0.5rem 0;
                ">
                    No significant secondary differential
                    candidates detected.
                </div>
            `;
        }
    }


    /* ----------------------------------------------------------------------
       Live Mathematical Explanation
       ---------------------------------------------------------------------- */

    const matchedSymptomsList =
        [
            ...primaryData.matchedPrimaryNames,
            ...primaryData.matchedSecondaryNames
        ].join(', ');


    if (elements.liveMathExplanation) {

        elements.liveMathExplanation.innerHTML = `

            <strong>
                Step 1: Input Vector Encoding
            </strong>:

            User selected
            <strong>
                ${state.selectedSymptoms.size}
            </strong>
            symptoms.

            <br>

            <strong>
                Step 2: Weighted Overlap Calculation
            </strong>:

            Matched
            <strong>
                ${primaryData.matchedPrimaryCount}
            </strong>
            Primary and
            <strong>
                ${primaryData.matchedSecondaryCount}
            </strong>
            Secondary clinical markers
            (
                ${escapeHTML(
                    matchedSymptomsList || 'None'
                )}
            ).

            <br>

            <strong>
                Step 3: Score Normalization
            </strong>:

            Core symptom coverage =
            <strong>
                ${Math.round(
                    primaryData.primaryCoverage * 100
                )}%
            </strong>,

            yielding a matching confidence score of
            <strong>
                ${primaryData.confidence}%
            </strong>.

            <br><br>

            <small style="color:var(--text-dim);">
                Note: This is an algorithmic symptom-matching score,
                not a clinically validated diagnosis or medical probability.
            </small>
        `;
    }
}


/* ==========================================================================
   Accordion Interactivity
   ========================================================================== */

function toggleAccordion(headerElement) {

    if (!headerElement) return;


    const item =
        headerElement.parentElement;


    if (!item) return;


    const content =
        item.querySelector(
            '.accordion-content'
        );


    const arrow =
        headerElement.querySelector(
            'span:last-child'
        );


    if (!content) return;


    if (
        content.style.display === 'none' ||
        content.style.display === ''
    ) {

        content.style.display =
            'block';

        if (arrow) {
            arrow.textContent = '▲';
        }

    } else {

        content.style.display =
            'none';

        if (arrow) {
            arrow.textContent = '▼';
        }
    }
}


/* ==========================================================================
   Event Listeners
   ========================================================================== */

function setupEventListeners() {

    /* ----------------------------------------------------------------------
       Theme toggle
       ---------------------------------------------------------------------- */

    if (elements.themeToggleBtn) {

        elements.themeToggleBtn.addEventListener(
            'click',
            toggleTheme
        );
    }


    /* ----------------------------------------------------------------------
       Search
       ---------------------------------------------------------------------- */

    if (elements.symptomSearchInput) {

        elements.symptomSearchInput.addEventListener(
            'input',
            event => {

                state.searchQuery =
                    event.target.value;

                renderSymptomGrid();
            }
        );
    }


    /* ----------------------------------------------------------------------
       Clear all symptoms
       ---------------------------------------------------------------------- */

    if (elements.clearAllBtn) {

        elements.clearAllBtn.addEventListener(
            'click',
            () => {

                state.selectedSymptoms.clear();

                renderSymptomGrid();

                updateUI();
            }
        );
    }


    /* ----------------------------------------------------------------------
       Quick sample
       ---------------------------------------------------------------------- */

    if (elements.quickSampleBtn) {

        elements.quickSampleBtn.addEventListener(
            'click',
            () => {

                if (
                    typeof DEMO_PRESETS !== 'undefined' &&
                    Array.isArray(DEMO_PRESETS) &&
                    DEMO_PRESETS.length > 0
                ) {

                    loadPreset(
                        DEMO_PRESETS[0].symptoms || []
                    );

                } else {

                    console.error(
                        'MedSense AI: No demo presets available.'
                    );
                }
            }
        );
    }


    /* ----------------------------------------------------------------------
       Print report
       ---------------------------------------------------------------------- */

    if (elements.printReportBtn) {

        elements.printReportBtn.addEventListener(
            'click',
            () => {
                window.print();
            }
        );
    }
}


/* ==========================================================================
   Utility Functions
   ========================================================================== */

/**
 * Safely set textContent on an element.
 */
function setText(element, value) {

    if (!element) return;

    element.textContent =
        value == null ? '' : String(value);
}


/**
 * Escape HTML to prevent accidental HTML injection
 * when rendering dynamic text.
 */
function escapeHTML(value) {

    if (value == null) {
        return '';
    }

    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
