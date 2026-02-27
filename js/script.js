// Navigation functions
let currentSection = 1;
const totalSections = 7;

function startAssessment() {
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('assessment-form').classList.add('active');
    updateProgress();
}

function nextSection() {
    const currentForm = document.querySelector(`.form-section[data-section="${currentSection}"]`);
    const inputs = currentForm.querySelectorAll('input[required], select[required]');
    let valid = true;
    
    // Validate all required fields
    inputs.forEach(input => {
        if (!input.value) {
            input.style.borderColor = 'var(--danger-color)';
            valid = false;
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
    });
    
    if (!valid) {
        alert('Please fill in all required fields before continuing.');
        return;
    }
    
    // Special validation for percentage fields
    if (currentSection === 2) {
        const taxDeferred = parseFloat(document.getElementById('tax-deferred-pct').value) || 0;
        const roth = parseFloat(document.getElementById('roth-pct').value) || 0;
        const taxable = parseFloat(document.getElementById('taxable-pct').value) || 0;
        const total = taxDeferred + roth + taxable;
        
        if (Math.abs(total - 100) > 5) {
            alert(`Tax account percentages should add up to approximately 100% (current total: ${total.toFixed(1)}%)`);
            return;
        }
    }
    
    if (currentSection === 3) {
        const stocks = parseFloat(document.getElementById('stocks-pct').value) || 0;
        const bonds = parseFloat(document.getElementById('bonds-pct').value) || 0;
        const cash = parseFloat(document.getElementById('cash-pct').value) || 0;
        const total = stocks + bonds + cash;
        
        if (Math.abs(total - 100) > 5) {
            alert(`Asset allocation percentages should add up to approximately 100% (current total: ${total.toFixed(1)}%)`);
            return;
        }
    }
    
    // Auto-calculate years to retirement
    if (currentSection === 1) {
        const age = parseInt(document.getElementById('age').value);
        const retirementAge = parseInt(document.getElementById('retirement-age').value);
        const yearsToRetirement = Math.max(0, retirementAge - age);
        document.getElementById('years-to-retirement').value = yearsToRetirement;
    }
    
    if (currentSection < totalSections) {
        currentForm.classList.remove('active');
        currentSection++;
        document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add('active');
        updateProgress();
        window.scrollTo(0, 0);
    }
}

function prevSection() {
    if (currentSection > 1) {
        document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.remove('active');
        currentSection--;
        document.querySelector(`.form-section[data-section="${currentSection}"]`).classList.add('active');
        updateProgress();
        window.scrollTo(0, 0);
    }
}

function updateProgress() {
    const progress = (currentSection / totalSections) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
}

// Risk Calculation Functions
function calculateResults() {
    event.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        age: parseInt(document.getElementById('age').value),
        retirementAge: parseInt(document.getElementById('retirement-age').value),
        annualIncome: parseFloat(document.getElementById('annual-income').value),
        
        // Tax Risk
        taxDeferredPct: parseFloat(document.getElementById('tax-deferred-pct').value),
        rothPct: parseFloat(document.getElementById('roth-pct').value),
        taxablePct: parseFloat(document.getElementById('taxable-pct').value),
        retirementIncome: parseFloat(document.getElementById('retirement-income').value),
        stateTax: document.getElementById('state-tax').value,
        socialSecurity: document.getElementById('social-security').value,
        pension: document.getElementById('pension').value,
        rothConversion: document.getElementById('roth-conversion').value,
        
        // Market Risk
        stocksPct: parseFloat(document.getElementById('stocks-pct').value),
        bondsPct: parseFloat(document.getElementById('bonds-pct').value),
        cashPct: parseFloat(document.getElementById('cash-pct').value),
        withdrawalRate: parseFloat(document.getElementById('withdrawal-rate').value),
        guaranteedIncomePct: parseFloat(document.getElementById('guaranteed-income-pct').value),
        cashBuffer: document.getElementById('cash-buffer').value,
        stressTested: document.getElementById('stress-tested').value,
        
        // Inflation Risk
        fixedIncomeSourcesPct: parseFloat(document.getElementById('fixed-income-sources-pct').value),
        ssCola: document.getElementById('ss-cola').value,
        growthAssetsPct: parseFloat(document.getElementById('growth-assets-pct').value),
        realEstate: document.getElementById('real-estate').value,
        inflationPlan: document.getElementById('inflation-plan').value,
        
        // Longevity Risk
        healthStatus: document.getElementById('health-status').value,
        familyLongevity: document.getElementById('family-longevity').value,
        portfolioWithdrawalRate: parseFloat(document.getElementById('portfolio-withdrawal-rate').value),
        lifetimeIncomePct: parseFloat(document.getElementById('lifetime-income-pct').value),
        incomeCalculator: document.getElementById('income-calculator').value,
        
        // LTC Risk
        ltcInsurance: document.getElementById('ltc-insurance').value,
        netWorth: document.getElementById('net-worth').value,
        ltcHealth: document.getElementById('ltc-health').value,
        familySupport: document.getElementById('family-support').value,
        ltcPlan: document.getElementById('ltc-plan').value,
        
        // Early Retirement Risk
        jobStability: document.getElementById('job-stability').value,
        yearsToRetirement: parseInt(document.getElementById('years-to-retirement').value),
        emergencyFund: document.getElementById('emergency-fund').value,
        disabilityInsurance: document.getElementById('disability-insurance').value,
        earlyRetirementHealth: document.getElementById('early-retirement-health').value,
        readyToday: document.getElementById('ready-today').value
    };
    
    // Calculate scores
    const scores = {
        tax: calculateTaxRisk(formData),
        market: calculateMarketRisk(formData),
        inflation: calculateInflationRisk(formData),
        longevity: calculateLongevityRisk(formData),
        ltc: calculateLTCRisk(formData),
        earlyRetirement: calculateEarlyRetirementRisk(formData)
    };
    
    // Display results
    displayResults(formData, scores);
    
    // Switch to results screen
    document.getElementById('assessment-form').classList.remove('active');
    document.getElementById('results-screen').classList.add('active');
    window.scrollTo(0, 0);
}

function calculateTaxRisk(data) {
    let score = 5.0;
    let factors = [];
    
    // Tax-deferred percentage
    if (data.taxDeferredPct > 80) {
        score -= 2.5;
        factors.push('Heavy concentration in tax-deferred accounts (>80%)');
    } else if (data.taxDeferredPct > 60) {
        score -= 1.5;
        factors.push('Significant tax-deferred assets (60-80%)');
    } else if (data.taxDeferredPct < 40) {
        score += 1.0;
        factors.push('Good tax diversification with moderate tax-deferred %');
    }
    
    // Roth percentage
    if (data.rothPct > 30) {
        score += 2.0;
        factors.push('Strong Roth account presence (>30%)');
    } else if (data.rothPct > 15) {
        score += 1.0;
        factors.push('Moderate Roth account balance');
    } else if (data.rothPct === 0) {
        score -= 1.5;
        factors.push('No Roth accounts - missing tax-free growth opportunity');
    }
    
    // Taxable accounts
    if (data.taxablePct > 20) {
        score += 1.0;
        factors.push('Good taxable account balance provides flexibility');
    } else if (data.taxablePct === 0) {
        score -= 0.5;
        factors.push('No taxable accounts - limited withdrawal flexibility');
    }
    
    // Retirement income level
    if (data.retirementIncome > 200000) {
        score -= 1.5;
        factors.push('High retirement income = higher tax brackets');
    } else if (data.retirementIncome < 80000) {
        score += 1.0;
        factors.push('Moderate retirement income helps manage tax burden');
    }
    
    // State tax
    if (data.stateTax === 'yes') {
        score -= 0.5;
        factors.push('State taxes retirement income');
    } else if (data.stateTax === 'no') {
        score += 0.5;
        factors.push('State does not tax retirement income');
    }
    
    // Roth conversion planning
    if (data.rothConversion === 'yes') {
        score += 1.0;
        factors.push('Active Roth conversion planning in place');
    } else if (data.rothConversion === 'no') {
        score -= 1.0;
        factors.push('No Roth conversion strategy');
    }
    
    // Income diversity
    let incomeSourceCount = 0;
    if (data.socialSecurity === 'yes') incomeSourceCount++;
    if (data.pension === 'yes') incomeSourceCount++;
    
    if (incomeSourceCount >= 2) {
        score += 0.5;
        factors.push('Multiple income sources provide tax planning flexibility');
    }
    
    return {
        score: Math.max(1.0, Math.min(10.0, score)),
        factors: factors
    };
}

function calculateMarketRisk(data) {
    let score = 5.0;
    let factors = [];
    
    // Years to retirement
    const yearsToRetirement = data.retirementAge - data.age;
    if (yearsToRetirement > 15) {
        score += 1.5;
        factors.push(`${yearsToRetirement} years to retirement - good time horizon`);
    } else if (yearsToRetirement < 5) {
        score -= 1.5;
        factors.push(`Only ${yearsToRetirement} years to retirement - limited recovery time`);
    }
    
    // Asset allocation vs. timeline
    if (yearsToRetirement < 10 && data.stocksPct > 70) {
        score -= 2.0;
        factors.push('High equity exposure near retirement increases sequence risk');
    } else if (yearsToRetirement < 10 && data.stocksPct < 50) {
        score += 1.0;
        factors.push('Conservative allocation appropriate for timeline');
    }
    
    // Withdrawal rate
    if (data.withdrawalRate > 5) {
        score -= 2.5;
        factors.push('Withdrawal rate >5% significantly increases failure risk');
    } else if (data.withdrawalRate <= 3) {
        score += 2.0;
        factors.push('Conservative withdrawal rate ≤3% enhances sustainability');
    } else if (data.withdrawalRate <= 4) {
        score += 1.0;
        factors.push('Moderate withdrawal rate of 3-4%');
    }
    
    // Guaranteed income coverage
    if (data.guaranteedIncomePct >= 80) {
        score += 2.5;
        factors.push('Strong guaranteed income coverage (≥80%)');
    } else if (data.guaranteedIncomePct >= 50) {
        score += 1.5;
        factors.push('Moderate guaranteed income coverage');
    } else if (data.guaranteedIncomePct < 30) {
        score -= 1.5;
        factors.push('Low guaranteed income - heavy portfolio dependence');
    }
    
    // Cash buffer
    if (data.cashBuffer === 'yes-3') {
        score += 1.5;
        factors.push('Excellent cash buffer (3+ years)');
    } else if (data.cashBuffer === 'yes-2') {
        score += 1.0;
        factors.push('Good cash buffer (2 years)');
    } else if (data.cashBuffer === 'no') {
        score -= 1.5;
        factors.push('No cash buffer - vulnerable to sequence risk');
    }
    
    // Stress testing
    if (data.stressTested === 'yes') {
        score += 1.0;
        factors.push('Portfolio stress-tested with advisor');
    } else if (data.stressTested === 'no') {
        score -= 0.5;
        factors.push('Portfolio not stress-tested for downturns');
    }
    
    return {
        score: Math.max(1.0, Math.min(10.0, score)),
        factors: factors
    };
}

function calculateInflationRisk(data) {
    let score = 5.0;
    let factors = [];
    
    // Fixed income sources
    if (data.fixedIncomeSourcesPct > 70) {
        score -= 2.0;
        factors.push('High fixed income exposure (>70%) vulnerable to inflation');
    } else if (data.fixedIncomeSourcesPct < 30) {
        score += 1.5;
        factors.push('Low fixed income exposure - better inflation protection');
    }
    
    // COLA adjustments
    if (data.ssCola === 'yes-both') {
        score += 2.0;
        factors.push('Both SS and pension have COLA - excellent protection');
    } else if (data.ssCola === 'yes-one') {
        score += 1.0;
        factors.push('One income source has COLA adjustment');
    } else if (data.ssCola === 'no') {
        score -= 1.5;
        factors.push('No COLA on income sources - inflation risk');
    }
    
    // Growth assets
    if (data.growthAssetsPct >= 60) {
        score += 1.5;
        factors.push('Strong growth asset allocation (≥60%)');
    } else if (data.growthAssetsPct < 30) {
        score -= 1.5;
        factors.push('Low growth assets - may not keep pace with inflation');
    }
    
    // Real estate
    if (data.realEstate === 'yes-income') {
        score += 1.0;
        factors.push('Rental income provides inflation hedge');
    } else if (data.realEstate === 'yes-no-income') {
        score += 0.5;
        factors.push('Real estate holdings provide some inflation protection');
    }
    
    // Inflation planning
    if (data.inflationPlan === 'yes') {
        score += 1.0;
        factors.push('Active inflation mitigation plan in place');
    } else if (data.inflationPlan === 'no') {
        score -= 1.0;
        factors.push('No specific inflation strategy');
    }
    
    return {
        score: Math.max(1.0, Math.min(10.0, score)),
        factors: factors
    };
}

function calculateLongevityRisk(data) {
    let score = 5.0;
    let factors = [];
    
    // Health status
    if (data.healthStatus === 'excellent' || data.healthStatus === 'good') {
        score -= 0.5;
        factors.push('Good health may mean longer retirement');
    } else if (data.healthStatus === 'poor') {
        score += 1.0;
        factors.push('Health challenges may shorten planning horizon');
    }
    
    // Family longevity
    if (data.familyLongevity === 'long') {
        score -= 1.0;
        factors.push('Family history of longevity - plan for longer retirement');
    } else if (data.familyLongevity === 'short') {
        score += 0.5;
        factors.push('Family history suggests shorter planning period');
    }
    
    // Withdrawal rate
    if (data.portfolioWithdrawalRate > 5) {
        score -= 2.5;
        factors.push('High withdrawal rate threatens long-term sustainability');
    } else if (data.portfolioWithdrawalRate <= 3) {
        score += 2.5;
        factors.push('Conservative withdrawal rate supports longevity');
    } else if (data.portfolioWithdrawalRate <= 4) {
        score += 1.0;
        factors.push('Moderate withdrawal rate');
    }
    
    // Guaranteed lifetime income
    if (data.lifetimeIncomePct >= 80) {
        score += 2.5;
        factors.push('Strong guaranteed lifetime income coverage (≥80%)');
    } else if (data.lifetimeIncomePct >= 50) {
        score += 1.5;
        factors.push('Moderate guaranteed income coverage');
    } else if (data.lifetimeIncomePct < 30) {
        score -= 2.0;
        factors.push('Low guaranteed income - high longevity risk');
    }
    
    // Income calculator usage
    if (data.incomeCalculator === 'yes') {
        score += 1.0;
        factors.push('Formal retirement projections completed');
    } else if (data.incomeCalculator === 'no') {
        score -= 1.0;
        factors.push('No formal sustainability analysis');
    }
    
    return {
        score: Math.max(1.0, Math.min(10.0, score)),
        factors: factors
    };
}

function calculateLTCRisk(data) {
    let score = 5.0;
    let factors = [];
    
    // LTC Insurance
    if (data.ltcInsurance === 'yes-comprehensive') {
        score += 2.5;
        factors.push('Comprehensive LTC insurance coverage');
    } else if (data.ltcInsurance === 'yes-basic') {
        score += 1.5;
        factors.push('Basic LTC insurance coverage');
    } else if (data.ltcInsurance === 'hybrid') {
        score += 2.0;
        factors.push('Hybrid life/LTC policy provides protection');
    } else if (data.ltcInsurance === 'no') {
        score -= 2.0;
        factors.push('No LTC insurance - significant exposure');
    }
    
    // Net worth for self-funding
    if (data.netWorth === 'over-2m') {
        score += 2.0;
        factors.push('High net worth enables self-funding');
    } else if (data.netWorth === '1m-2m') {
        score += 1.5;
        factors.push('Moderate net worth for potential self-funding');
    } else if (data.netWorth === '500k-1m') {
        score += 0.5;
        factors.push('Limited self-funding capacity');
    } else if (data.netWorth === 'under-250k') {
        score -= 1.0;
        factors.push('Low net worth - cannot self-fund LTC');
    }
    
    // Age factor
    if (data.age < 55) {
        score += 1.0;
        factors.push('Young enough to obtain affordable LTC insurance');
    } else if (data.age > 70) {
        score -= 1.0;
        factors.push('Age makes LTC insurance expensive or unavailable');
    }
    
    // Health
    if (data.ltcHealth === 'excellent') {
        score += 0.5;
        factors.push('Excellent health - good insurability');
    } else if (data.ltcHealth === 'poor' || data.ltcHealth === 'fair') {
        score -= 1.0;
        factors.push('Health issues increase LTC likelihood');
    }
    
    // Family support
    if (data.familySupport === 'strong') {
        score += 1.0;
        factors.push('Strong family support system');
    } else if (data.familySupport === 'none' || data.familySupport === 'limited') {
        score -= 1.0;
        factors.push('Limited family support increases LTC need');
    }
    
    // Written plan
    if (data.ltcPlan === 'yes') {
        score += 1.0;
        factors.push('Documented LTC plan in place');
    } else if (data.ltcPlan === 'no') {
        score -= 1.0;
        factors.push('No LTC plan documented');
    }
    
    return {
        score: Math.max(1.0, Math.min(10.0, score)),
        factors: factors
    };
}

function calculateEarlyRetirementRisk(data) {
    let score = 5.0;
    let factors = [];
    
    // Job stability
    if (data.jobStability === 'very-stable') {
        score += 2.0;
        factors.push('Very stable employment (government/tenured)');
    } else if (data.jobStability === 'stable') {
        score += 1.0;
        factors.push('Stable employment situation');
    } else if (data.jobStability === 'unstable') {
        score -= 2.0;
        factors.push('Unstable employment - high layoff risk');
    } else if (data.jobStability === 'retired') {
        score += 3.0;
        factors.push('Already retired - no employment risk');
    }
    
    // Years to retirement
    if (data.yearsToRetirement === 0) {
        score += 2.0;
        factors.push('Already at retirement age');
    } else if (data.yearsToRetirement > 10) {
        score -= 1.0;
        factors.push(`${data.yearsToRetirement} years of employment still needed`);
    }
    
    // Emergency fund
    if (data.emergencyFund === '12-plus') {
        score += 2.0;
        factors.push('Excellent emergency fund (12+ months)');
    } else if (data.emergencyFund === '6-12') {
        score += 1.5;
        factors.push('Good emergency fund (6-12 months)');
    } else if (data.emergencyFund === 'under-3') {
        score -= 1.5;
        factors.push('Inadequate emergency fund (<3 months)');
    } else if (data.emergencyFund === 'none') {
        score -= 2.0;
        factors.push('No emergency fund - critical gap');
    }
    
    // Disability insurance
    if (data.disabilityInsurance === 'yes-comprehensive') {
        score += 2.0;
        factors.push('Comprehensive disability insurance');
    } else if (data.disabilityInsurance === 'yes-basic') {
        score += 1.0;
        factors.push('Basic disability coverage');
    } else if (data.disabilityInsurance === 'no') {
        score -= 2.0;
        factors.push('No disability insurance - major risk');
    }
    
    // Health
    if (data.earlyRetirementHealth === 'excellent' || data.earlyRetirementHealth === 'good') {
        score += 0.5;
        factors.push('Good health supports continued employment');
    } else if (data.earlyRetirementHealth === 'poor') {
        score -= 1.5;
        factors.push('Poor health threatens employment continuity');
    }
    
    // Readiness if forced to retire today
    if (data.readyToday === 'ready') {
        score += 2.0;
        factors.push('Fully prepared if forced to retire today');
    } else if (data.readyToday === 'mostly') {
        score += 1.0;
        factors.push('Mostly prepared for early retirement');
    } else if (data.readyToday === 'not') {
        score -= 2.0;
        factors.push('Not prepared for involuntary early retirement');
    }
    
    return {
        score: Math.max(1.0, Math.min(10.0, score)),
        factors: factors
    };
}

// Display Results
function displayResults(data, scores) {
    // Display name
    document.getElementById('results-name').textContent = data.name;
    
    // Calculate overall score
    const overallScore = ((scores.tax.score + scores.market.score + scores.inflation.score + 
                          scores.longevity.score + scores.ltc.score + scores.earlyRetirement.score) / 6).toFixed(1);
    document.getElementById('overall-score').textContent = overallScore;
    
    // Overall description
    let overallDesc = '';
    if (overallScore >= 7) {
        overallDesc = 'Your retirement plan shows strong risk management across most categories. Continue monitoring and adjusting as needed.';
    } else if (overallScore >= 5) {
        overallDesc = 'Your retirement plan has moderate risk exposure in several areas. Review the recommendations below to strengthen your position.';
    } else {
        overallDesc = 'Your retirement plan has significant risk exposure that requires immediate attention. Please carefully review all recommendations.';
    }
    document.getElementById('overall-description').textContent = overallDesc;
    
    // Display individual risk scores
    displayRiskCard('tax', scores.tax, data);
    displayRiskCard('market', scores.market, data);
    displayRiskCard('inflation', scores.inflation, data);
    displayRiskCard('longevity', scores.longevity, data);
    displayRiskCard('ltc', scores.ltc, data);
    displayRiskCard('early', scores.earlyRetirement, data);
}

function displayRiskCard(category, result, data) {
    const score = result.score.toFixed(1);
    let level = '';
    let levelClass = '';
    
    if (score <= 4) {
        level = 'HIGH RISK';
        levelClass = 'high-risk';
    } else if (score <= 6) {
        level = 'MODERATE RISK';
        levelClass = 'moderate-risk';
    } else {
        level = 'LOW RISK';
        levelClass = 'low-risk';
    }
    
    // Update score display
    document.getElementById(`${category}-score`).textContent = score;
    document.getElementById(`${category}-level`).textContent = level;
    document.getElementById(`${category}-score-circle`).className = `score-circle ${levelClass}`;
    document.getElementById(`${category}-level`).className = `risk-level ${levelClass}`;
    
    // Update factors
    let factorsHTML = '<h4>Key Factors:</h4><ul>';
    result.factors.forEach(factor => {
        factorsHTML += `<li>${factor}</li>`;
    });
    factorsHTML += '</ul>';
    document.getElementById(`${category}-factors`).innerHTML = factorsHTML;
    
    // Update recommendations (only for scores <= 6)
    const recommendationsDiv = document.getElementById(`${category}-recommendations`);
    if (score <= 6) {
        const recommendations = getRecommendations(category, data, score);
        let recHTML = '<h4><i class="fas fa-exclamation-triangle"></i> Recommendations:</h4><ul>';
        recommendations.forEach(rec => {
            recHTML += `<li>${rec}</li>`;
        });
        recHTML += '</ul>';
        recommendationsDiv.innerHTML = recHTML;
        recommendationsDiv.style.display = 'block';
    } else {
        recommendationsDiv.style.display = 'none';
    }
}

function getRecommendations(category, data, score) {
    const recommendations = [];
    
    if (category === 'tax') {
        if (data.taxDeferredPct > 60) {
            recommendations.push('Consider Roth conversions during lower income years to reduce future Required Minimum Distributions (RMDs) and create tax-free income streams');
        }
        if (data.rothPct < 20) {
            recommendations.push('Maximize Roth IRA/401(k) contributions to build tax-free retirement income and provide greater withdrawal flexibility');
        }
        if (data.rothConversion === 'no') {
            recommendations.push('Develop a multi-year Roth conversion strategy with your tax advisor to optimize your lifetime tax burden');
        }
        if (data.taxablePct === 0) {
            recommendations.push('Open a taxable brokerage account for additional tax diversification and penalty-free access before age 59½');
        }
        if (data.retirementIncome > 150000) {
            recommendations.push('Consider tax-efficient withdrawal sequencing strategies (e.g., fill lower tax brackets with IRA withdrawals, then use Roth/taxable accounts)');
        }
        if (data.stateTax === 'yes') {
            recommendations.push('Evaluate whether relocating to a tax-friendly state in retirement could significantly reduce your overall tax burden');
        }
        // ADD IUL RECOMMENDATION FOR TAX RISK
        recommendations.push('Explore Indexed Universal Life (IUL) insurance as a supplemental tax-free savings vehicle. Unlike Roth IRAs, IULs have NO income limits or contribution limits, allowing high earners to build substantial tax-free retirement income through policy loans. IUL cash value grows tax-deferred with downside protection (typically 0% floor) and living benefits riders can provide tax-free access for long-term care needs');
        
        recommendations.push('Work with a CPA to model your projected tax liability in retirement and identify opportunities to reduce it through strategic planning');
    }
    
    if (category === 'market') {
        const yearsToRetirement = data.retirementAge - data.age;
        
        if (yearsToRetirement < 10 && data.stocksPct > 70) {
            recommendations.push('Reduce equity exposure to 50-60% as you approach retirement to minimize sequence of returns risk');
        }
        if (data.withdrawalRate > 4) {
            recommendations.push('Reduce your planned withdrawal rate to 4% or below to increase portfolio sustainability over a 30-year retirement');
        }
        if (data.guaranteedIncomePct < 50) {
            recommendations.push('Consider adding guaranteed income sources (Social Security delay, pension, income annuity) to cover at least 50% of essential expenses');
        }
        if (data.cashBuffer === 'no' || data.cashBuffer === 'yes-1') {
            recommendations.push('Build a cash buffer of 2-3 years of expenses to avoid selling stocks during market downturns (bucket strategy)');
        }
        if (data.stressTested === 'no') {
            recommendations.push('Stress test your portfolio against historical market crashes (2008, 2000-2002) to understand potential drawdowns and recovery times');
        }
        recommendations.push('Implement a systematic rebalancing strategy to maintain your target asset allocation and reduce emotional decision-making');
        recommendations.push('Consider a bond tent strategy (temporarily higher bond allocation) in the 5 years before and after retirement to protect against sequence risk');
    }
    
    if (category === 'inflation') {
        if (data.fixedIncomeSourcesPct > 50) {
            recommendations.push('Reduce fixed income exposure and maintain 40-60% in growth assets (stocks, real estate) to combat inflation erosion');
        }
        if (data.ssCola === 'no' || data.ssCola === 'no-ss-pension') {
            recommendations.push('Delay Social Security to age 70 to maximize your inflation-protected benefit (8% annual increase from FRA to 70)');
        }
        if (data.growthAssetsPct < 40) {
            recommendations.push('Increase allocation to growth assets - historical data shows stocks and real estate outpace inflation over long periods');
        }
        if (data.inflationPlan === 'no') {
            recommendations.push('Develop a specific inflation mitigation plan: consider TIPS (Treasury Inflation-Protected Securities), I-Bonds, commodities, or real estate');
        }
        if (data.realEstate === 'no') {
            recommendations.push('Consider real estate investment (REITs or rental property) as an inflation hedge - rents and property values typically rise with inflation');
        }
        recommendations.push('Plan for 3-4% annual inflation rather than 2% - healthcare and services often exceed general inflation rates');
        recommendations.push('Review and increase your withdrawal amounts annually based on actual inflation (CPI-U) to maintain purchasing power');
    }
    
    if (category === 'longevity') {
        if (data.portfolioWithdrawalRate > 4) {
            recommendations.push('Reduce withdrawal rate to 3.5% or below - with potential 30-40 year retirements, conservative rates are essential');
        }
        if (data.lifetimeIncomePct < 50) {
            recommendations.push('Consider a QLAC (Qualified Longevity Annuity Contract) to provide guaranteed income starting at age 80-85, protecting against late-life longevity risk');
        }
        if (data.familyLongevity === 'long') {
            recommendations.push('Plan for a retirement lasting 35-40 years - delay Social Security to 70 and maintain growth assets longer than traditional advice suggests');
        }
        if (data.incomeCalculator === 'no') {
            recommendations.push('Use Monte Carlo retirement calculators to model portfolio sustainability across thousands of market scenarios and lifespans');
        }
        if (data.lifetimeIncomePct >= 70) {
            recommendations.push('Your strong guaranteed income base protects well against longevity risk - maintain this coverage and avoid reducing it');
        }
        recommendations.push('Consider longevity insurance (deferred income annuity starting at age 85) to protect against extreme longevity scenarios');
        recommendations.push('Plan for unequal lifespans - ensure the surviving spouse will have adequate income, especially if one pension reduces or ends');
    }
    
    if (category === 'ltc') {
        if (data.ltcInsurance === 'no') {
            recommendations.push('Obtain long-term care insurance quotes NOW - premiums increase significantly with age and health conditions can make you uninsurable');
        }
        if (data.age < 60 && data.ltcInsurance === 'no') {
            recommendations.push('Consider hybrid life insurance/LTC policies (also called "asset-based LTC") which provide LTC benefits while preserving a death benefit if not used');
        }
        // ADD IUL RECOMMENDATION FOR LTC RISK
        if (data.ltcInsurance === 'no' || data.ltcInsurance === 'yes-basic') {
            recommendations.push('Explore Indexed Universal Life (IUL) insurance with chronic illness or long-term care riders as an alternative or supplement to traditional LTC insurance. IULs provide tax-free access to the death benefit if you need long-term care, with NO "use it or lose it" concern - unused benefits pass to heirs. Unlike standalone LTC insurance, IUL premiums build cash value that can be accessed via policy loans if needed, and living benefits riders typically have NO income limits or contribution restrictions');
        }
        if (data.netWorth === 'under-250k' || data.netWorth === '250k-500k') {
            recommendations.push('With limited assets, LTC insurance is critical - even a 2-year policy can prevent financial devastation from a nursing home stay');
        }
        if (data.netWorth === 'over-2m' || data.netWorth === '1m-2m') {
            recommendations.push('With substantial assets, evaluate whether self-funding makes sense vs. insurance - but remember LTC costs $100,000+/year and can deplete even large estates');
        }
        if (data.ltcPlan === 'no') {
            recommendations.push('Create a written LTC plan with your family: discuss preferences for home care vs. facility care, document wishes, and assign healthcare POA');
        }
        if (data.familySupport === 'limited' || data.familySupport === 'none') {
            recommendations.push('Without family support, you will need to rely on paid caregivers or facilities - making LTC insurance or self-funding reserves even more critical');
        }
        recommendations.push('Meet with an elder law attorney to understand Medicaid planning, asset protection strategies, and long-term care insurance riders');
    }
    
    if (category === 'early') {
        if (data.emergencyFund === 'none' || data.emergencyFund === 'under-3') {
            recommendations.push('BUILD AN EMERGENCY FUND FIRST - save 6-12 months of expenses in a high-yield savings account before increasing retirement contributions');
        }
        if (data.disabilityInsurance === 'no') {
            recommendations.push('Obtain individual long-term disability insurance immediately - disability before retirement age would devastate your retirement plan');
        }
        if (data.disabilityInsurance === 'employer-only') {
            recommendations.push('Supplement employer disability coverage with an individual policy that follows you if you change jobs and covers you until retirement age');
        }
        if (data.yearsToRetirement > 10) {
            recommendations.push('With 10+ years until retirement, develop a "Plan B" scenario: model what happens if you\'re forced to retire 5 years early');
        }
        if (data.readyToday === 'not' || data.readyToday === 'somewhat') {
            recommendations.push('Accelerate savings rate if possible - your retirement plan is heavily dependent on continued employment for many more years');
        }
        if (data.jobStability === 'unstable' || data.jobStability === 'moderate') {
            recommendations.push('Reduce lifestyle expenses and increase savings rate to build financial resilience against potential job loss');
        }
        recommendations.push('Consider updating skills, networking, or developing side income streams to improve employability and diversify income sources');
        recommendations.push('Review your employer benefits: disability insurance, severance policies, and early retirement packages - understand your safety nets');
    }
    
    return recommendations;
}

// Utility Functions
function printResults() {
    window.print();
}

function startOver() {
    if (confirm('Are you sure you want to start over? All your responses will be cleared.')) {
        location.reload();
    }
}