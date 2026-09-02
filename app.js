/**
 * MedSense AI - Core Application & Inference Engine
 * --------------------------------------------------
 * Probabilistic Bayesian & Weighted Symptom Matching
 * with Algorithmic Explainability.
 *
 * IMPORTANT:
 * This application provides an algorithmic symptom-matching
 * result and is NOT a medically validated diagnosis.
 */

/* ==========================================================================
   APPLICATION STATE
   ========================================================================== */

const state = {
    selectedSymptoms: new Set(),
    activeCategory: 'all',
    searchQuery: '',
    currentTheme: localStorage.getItem('medsense_theme') || 'dark'
};


/* ==========================================================================
   DOM ELEMENT REFERENCES
   ========================================================================== */

// Do NOT query the DOM here.
// The HTML may not have loaded yet.

let elements = {};


/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    initializeElements();

    initTheme();

    renderPresets();

    renderCategoryTabs();

    renderSymptomGrid();

    setupEventListeners();

    updateUI();

});


/* ==========================================================================
   INITIALIZE DOM ELEMENTS
   ========================================================================== */

function initializeElements() {

    elements = {

        /* Theme */
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        themeIcon: document.getElementById('themeIcon'),

        /* Main UI */
        presetsContainer: document.getElementById('presetsContainer'),
        categoryTabsContainer: document.getElementById('categoryTabsContainer'),
        symptomGrid: document.getElementById('symptomGrid'),
        symptomSearchInput: document.getElementById('symptomSearchInput'),

        /* Selected symptoms */
        selectedChipsContainer:
            document.getElementById('selectedChipsContainer'),

        selectedCountBadge:
            document.getElementById('selectedCountBadge'),

        clearAllBtn:
            document.getElementById('clearAllBtn'),

        /* Diagnosis */
        idleStateCard:
            document.getElementById('idleStateCard'),

        diagnosisActiveContainer:
            document.getElementById('diagnosisActiveContainer'),

        /* Diagnosis fields */
        diseaseName:
            document.getElementById('diseaseName'),

        diseaseCategory:
            document.getElementById('diseaseCategory'),

        confidenceScore:
            document.getElementById('confidenceScore'),

        triageBadge:
            document.getElementById('triageBadge'),

        diseaseSummary:
            document.getElementById('diseaseSummary'),

        specialistValue:
            document.getElementById('specialistValue'),

        urgencyValue:
            document.getElementById('urgencyValue'),

        clinicalInsightText:
            document.getElementById('clinicalInsightText'),

        /* Lists */
        precautionsList:
            document.getElementById('precautionsList'),

        dietRecommendedList:
            document.getElementById('dietRecommendedList'),

        dietAvoidList:
            document.getElementById('dietAvoidList'),

        testsList:
            document.getElementById('testsList'),

        differentialList:
            document.getElementById('differentialList'),

        /* Explanation */
        liveMathExplanation:
            document.getElementById('liveMathExplanation'),

        /* Buttons */
        printReportBtn:
            document.getElementById('printReportBtn'),

        quickSampleBtn:
            document.getElementById('quickSampleBtn')
    };


    console.log('MedSense AI: DOM initialized successfully.');

    checkRequiredElements();
}


/* ==========================================================================
   CHECK DOM ELEMENTS
   ========================================================================== */

function checkRequiredElements() {

    const required = [
        'themeToggleBtn',
        'presetsContainer',
        'categoryTabsContainer',
        'symptomGrid',
        'symptomSearchInput',
        'selectedChipsContainer',
        'selectedCountBadge',
        'clearAllBtn',
        'idleStateCard',
        'diagnosisActiveContainer'
    ];


    const missing = [];


    required.forEach(key => {

        if (!elements[key]) {
            missing.push(key);
        }

    });


    if (missing.length > 0) {

        console.warn(
            'MedSense AI: Missing HTML elements:',
            missing
        );

    }


    // themeIcon is intentionally optional.
    // If it doesn't exist, the application will create it.
    if (!elements.themeIcon && elements.themeToggleBtn) {

        const icon = document.createElement('span');

        icon.id = 'themeIcon';

        icon.setAttribute(
            'aria-hidden',
            'true'
        );

        icon.style.marginLeft = '6px';

        elements.themeToggleBtn.appendChild(icon);

        elements.themeIcon = icon;

        console.log(
            'MedSense AI: #themeIcon was missing and has been created automatically.'
        );
    }
}


/* ==========================================================================
   THEME MANAGEMENT
   ========================================================================== */

function initTheme() {

    document.documentElement.setAttribute(
        'data-theme',
        state.currentTheme
    );


    /*
     * Prevents:
     *
     * Cannot set properties of null
     *
     * even if #themeIcon does not exist.
     */

    if (elements.themeIcon) {

        elements.themeIcon.textContent =
            state.currentTheme === 'dark'
                ? '☀️'
                : '🌙';

    }
}


function toggleTheme() {

    state.currentTheme =
        state.currentTheme === 'dark'
            ? 'light'
            : 'dark';


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
            state.currentTheme === 'dark'
                ? '☀️'
                : '🌙';

    }
}


/* ==========================================================================
   PRESETS
   ========================================================================== */

function renderPresets() {

    if (!elements.presetsContainer) {
        return;
    }


    elements.presetsContainer.innerHTML = '';


    if (
        typeof DEMO_PRESETS === 'undefined' ||
        !Array.isArray(DEMO_PRESETS)
    ) {

        console.warn(
            'MedSense AI: DEMO_PRESETS is not defined.'
        );

        return;
    }


    DEMO_PRESETS.forEach(preset => {

        const button =
            document.createElement('button');


        button.type = 'button';

        button.className =
            'preset-chip';


        button.innerHTML = `
            <span>▶</span>
            ${escapeHTML(preset.title || 'Demo')}
        `;


        button.title =
            preset.description || '';


        button.addEventListener(
            'click',
            () => {

                loadPreset(
                    Array.isArray(preset.symptoms)
                        ? preset.symptoms
                        : []
                );

            }
        );


        elements.presetsContainer
            .appendChild(button);

    });
}


/* ==========================================================================
   LOAD PRESET
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
   CATEGORY TABS
   ========================================================================== */

function renderCategoryTabs() {

    if (!elements.categoryTabsContainer) {
        return;
    }


    /*
     * Remove generated category tabs.
     * Preserve an existing All tab if the HTML has one.
     */

    elements.categoryTabsContainer
        .querySelectorAll(
            '.category-tab:not([data-category="all"])'
        )
        .forEach(tab => tab.remove());


    if (
        typeof SYMPTOM_CATEGORIES === 'undefined' ||
        !SYMPTOM_CATEGORIES
    ) {

        console.warn(
            'MedSense AI: SYMPTOM_CATEGORIES is not defined.'
        );

        return;
    }


    /*
     * Check whether All tab already exists.
     */

    let allTab =
        elements.categoryTabsContainer
            .querySelector(
                '[data-category="all"]'
            );


    /*
     * Create All tab if it doesn't exist.
     */

    if (!allTab) {

        allTab =
            document.createElement('button');


        allTab.type = 'button';

        allTab.className =
            'category-tab';


        allTab.dataset.category =
            'all';


        allTab.innerHTML =
            '📋 All';


        elements.categoryTabsContainer
            .prepend(allTab);

    }


    updateCategoryTabState();


    /*
     * All tab listener
     */

    allTab.addEventListener(
        'click',
        () => {

            state.activeCategory =
                'all';

            updateCategoryTabState();

            renderSymptomGrid();

        }
    );


    /*
     * Other categories
     */

    Object.entries(
        SYMPTOM_CATEGORIES
    ).forEach(([key, category]) => {

        if (key === 'all') {
            return;
        }


        const button =
            document.createElement('button');


        button.type = 'button';

        button.className =
            'category-tab';


        button.dataset.category =
            key;


        button.innerHTML = `
            ${category.icon || ''}
            ${escapeHTML(category.name || key)}
        `;


        button.addEventListener(
            'click',
            () => {

                state.activeCategory =
                    key;

                updateCategoryTabState();

                renderSymptomGrid();

            }
        );


        elements.categoryTabsContainer
            .appendChild(button);

    });


    updateCategoryTabState();
}


/* ==========================================================================
   UPDATE CATEGORY TAB STATE
   ========================================================================== */

function updateCategoryTabState() {

    if (!elements.categoryTabsContainer) {
        return;
    }


    elements.categoryTabsContainer
        .querySelectorAll('.category-tab')
        .forEach(tab => {

            tab.classList.toggle(
                'active',
                tab.dataset.category ===
                state.activeCategory
            );

        });
}


/* ==========================================================================
   SYMPTOM GRID
   ========================================================================== */

function renderSymptomGrid() {

    if (!elements.symptomGrid) {
        return;
    }


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
        String(state.searchQuery || '')
            .toLowerCase()
            .trim();


    const filteredSymptoms =
        SYMPTOMS_LIST.filter(symptom => {

            const matchesCategory =
                state.activeCategory === 'all' ||
                symptom.category ===
                state.activeCategory;


            const symptomName =
                String(symptom.name || '')
                    .toLowerCase();


            const symptomId =
                String(symptom.id || '')
                    .toLowerCase();


            const matchesSearch =
                query === '' ||
                symptomName.includes(query) ||
                symptomId.includes(query);


            return (
                matchesCategory &&
                matchesSearch
            );

        });


    /*
     * No results
     */

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
                "<strong>${escapeHTML(
                    state.searchQuery
                )}</strong>".
            </div>
        `;


        return;
    }


    /*
     * Render symptoms
     */

    filteredSymptoms.forEach(symptom => {

        const selected =
            state.selectedSymptoms.has(
                symptom.id
            );


        const card =
            document.createElement('div');


        card.className =
            `symptom-card ${
                selected ? 'selected' : ''
            }`;


        card.setAttribute(
            'role',
            'button'
        );


        card.setAttribute(
            'tabindex',
            '0'
        );


        const categoryName =
            (
                typeof SYMPTOM_CATEGORIES !==
                'undefined' &&
                SYMPTOM_CATEGORIES &&
                SYMPTOM_CATEGORIES[
                    symptom.category
                ]
            )
                ? SYMPTOM_CATEGORIES[
                    symptom.category
                ].name
                : symptom.category || 'General';


        card.innerHTML = `

            <span class="symptom-icon">
                ${symptom.icon || '🩺'}
            </span>

            <div class="symptom-info">

                <div
                    class="symptom-name"
                    title="${escapeHTML(
                        symptom.name || ''
                    )}"
                >
                    ${escapeHTML(
                        symptom.name ||
                        'Unknown symptom'
                    )}
                </div>

                <div class="symptom-cat-badge">
                    ${escapeHTML(
                        categoryName
                    )}
                </div>

            </div>

            <div class="symptom-checkbox">
                ${selected ? '✓' : ''}
            </div>

        `;


        /*
         * Mouse click
         */

        card.addEventListener(
            'click',
            () => {

                toggleSymptom(
                    symptom.id
                );

            }
        );


        /*
         * Keyboard accessibility
         */

        card.addEventListener(
            'keydown',
            event => {

                if (
                    event.key === 'Enter' ||
                    event.key === ' '
                ) {

                    event.preventDefault();

                    toggleSymptom(
                        symptom.id
                    );

                }

            }
        );


        elements.symptomGrid
            .appendChild(card);

    });
}


/* ==========================================================================
   TOGGLE SYMPTOM
   ========================================================================== */

function toggleSymptom(symptomId) {

    if (
        state.selectedSymptoms.has(
            symptomId
        )
    ) {

        state.selectedSymptoms.delete(
            symptomId
        );

    } else {

        state.selectedSymptoms.add(
            symptomId
        );

    }


    renderSymptomGrid();

    updateUI();
}


/* ==========================================================================
   SELECTED SYMPTOM CHIPS
   ========================================================================== */

function renderSelectedChips() {

    if (
        !elements.selectedChipsContainer ||
        !elements.selectedCountBadge
    ) {

        return;
    }


    const count =
        state.selectedSymptoms.size;


    elements.selectedCountBadge.textContent =
        count;


    if (elements.clearAllBtn) {

        elements.clearAllBtn.style.display =
            count > 0
                ? 'inline-block'
                : 'none';

    }


    /*
     * Empty state
     */

    if (count === 0) {

        elements.selectedChipsContainer.innerHTML = `

            <span class="no-symptoms-placeholder">
                No symptoms selected yet.
                Click from the list below or use a quick demo preset.
            </span>

        `;

        return;
    }


    elements.selectedChipsContainer.innerHTML =
        '';


    state.selectedSymptoms
        .forEach(symptomId => {

            const symptom =
                SYMPTOMS_LIST.find(
                    item =>
                        item.id ===
                        symptomId
                );


            if (!symptom) {
                return;
            }


            const chip =
                document.createElement('div');


            chip.className =
                'selected-chip';


            chip.innerHTML = `

                <span>
                    ${symptom.icon || '🩺'}
                </span>

                <span>
                    ${escapeHTML(
                        symptom.name ||
                        'Unknown'
                    )}
                </span>

                <span
                    class="chip-remove-btn"
                    title="Remove ${escapeHTML(
                        symptom.name || ''
                    )}"
                    role="button"
                    tabindex="0"
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

                        toggleSymptom(
                            symptomId
                        );

                    }
                );


                removeButton.addEventListener(
                    'keydown',
                    event => {

                        if (
                            event.key === 'Enter' ||
                            event.key === ' '
                        ) {

                            event.preventDefault();

                            event.stopPropagation();

                            toggleSymptom(
                                symptomId
                            );

                        }

                    }
                );

            }


            elements.selectedChipsContainer
                .appendChild(chip);

        });
}


/* ==========================================================================
   INFERENCE ENGINE
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
        Array.from(
            state.selectedSymptoms
        );


    const scoredDiseases = [];


    /* ----------------------------------------------------------------------
       Symptom weight map
       ---------------------------------------------------------------------- */

    const symptomWeightMap =
        new Map();


    SYMPTOMS_LIST.forEach(symptom => {

        symptomWeightMap.set(
            symptom.id,
            Number(symptom.weight) || 2.0
        );

    });


    /* ----------------------------------------------------------------------
       Total user symptom weight
       ---------------------------------------------------------------------- */

    let userTotalWeight = 0;


    selectedArray.forEach(id => {

        userTotalWeight +=
            symptomWeightMap.get(id) ||
            2.0;

    });


    /* ----------------------------------------------------------------------
       Score diseases
       ---------------------------------------------------------------------- */

    DISEASES_DATABASE.forEach(disease => {

        const primarySymptoms =
            Array.isArray(
                disease.primarySymptoms
            )
                ? disease.primarySymptoms
                : [];


        const secondarySymptoms =
            Array.isArray(
                disease.secondarySymptoms
            )
                ? disease.secondarySymptoms
                : [];


        let matchedPrimaryWeight = 0;

        let matchedSecondaryWeight = 0;

        let matchedPrimaryCount = 0;

        let matchedSecondaryCount = 0;


        const matchedPrimaryNames = [];

        const matchedSecondaryNames = [];


        /* Primary symptoms */

        primarySymptoms.forEach(
            symptomId => {

                if (
                    state.selectedSymptoms
                        .has(symptomId)
                ) {

                    const weight =
                        symptomWeightMap.get(
                            symptomId
                        ) || 2.0;


                    matchedPrimaryWeight +=
                        weight;


                    matchedPrimaryCount++;


                    const symptom =
                        SYMPTOMS_LIST.find(
                            item =>
                                item.id ===
                                symptomId
                        );


                    if (symptom) {

                        matchedPrimaryNames
                            .push(
                                symptom.name
                            );

                    }

                }

            }
        );


        /* Secondary symptoms */

        secondarySymptoms.forEach(
            symptomId => {

                if (
                    state.selectedSymptoms
                        .has(symptomId)
                ) {

                    const weight =
                        symptomWeightMap.get(
                            symptomId
                        ) || 2.0;


                    matchedSecondaryWeight +=
                        weight * 0.45;


                    matchedSecondaryCount++;


                    const symptom =
                        SYMPTOMS_LIST.find(
                            item =>
                                item.id ===
                                symptomId
                        );


                    if (symptom) {

                        matchedSecondaryNames
                            .push(
                                symptom.name
                            );

                    }

                }

            }
        );


        /* Total */

        const totalMatchedWeight =
            matchedPrimaryWeight +
            matchedSecondaryWeight;


        /* Coverage */

        const primaryCoverage =
            primarySymptoms.length > 0
                ? matchedPrimaryCount /
                  primarySymptoms.length
                : 0;


        /* User alignment */

        const userAlignment =
            userTotalWeight > 0
                ? totalMatchedWeight /
                  userTotalWeight
                : 0;


        /*
         * Combined score.
         */

        let rawScore =
            (primaryCoverage * 0.65) +
            (userAlignment * 0.35);


        /*
         * Multiple primary symptom boost.
         */

        if (
            matchedPrimaryCount >= 2
        ) {

            rawScore *=
                1 +
                (
                    matchedPrimaryCount *
                    0.15
                );

        }


        /*
         * Only include diseases with
         * at least one matched symptom.
         */

        if (
            totalMatchedWeight > 0
        ) {

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


    if (
        scoredDiseases.length === 0
    ) {

        return null;
    }


    /* ----------------------------------------------------------------------
       Sort
       ---------------------------------------------------------------------- */

    scoredDiseases.sort(
        (a, b) =>
            b.rawScore -
            a.rawScore
    );


    /* ----------------------------------------------------------------------
       Top match
       ---------------------------------------------------------------------- */

    const topMatch =
        scoredDiseases[0];


    const maxRaw =
        topMatch.rawScore;


    /*
     * IMPORTANT:
     *
     * This is a UI confidence heuristic,
     * not a medically validated probability.
     */

    const calculatedConfidence =
        Math.round(
            (topMatch.primaryCoverage * 60) +
            (topMatch.matchedPrimaryCount * 10) +
            20
        );


    const topConfidence =
        Math.min(
            98,
            Math.max(
                70,
                calculatedConfidence
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


                const calculatedDiff =
                    Math.round(
                        topConfidence *
                        diffRatio *
                        0.85
                    );


                const diffPct =
                    Math.max(
                        15,
                        Math.min(
                            calculatedDiff,
                            topConfidence - 8
                        )
                    );


                return {

                    disease:
                        item.disease,

                    confidence:
                        diffPct,

                    matchedPrimaryCount:
                        item.matchedPrimaryCount

                };

            });


    return {

        primary:
            topMatch,

        differentials,

        allScored:
            scoredDiseases

    };
}


/* ==========================================================================
   UPDATE UI
   ========================================================================== */

function updateUI() {

    renderSelectedChips();


    const result =
        runInference();


    /*
     * No result
     */

    if (!result) {

        if (elements.idleStateCard) {

            elements.idleStateCard.style.display =
                'flex';

        }


        if (
            elements.diagnosisActiveContainer
        ) {

            elements.diagnosisActiveContainer
                .style.display =
                'none';

        }


        return;
    }


    /*
     * Show result
     */

    if (elements.idleStateCard) {

        elements.idleStateCard.style.display =
            'none';

    }


    if (
        elements.diagnosisActiveContainer
    ) {

        elements.diagnosisActiveContainer
            .style.display =
            'flex';

    }


    const primaryData =
        result.primary;


    const disease =
        primaryData.disease;


    /* ----------------------------------------------------------------------
       Main fields
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
       Triage
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

    renderList(
        elements.precautionsList,
        disease.precautions
    );


    /* ----------------------------------------------------------------------
       Diet
       ---------------------------------------------------------------------- */

    const dietaryAdvice =
        disease.dietaryAdvice || {};


    renderList(
        elements.dietRecommendedList,
        dietaryAdvice.recommended
    );


    renderList(
        elements.dietAvoidList,
        dietaryAdvice.avoid
    );


    /* ----------------------------------------------------------------------
       Tests
       ---------------------------------------------------------------------- */

    renderList(
        elements.testsList,
        disease.diagnosticTests
    );


    /* ----------------------------------------------------------------------
       Differential
       ---------------------------------------------------------------------- */

    renderDifferentials(
        result.differentials
    );


    /* ----------------------------------------------------------------------
       Mathematical explanation
       ---------------------------------------------------------------------- */

    renderMathExplanation(
        primaryData
    );
}


/* ==========================================================================
   RENDER LIST
   ========================================================================== */

function renderList(
    element,
    items
) {

    if (!element) {
        return;
    }


    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        element.innerHTML =
            '<li>None specified.</li>';

        return;
    }


    element.innerHTML =
        items
            .map(
                item =>
                    `<li>${escapeHTML(
                        item
                    )}</li>`
            )
            .join('');
}


/* ==========================================================================
   DIFFERENTIAL RENDERING
   ========================================================================== */

function renderDifferentials(
    differentials
) {

    if (!elements.differentialList) {
        return;
    }


    if (
        !Array.isArray(differentials) ||
        differentials.length === 0
    ) {

        elements.differentialList.innerHTML = `

            <div style="
                font-size:0.8rem;
                color:var(--text-dim);
                padding:0.5rem 0;
            ">
                No significant secondary
                differential candidates detected.
            </div>

        `;

        return;
    }


    elements.differentialList.innerHTML =
        differentials
            .map(diff => {

                const name =
                    diff.disease?.name ||
                    'Unknown';


                const category =
                    diff.disease?.category ||
                    '';


                return `

                    <div class="diff-item">

                        <div class="diff-name-box">

                            <div class="diff-title">
                                ${escapeHTML(name)}
                            </div>

                            <div class="diff-category">
                                ${escapeHTML(category)}
                            </div>

                        </div>


                        <div class="diff-bar-wrapper">

                            <div class="diff-progress-bg">

                                <div
                                    class="diff-progress-fill"
                                    style="
                                        width:${diff.confidence}%;
                                    "
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
}


/* ==========================================================================
   MATHEMATICAL EXPLANATION
   ========================================================================== */

function renderMathExplanation(
    primaryData
) {

    if (!elements.liveMathExplanation) {
        return;
    }


    const matchedSymptoms = [
        ...primaryData.matchedPrimaryNames,
        ...primaryData.matchedSecondaryNames
    ];


    const matchedSymptomsList =
        matchedSymptoms.length > 0
            ? matchedSymptoms.join(', ')
            : 'None';


    const coverage =
        Math.round(
            primaryData.primaryCoverage *
            100
        );


    elements.liveMathExplanation.innerHTML = `

        <strong>
            Step 1: Input Vector Encoding
        </strong>

        : User selected

        <strong>
            ${state.selectedSymptoms.size}
        </strong>

        symptoms.

        <br><br>

        <strong>
            Step 2: Weighted Overlap Calculation
        </strong>

        : Matched

        <strong>
            ${primaryData.matchedPrimaryCount}
        </strong>

        Primary and

        <strong>
            ${primaryData.matchedSecondaryCount}
        </strong>

        Secondary clinical markers:

        <strong>
            ${escapeHTML(
                matchedSymptomsList
            )}
        </strong>.

        <br><br>

        <strong>
            Step 3: Score Normalization
        </strong>

        : Core symptom coverage =

        <strong>
            ${coverage}%
        </strong>.

        The resulting algorithmic matching
        confidence score is

        <strong>
            ${primaryData.confidence}%
        </strong>.

        <br><br>

        <small style="color:var(--text-dim);">

            This score is generated from the application's
            symptom-weighting algorithm. It is not a
            clinically validated probability or diagnosis.

        </small>
    `;
}


/* ==========================================================================
   ACCORDION
   ========================================================================== */

function toggleAccordion(
    headerElement
) {

    if (!headerElement) {
        return;
    }


    const item =
        headerElement.parentElement;


    if (!item) {
        return;
    }


    const content =
        item.querySelector(
            '.accordion-content'
        );


    const arrow =
        headerElement.querySelector(
            'span:last-child'
        );


    if (!content) {
        return;
    }


    const isClosed =
        content.style.display === 'none' ||
        content.style.display === '';


    if (isClosed) {

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
   EVENT LISTENERS
   ========================================================================== */

function setupEventListeners() {

    /* ----------------------------------------------------------------------
       Theme
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
                    event.target.value || '';

                renderSymptomGrid();

            }
        );

    }


    /* ----------------------------------------------------------------------
       Clear all
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
                    typeof DEMO_PRESETS !==
                        'undefined' &&
                    Array.isArray(
                        DEMO_PRESETS
                    ) &&
                    DEMO_PRESETS.length > 0
                ) {

                    loadPreset(
                        DEMO_PRESETS[0]
                            .symptoms || []
                    );

                } else {

                    console.warn(
                        'MedSense AI: No demo preset found.'
                    );

                }

            }
        );

    }


    /* ----------------------------------------------------------------------
       Print
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
   UTILITY: SET TEXT
   ========================================================================== */

function setText(
    element,
    value
) {

    if (!element) {
        return;
    }


    element.textContent =
        value == null
            ? ''
            : String(value);
}


/* ==========================================================================
   UTILITY: ESCAPE HTML
   ========================================================================== */

function escapeHTML(value) {

    if (value == null) {
        return '';
    }


    return String(value)
        .replace(
            /&/g,
            '&amp;'
        )
        .replace(
            /</g,
            '&lt;'
        )
        .replace(
            />/g,
            '&gt;'
        )
        .replace(
            /"/g,
            '&quot;'
        )
        .replace(
            /'/g,
            '&#039;'
        );
}


/* ==========================================================================
   GLOBAL ERROR HELPER
   ========================================================================== */

/*
 * Expose these functions globally if your HTML uses inline handlers such as:
 *
 * onclick="toggleAccordion(this)"
 */

window.toggleAccordion =
    toggleAccordion;

window.toggleSymptom =
    toggleSymptom;

window.loadPreset =
    loadPreset;
