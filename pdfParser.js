/* ===================================
   GLOBAL STYLES
   =================================== */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --primary-color: #1e3a5f;
    --secondary-color: #d4af37;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
    --text-dark: #1f2937;
    --text-light: #6b7280;
    --bg-light: #f9fafb;
    --border-color: #e5e7eb;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: var(--text-dark);
    background-color: var(--bg-light);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* ===================================
   HEADER
   =================================== */
.header {
    background: linear-gradient(135deg, var(--primary-color) 0%, #2c5282 100%);
    color: white;
    padding: 2rem 0;
    box-shadow: var(--shadow-md);
}

.header-content {
    text-align: center;
}

.logo {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--secondary-color);
}

.tagline {
    font-size: 1.1rem;
    font-weight: 300;
    opacity: 0.9;
}

/* ===================================
   MAIN CONTENT
   =================================== */
.main-content {
    padding: 3rem 0;
    min-height: calc(100vh - 200px);
}

/* ===================================
   WELCOME SECTION
   =================================== */
.welcome-card {
    background: white;
    border-radius: 12px;
    padding: 3rem;
    box-shadow: var(--shadow-lg);
    text-align: center;
}

.welcome-card h2 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.lead {
    font-size: 1.2rem;
    color: var(--text-light);
    margin-bottom: 2rem;
}

.risk-categories {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
    margin: 2rem 0;
}

.category-pill {
    background-color: var(--bg-light);
    border: 2px solid var(--primary-color);
    color: var(--primary-color);
    padding: 0.75rem 1.5rem;
    border-radius: 50px;
    font-weight: 500;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.category-pill:hover {
    background-color: var(--primary-color);
    color: white;
    transform: translateY(-2px);
}

/* ===================================
   UPLOAD SECTION
   =================================== */
.upload-section {
    background: var(--bg-light);
    border-radius: 12px;
    padding: 2.5rem;
    margin: 2.5rem 0;
    text-align: center;
}

.upload-section h3 {
    color: var(--primary-color);
    font-size: 1.5rem;
    margin-bottom: 0.75rem;
}

.upload-description {
    color: var(--text-light);
    font-size: 1rem;
    margin-bottom: 2rem;
    line-height: 1.6;
}

.upload-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-bottom: 2rem;
}

.upload-card {
    background: white;
    border: 2px solid var(--border-color);
    border-radius: 12px;
    padding: 2rem;
    transition: all 0.3s ease;
    text-align: center;
}

.upload-card:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-md);
    transform: translateY(-4px);
}

.upload-card-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.upload-card h4 {
    color: var(--primary-color);
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
}

.upload-card-description {
    color: var(--text-light);
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
}

.upload-card-description strong {
    color: var(--primary-color);
    font-weight: 600;
}

.file-input {
    display: none;
}

.upload-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--primary-color);
    color: white;
    padding: 0.875rem 1.75rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    font-size: 1rem;
}

.upload-button:hover {
    background: #2c5282;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.upload-icon {
    font-size: 1.25rem;
    font-weight: bold;
}

.upload-status {
    margin-top: 1rem;
    padding: 0.75rem;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    min-height: 2.5rem;
}

.upload-status.success {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #10b981;
}

.upload-status.error {
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #ef4444;
}

.upload-status.processing {
    background: #dbeafe;
    color: #1e40af;
    border: 1px solid #3b82f6;
}

.upload-note {
    background: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: 8px;
    padding: 1rem;
    color: #78350f;
    font-size: 0.9rem;
    line-height: 1.5;
}

.upload-note strong {
    font-weight: 600;
}

/* ===================================
   BUTTONS
   =================================== */
.btn-primary, .btn-secondary {
    padding: 1rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary-color) 0%, #2c5282 100%);
    color: white;
    margin-top: 2rem;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
}

.btn-secondary {
    background: white;
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
    background: var(--primary-color);
    color: white;
}

.button-group {
    display: flex;
    gap: 1rem;
    justify-content: center;
    margin-top: 2rem;
}

/* ===================================
   PROGRESS BAR
   =================================== */
.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--border-color);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 1rem;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color) 0%, var(--secondary-color) 100%);
    transition: width 0.3s ease;
    width: 0%;
}

.progress-text {
    text-align: center;
    color: var(--text-light);
    font-size: 0.9rem;
    margin-bottom: 2rem;
}

/* ===================================
   ASSESSMENT SECTION
   =================================== */
.assessment-section {
    background: white;
    border-radius: 12px;
    padding: 3rem;
    box-shadow: var(--shadow-lg);
}

.question-group {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
}

.question-group:last-child {
    border-bottom: none;
}

.question-label {
    display: block;
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.75rem;
    font-size: 1rem;
}

.question-input, .question-select {
    width: 100%;
    padding: 0.875rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
    font-family: inherit;
}

.question-input:focus, .question-select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
}

.radio-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.radio-option {
    display: flex;
    align-items: center;
    padding: 0.875rem;
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.radio-option:hover {
    border-color: var(--primary-color);
    background: var(--bg-light);
}

.radio-option input[type="radio"] {
    margin-right: 0.75rem;
    width: 18px;
    height: 18px;
    cursor: pointer;
}

.radio-option label {
    flex: 1;
    cursor: pointer;
    font-size: 1rem;
}

/* ===================================
   RESULTS SECTION
   =================================== */
.results-section {
    background: white;
    border-radius: 12px;
    padding: 3rem;
    box-shadow: var(--shadow-lg);
}

.results-header {
    text-align: center;
    margin-bottom: 3rem;
}

.results-header h2 {
    font-size: 2rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.results-intro {
    font-size: 1.1rem;
    color: var(--text-light);
}

.overall-score-card {
    background: linear-gradient(135deg, var(--primary-color) 0%, #2c5282 100%);
    color: white;
    border-radius: 12px;
    padding: 2.5rem;
    text-align: center;
    margin-bottom: 3rem;
}

.overall-score-card h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
}

.overall-score {
    font-size: 4rem;
    font-weight: 700;
    color: var(--secondary-color);
    margin: 1rem 0;
}

.overall-gauge {
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    overflow: hidden;
    margin: 1.5rem 0;
}

.gauge-fill {
    height: 100%;
    background: var(--secondary-color);
    transition: width 0.5s ease;
    border-radius: 6px;
}

.overall-risk-level {
    font-size: 1.25rem;
    font-weight: 500;
    margin-top: 1rem;
}

.risk-card {
    background: white;
    border-left: 4px solid var(--border-color);
    border-radius: 8px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
}

.risk-card:hover {
    box-shadow: var(--shadow-md);
    transform: translateX(4px);
}

.risk-card.high-risk {
    border-left-color: var(--danger-color);
    background: #fef2f2;
}

.risk-card.medium-risk {
    border-left-color: var(--warning-color);
    background: #fffbeb;
}

.risk-card.low-risk {
    border-left-color: var(--success-color);
    background: #f0fdf4;
}

.risk-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.risk-card-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--primary-color);
}

.risk-score {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.score-number {
    font-size: 2rem;
    font-weight: 700;
}

.score-badge {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.9rem;
}

.score-badge.high-risk {
    background: var(--danger-color);
    color: white;
}

.score-badge.medium-risk {
    background: var(--warning-color);
    color: white;
}

.score-badge.low-risk {
    background: var(--success-color);
    color: white;
}

.recommendations {
    margin-top: 2rem;
}

.recommendations h4 {
    font-size: 1.25rem;
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.recommendation-list {
    list-style: none;
    padding: 0;
}

.recommendation-list li {
    padding: 0.875rem;
    margin-bottom: 0.75rem;
    background: white;
    border-radius: 6px;
    border-left: 3px solid var(--primary-color);
    font-size: 0.95rem;
    line-height: 1.6;
}

.recommendation-list li strong {
    color: var(--primary-color);
    font-weight: 600;
}

/* ===================================
   FOOTER
   =================================== */
.footer {
    background: var(--primary-color);
    color: white;
    padding: 2rem 0;
    text-align: center;
    margin-top: 4rem;
}

.footer p {
    margin: 0.5rem 0;
    opacity: 0.9;
}

.footer-contact {
    font-weight: 500;
    color: var(--secondary-color);
}

/* ===================================
   RESPONSIVE DESIGN
   =================================== */
@media (max-width: 768px) {
    .logo {
        font-size: 2rem;
    }

    .tagline {
        font-size: 1rem;
    }

    .welcome-card {
        padding: 2rem 1.5rem;
    }

    .welcome-card h2 {
        font-size: 1.5rem;
    }

    .lead {
        font-size: 1rem;
    }

    .risk-categories {
        gap: 0.75rem;
    }

    .category-pill {
        padding: 0.5rem 1rem;
        font-size: 0.85rem;
    }

    .upload-section {
        padding: 1.5rem;
    }

    .upload-cards {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .upload-card {
        padding: 1.5rem;
    }

    .assessment-section {
        padding: 2rem 1.5rem;
    }

    .results-section {
        padding: 2rem 1.5rem;
    }

    .overall-score {
        font-size: 3rem;
    }

    .risk-card {
        padding: 1.5rem;
    }

    .risk-card-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .button-group {
        flex-direction: column;
    }

    .btn-primary, .btn-secondary {
        width: 100%;
        justify-content: center;
    }
}

/* ===================================
   PRINT STYLES
   =================================== */
@media print {
    .header, .footer, .button-group, .upload-section {
        display: none;
    }

    .results-section {
        box-shadow: none;
        padding: 0;
    }

    .risk-card {
        page-break-inside: avoid;
        box-shadow: none;
    }
}
