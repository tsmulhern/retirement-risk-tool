/**
 * RetireSecure™ Risk Analyzer - Main Application Script
 * Handles UI interactions, form management, and PDF processing
 */

// Application State
const AppState = {
    currentSection: 0,
    formData: {},
    gapAnalysisData: null,
    supplementalData: null,
    scores: null,
    
    // Form sections configuration
    sections: [
        {
            id: 'tax',
            title: 'Tax Risk Assessment',
            icon: '💰',
            questions: [
                {
                    id: 'tax_preTaxBalance',
                    label: 'Total balance in pre-tax retirement accounts (401k, Traditional IRA, etc.)',
                    type: 'number',
                    prefix: '$',
                    required: true
                },
                {
                    id: 'tax_rothBalance',
                    label: 'Total balance in Roth accounts (Roth IRA, Roth 401k)',
                    type: 'number',
                    prefix: '$',
                    required: true
                },
                {
                    id: 'tax_taxableBalance',
                    label: 'Total balance in taxable brokerage accounts',
                    type: 'number',
                    prefix: '$',
                    required: true
                },
                {
                    id: 'tax_state',
                    label: 'State of residence',
                    type: 'select',
                    options: ['-- Select --', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'],
                    required: true
                }
            ]
        },
        {
            id: 'market',
            title: 'Market / Sequence of Returns Risk',
            icon: '📈',
            questions: [
                {
                    id: 'market_portfolioBalance',
                    label: 'Total investable portfolio balance',
                    type: 'number',
                    prefix: '$',
                    required: true
                },
                {
                    id: 'market_annualIncome',
                    label: 'Required annual retirement income',
                    type: 'number',
                    prefix: '$',
                    required: true
                },
                {
                    id: 'market_pensionIncome',
                    label: 'Annual guaranteed pension income',
                    type: 'number',
                    prefix: '$',
                    required: true
                },
                {
                    id: 'market_ssIncome',
                    label: 'Expected annual Social Security income',
                    type: 'number',
                    prefix: '$',
                    required: true
                },
                {
                    id: 'market_equityAllocation',
                    label: 'Current equity (stock) allocation percentage',
                    type: 'number',
                    suffix: '%',
                    required: true
                },
                {
                    id: 'market_plannedRetirementAge',
                    label: 'Planned retirement age',
                    type: 'number',
                    required: true
                }
            ]
        },
        {
            id: 'inflation',
            title: 'Inflation Risk Assessment',
            icon: '💵',
            questions: [
                {
                    id: 'inflation_pensionCOLA',
                    label: 'Does your pension include annual cost-of-living adjustments (COLA)?',
                    type: 'radio',
                    options: [
                        { value: 'yes', label: 'Yes - pension includes COLA' },
                        { value: 'no', label: 'No - fixed pension amount' },
                        { value: 'partial', label: 'Partial COLA (capped or limited)' },
                        { value: 'unknown', label: 'Unknown / No pension' }
                    ],
                    required: true
                }
            ]
        },
        {
            id: 'longevity',
            title: 'Longevity Risk Assessment',
            icon: '⏰',
            questions: [
                {
                    id: 'longevity_familyHistory',
                    label: 'Family history of longevity',
                    type: 'radio',
                    options: [
                        { value: 'long', label: 'Family members typically live into their 90s or beyond' },
                        { value: 'average', label: 'Average lifespan (late 70s to mid 80s)' },
                        { value: 'short', label: 'Family history of shorter lifespans' },
                        { value: 'unknown', label: 'Unknown' }
                    ],
                    required: true
                }
            ]
        },
        {
            id: 'ltc',
            title: 'Long-Term Care Risk Assessment',
            icon: '🏥',
            questions: [
                {
                    id: 'ltc_clientCoverage',
                    label: 'Client long-term care insurance coverage',
                    type: 'select',
                    options: ['-- Select --', 'Traditional LTC policy', 'Hybrid Life/LTC policy', 'Hybrid Annuity/LTC policy', 'No coverage', 'Planning to purchase'],
                    required: true
                },
                {
                    id: 'ltc_spouseCoverage',
                    label: 'Spouse long-term care insurance coverage',
                    type: 'select',
                    options: ['-- Select --', 'Traditional LTC policy', 'Hybrid Life/LTC policy', 'Hybrid Annuity/LTC policy', 'No coverage', 'Planning to purchase', 'No spouse'],
                    required: true
                }
            ]
        },
        {
            id: 'earlyRetirement',
            title: 'Involuntary Early Retirement Risk',
            icon: '⚠️',
            questions: [
                {
                    id: 'earlyRetirement_clientDisability',
                    label: 'Client disability insurance coverage',
                    type: 'select',
                    options: ['-- Select --', 'Individual own-occupation policy', 'Employer group LTD only', 'Both individual and employer', 'No coverage'],
                    required: true
                },
                {
                    id: 'earlyRetirement_spouseDisability',
                    label: 'Spouse disability insurance coverage',
                    type: 'select',
                    options: ['-- Select --', 'Individual own-occupation policy', 'Employer group LTD only', 'Both individual and employer', 'No coverage', 'No spouse'],
                    required: true
                }
            ]
        }
    ]
};

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    setupEventListeners();
    renderCurrentSection();
}

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // Start assessment button
    const startBtn = document.getElementById('startAssessment');
    if (startBtn) {
        startBtn.addEventListener('click', startAssessment);
    }

    // Navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', previousSection);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSection);
    }

    // Results buttons
    const printBtn = document.getElementById('printBtn');
    const restartBtn = document.getElementById('restartBtn');
    
    if (printBtn) {
        printBtn.addEventListener('click', () => window.print());
    }
    if (restartBtn) {
        restartBtn.addEventListener('click', restartAssessment);
    }

    // PDF upload handlers
    const gapAnalysisUpload = document.getElementById('gapAnalysisUpload');
    const supplementalUpload = document.getElementById('supplementalUpload');
    
    if (gapAnalysisUpload) {
        gapAnalysisUpload.addEventListener('change', handleGapAnalysisUpload);
    }
    if (supplementalUpload) {
        supplementalUpload.addEventListener('change', handleSupplementalUpload);
    }
}

/**
 * Handle Gap Analysis PDF upload
 */
async function handleGapAnalysisUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById('gapAnalysisStatus');
    statusEl.textContent = 'Processing PDF...';
    statusEl.className = 'upload-status processing';

    try {
        const data = await PDFParser.parseGapAnalysis(file);
        AppState.gapAnalysisData = data;
        
        // Merge with existing supplemental data if available
        if (AppState.supplementalData) {
            AppState.formData = PDFParser.mergeData(data, AppState.supplementalData);
        } else {
            AppState.formData = { ...AppState.formData, ...data };
        }
        
        statusEl.textContent = '✓ Gap Analysis data loaded successfully!';
        statusEl.className = 'upload-status success';
        
        // Prefill form fields
        prefillFormFields();
        
    } catch (error) {
        console.error('Gap Analysis upload error:', error);
        statusEl.textContent = '✗ Error: ' + error.message;
        statusEl.className = 'upload-status error';
    }
}

/**
 * Handle Supplemental Form PDF upload
 */
async function handleSupplementalUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const statusEl = document.getElementById('supplementalStatus');
    statusEl.textContent = 'Processing PDF...';
    statusEl.className = 'upload-status processing';

    try {
        const data = await PDFParser.parseSupplementalForm(file);
        AppState.supplementalData = data;
        
        // Merge with existing gap analysis data if available
        if (AppState.gapAnalysisData) {
            AppState.formData = PDFParser.mergeData(AppState.gapAnalysisData, data);
        } else {
            AppState.formData = { ...AppState.formData, ...data };
        }
        
        statusEl.textContent = '✓ Supplemental form data loaded successfully!';
        statusEl.className = 'upload-status success';
        
        // Prefill form fields
        prefillFormFields();
        
    } catch (error) {
        console.error('Supplemental upload error:', error);
        statusEl.textContent = '✗ Error: ' + error.message;
        statusEl.className = 'upload-status error';
    }
}

/**
 * Prefill form fields with uploaded data
 */
function prefillFormFields() {
    // Map uploaded data to form fields
    const fieldMappings = {
        // Tax risk fields
        'tax_preTaxBalance': (data) => data.retirementAccountBalance || '',
        'tax_rothBalance': (data) => data.rothCombinedBalance || '',
        'tax_taxableBalance': (data) => data.brokerageBalance || '',
        'tax_state': (data) => data.tax_state || '',
        
        // Market risk fields
        'market_portfolioBalance': (data) => data.retirementAccountBalance || '',
        'market_annualIncome': (data) => data.combinedIncome || '',
        'market_pensionIncome': (data) => data.hasPension ? 50000 : 0,
        'market_ssIncome': (data) => data.hasSocialSecurity ? 40000 : 0,
        'market_equityAllocation': (data) => {
            const allocation = data.equityAllocation || '';
            if (allocation.includes('0-20')) return 10;
            if (allocation.includes('21-40')) return 30;
            if (allocation.includes('41-60')) return 50;
            if (allocation.includes('61-80')) return 70;
            if (allocation.includes('81-100')) return 90;
            return 60;
        },
        'market_plannedRetirementAge': (data) => data.plannedRetirementAge || 65,
        
        // Inflation risk fields
        'inflation_pensionCOLA': (data) => data.inflation_pensionCOLA || 'unknown',
        
        // Longevity risk fields
        'longevity_familyHistory': (data) => 'average',
        
        // LTC risk fields
        'ltc_clientCoverage': (data) => {
            const coverage = data.clientLTCInsurance || '';
            if (coverage.includes('Traditional')) return 'Traditional LTC policy';
            if (coverage.includes('Hybrid Life')) return 'Hybrid Life/LTC policy';
            if (coverage.includes('Hybrid Annuity')) return 'Hybrid Annuity/LTC policy';
            if (coverage === 'None') return 'No coverage';
            return '-- Select --';
        },
        'ltc_spouseCoverage': (data) => {
            const coverage = data.spouseLTCInsurance || '';
            if (coverage.includes('Traditional')) return 'Traditional LTC policy';
            if (coverage.includes('Hybrid Life')) return 'Hybrid Life/LTC policy';
            if (coverage.includes('Hybrid Annuity')) return 'Hybrid Annuity/LTC policy';
            if (coverage === 'None') return 'No coverage';
            return '-- Select --';
        },
        
        // Early retirement risk fields
        'earlyRetirement_clientDisability': (data) => {
            const coverage = data.clientDisabilityInsurance || '';
            if (coverage.includes('Individual')) return 'Individual own-occupation policy';
            if (coverage.includes('Employer')) return 'Employer group LTD only';
            if (coverage.includes('Both')) return 'Both individual and employer';
            if (coverage.includes('None')) return 'No coverage';
            return '-- Select --';
        },
        'earlyRetirement_spouseDisability': (data) => {
            const coverage = data.spouseDisabilityInsurance || '';
            if (coverage.includes('Individual')) return 'Individual own-occupation policy';
            if (coverage.includes('Employer')) return 'Employer group LTD only';
            if (coverage.includes('Both')) return 'Both individual and employer';
            if (coverage.includes('None')) return 'No coverage';
            return '-- Select --';
        }
    };

    // Apply mappings
    for (const [fieldId, mapper] of Object.entries(fieldMappings)) {
        const value = mapper(AppState.formData);
        if (value) {
            AppState.formData[fieldId] = value;
        }
    }
}

/**
 * Start the assessment
 */
function startAssessment() {
    document.getElementById('welcomeSection').style.display = 'none';
    document.getElementById('assessmentSection').style.display = 'block';
    AppState.currentSection = 0;
    renderCurrentSection();
    updateProgress();
}

/**
 * Render the current section
 */
function renderCurrentSection() {
    const section = AppState.sections[AppState.currentSection];
    const formContent = document.getElementById('formContent');
    
    if (!section) {
        showResults();
        return;
    }

    let html = `
        <div class="section-header">
            <div class="section-icon">${section.icon}</div>
            <h2>${section.title}</h2>
        </div>
    `;

    section.questions.forEach(question => {
        html += renderQuestion(question);
    });

    formContent.innerHTML = html;
    
    // Restore saved values
    section.questions.forEach(question => {
        const savedValue = AppState.formData[question.id];
        if (savedValue !== undefined) {
            const input = document.getElementById(question.id);
            if (input) {
                if (question.type === 'radio') {
                    const radio = document.querySelector(`input[name="${question.id}"][value="${savedValue}"]`);
                    if (radio) radio.checked = true;
                } else {
                    input.value = savedValue;
                }
            }
        }
    });

    updateNavigationButtons();
}

/**
 * Render a single question
 */
function renderQuestion(question) {
    let html = '<div class="question-group">';
    html += `<label class="question-label" for="${question.id}">${question.label}</label>`;

    if (question.type === 'number') {
        html += `
            <div class="input-group">
                ${question.prefix ? `<span class="input-prefix">${question.prefix}</span>` : ''}
                <input 
                    type="number" 
                    id="${question.id}" 
                    class="question-input" 
                    ${question.required ? 'required' : ''}
                    min="0"
                    step="1"
                >
                ${question.suffix ? `<span class="input-suffix">${question.suffix}</span>` : ''}
            </div>
        `;
    } else if (question.type === 'select') {
        html += `<select id="${question.id}" class="question-select" ${question.required ? 'required' : ''}>`;
        question.options.forEach(option => {
            html += `<option value="${option}">${option}</option>`;
        });
        html += '</select>';
    } else if (question.type === 'radio') {
        html += '<div class="radio-group">';
        question.options.forEach(option => {
            html += `
                <div class="radio-option">
                    <input 
                        type="radio" 
                        name="${question.id}" 
                        id="${question.id}_${option.value}" 
                        value="${option.value}"
                        ${question.required ? 'required' : ''}
                    >
                    <label for="${question.id}_${option.value}">${option.label}</label>
                </div>
            `;
        });
        html += '</div>';
    }

    html += '</div>';
    return html;
}

/**
 * Update navigation buttons
 */
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    prevBtn.style.display = AppState.currentSection > 0 ? 'inline-flex' : 'none';
    nextBtn.textContent = AppState.currentSection === AppState.sections.length - 1 ? 'Calculate Results →' : 'Next →';
}

/**
 * Update progress bar
 */
function updateProgress() {
    const progress = ((AppState.currentSection + 1) / AppState.sections.length) * 100;
    document.getElementById('progressFill').style.width = progress + '%';
    document.getElementById('progressText').textContent = `Section ${AppState.currentSection + 1} of ${AppState.sections.length}`;
}

/**
 * Save current section data
 */
function saveCurrentSection() {
    const section = AppState.sections[AppState.currentSection];
    
    section.questions.forEach(question => {
        if (question.type === 'radio') {
            const selected = document.querySelector(`input[name="${question.id}"]:checked`);
            if (selected) {
                AppState.formData[question.id] = selected.value;
            }
        } else {
            const input = document.getElementById(question.id);
            if (input) {
                AppState.formData[question.id] = input.value;
            }
        }
    });
}

/**
 * Validate current section
 */
function validateCurrentSection() {
    const section = AppState.sections[AppState.currentSection];
    let isValid = true;

    section.questions.forEach(question => {
        if (question.required) {
            if (question.type === 'radio') {
                const selected = document.querySelector(`input[name="${question.id}"]:checked`);
                if (!selected) {
                    isValid = false;
                    alert(`Please answer: ${question.label}`);
                }
            } else {
                const input = document.getElementById(question.id);
                if (input && !input.value) {
                    isValid = false;
                    alert(`Please answer: ${question.label}`);
                }
            }
        }
    });

    return isValid;
}

/**
 * Move to previous section
 */
function previousSection() {
    saveCurrentSection();
    AppState.currentSection--;
    renderCurrentSection();
    updateProgress();
    window.scrollTo(0, 0);
}

/**
 * Move to next section
 */
function nextSection() {
    if (!validateCurrentSection()) {
        return;
    }

    saveCurrentSection();

    if (AppState.currentSection === AppState.sections.length - 1) {
        calculateResults();
    } else {
        AppState.currentSection++;
        renderCurrentSection();
        updateProgress();
        window.scrollTo(0, 0);
    }
}

/**
 * Calculate results using the RiskScorer
 */
function calculateResults() {
    // Convert form data types
    const processedData = {};
    
    for (const [key, value] of Object.entries(AppState.formData)) {
        if (key.includes('Balance') || key.includes('Income') || key.includes('Allocation') || key.includes('Age') || key.includes('Benefit')) {
            processedData[key] = parseFloat(value) || 0;
        } else {
            processedData[key] = value;
        }
    }

    // Calculate scores
    AppState.scores = RiskScorer.calculateAllScores(processedData);
    
    // Calculate overall score
    const overallScore = RiskScorer.calculateOverallScore(AppState.scores);
    AppState.scores.overall = {
        score: overallScore,
        level: RiskScorer.getRiskLevel(overallScore)
    };

    showResults();
}

/**
 * Show results section
 */
function showResults() {
    document.getElementById('assessmentSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    renderResults();
    window.scrollTo(0, 0);
}

/**
 * Render results
 */
function renderResults() {
    // Overall score
    const overallScoreEl = document.getElementById('overallScore');
    const overallGaugeFill = document.getElementById('overallGaugeFill');
    const overallRiskLevel = document.getElementById('overallRiskLevel');

    overallScoreEl.textContent = AppState.scores.overall.score.toFixed(1);
    overallGaugeFill.style.width = (AppState.scores.overall.score * 10) + '%';
    overallRiskLevel.textContent = AppState.scores.overall.level;

    // Individual risk cards
    const resultsContent = document.getElementById('resultsContent');
    let html = '';

    const categories = [
        { key: 'tax', title: 'Tax Risk', icon: '💰' },
        { key: 'market', title: 'Market / Sequence of Returns Risk', icon: '📈' },
        { key: 'inflation', title: 'Inflation Risk', icon: '💵' },
        { key: 'longevity', title: 'Longevity Risk', icon: '⏰' },
        { key: 'ltc', title: 'Long-Term Care Risk', icon: '🏥' },
        { key: 'earlyRetirement', title: 'Involuntary Early Retirement Risk', icon: '⚠️' }
    ];

    categories.forEach(category => {
        const result = AppState.scores[category.key];
        const riskClass = result.level.toLowerCase().replace(/ /g, '-');
        const color = RiskScorer.getRiskColor(result.level);

        html += `
            <div class="risk-card ${riskClass}">
                <div class="risk-card-header">
                    <div class="risk-card-title">
                        <span class="risk-icon">${category.icon}</span>
                        ${category.title}
                    </div>
                    <div class="risk-score">
                        <span class="score-number" style="color: ${color}">${result.score.toFixed(1)}</span>
                        <span class="score-badge ${riskClass}">${result.level}</span>
                    </div>
                </div>
        `;

        if (result.reasons && result.reasons.length > 0) {
            html += '<div class="risk-reasons"><h4>Assessment Factors:</h4><ul>';
            result.reasons.forEach(reason => {
                html += `<li>${reason}</li>`;
            });
            html += '</ul></div>';
        }

        if (result.recommendations && result.recommendations.length > 0) {
            html += '<div class="recommendations"><h4>📋 Recommended Actions:</h4><ul class="recommendation-list">';
            result.recommendations.forEach(rec => {
                html += `<li><strong>${rec.title}:</strong> ${rec.description}</li>`;
            });
            html += '</ul></div>';
        }

        html += '</div>';
    });

    resultsContent.innerHTML = html;
}

/**
 * Restart assessment
 */
function restartAssessment() {
    AppState.currentSection = 0;
    AppState.formData = {};
    AppState.gapAnalysisData = null;
    AppState.supplementalData = null;
    AppState.scores = null;
    
    // Clear upload status
    document.getElementById('gapAnalysisStatus').textContent = '';
    document.getElementById('supplementalStatus').textContent = '';
    document.getElementById('gapAnalysisUpload').value = '';
    document.getElementById('supplementalUpload').value = '';
    
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('welcomeSection').style.display = 'block';
    
    window.scrollTo(0, 0);
}
