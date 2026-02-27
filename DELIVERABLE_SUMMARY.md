/**
 * RetireSecure™ Risk Scorer
 * Calculates risk scores across six retirement risk categories
 */

const RiskScorer = {
    /**
     * Calculate all six risk category scores
     * @param {Object} data - Combined user input and PDF data
     * @returns {Object} - Scores and recommendations for all categories
     */
    calculateAllScores(data) {
        return {
            tax: this.calculateTaxRisk(data),
            market: this.calculateMarketRisk(data),
            inflation: this.calculateInflationRisk(data),
            longevity: this.calculateLongevityRisk(data),
            ltc: this.calculateLTCRisk(data),
            earlyRetirement: this.calculateEarlyRetirementRisk(data)
        };
    },

    /**
     * Calculate Tax Risk Score (1-10 scale, 1 = extreme risk, 10 = minimal risk)
     */
    calculateTaxRisk(data) {
        let score = 5; // Start at middle
        const reasons = [];
        const recommendations = [];

        // Check tax diversification
        const totalTaxDeferred = (data.tax_preTaxBalance || 0);
        const rothBalance = (data.tax_rothBalance || 0);
        const taxableBalance = (data.tax_taxableBalance || 0);
        const totalAssets = totalTaxDeferred + rothBalance + taxableBalance;

        if (totalAssets > 0) {
            const preTaxPercent = (totalTaxDeferred / totalAssets) * 100;
            
            if (preTaxPercent > 90) {
                score -= 3;
                reasons.push('Over 90% of assets in pre-tax accounts');
                recommendations.push({
                    title: 'Begin Roth Conversions Immediately',
                    description: 'Convert a portion of pre-tax assets to Roth IRA annually to reduce future RMD burden and create tax-free income streams in retirement.'
                });
            } else if (preTaxPercent > 75) {
                score -= 2;
                reasons.push('Over 75% of assets in pre-tax accounts');
            } else if (preTaxPercent < 50) {
                score += 2;
                reasons.push('Good tax diversification with less than 50% in pre-tax accounts');
            }

            const rothPercent = (rothBalance / totalAssets) * 100;
            if (rothPercent > 30) {
                score += 2;
                reasons.push('Strong Roth IRA presence (>30% of assets)');
            } else if (rothPercent < 10) {
                score -= 1;
                recommendations.push({
                    title: 'Open and Fund Roth IRAs',
                    description: 'Establish Roth IRA accounts for both spouses and contribute the maximum annually ($7,000 per person in 2024, or $8,000 if age 50+).'
                });
            }

            if (taxableBalance > 0) {
                score += 1;
                reasons.push('Have taxable brokerage accounts for flexibility');
            } else {
                recommendations.push({
                    title: 'Establish Taxable Brokerage Account',
                    description: 'Open a taxable investment account to provide tax flexibility and avoid RMD requirements on these funds.'
                });
            }
        }

        // Check state tax situation
        const highTaxStates = ['CA', 'NY', 'NJ', 'OR', 'MN', 'DC', 'VT', 'HI', 'MA', 'CT'];
        if (data.tax_state && highTaxStates.includes(data.tax_state)) {
            score -= 1;
            reasons.push(`Living in high-tax state (${data.tax_state})`);
            recommendations.push({
                title: 'Consider State Tax Planning',
                description: 'Review state-specific retirement income tax rules. Consider establishing residency in a tax-friendly state before retirement if feasible.'
            });
        }

        // IUL recommendation for high earners
        const hasHighIncome = (data.combinedIncome || 0) > 200000;
        if (hasHighIncome && rothBalance < 100000) {
            recommendations.push({
                title: 'Consider IUL for Tax-Free Savings – No Income or Contribution Limits',
                description: 'An Indexed Universal Life (IUL) policy offers tax-deferred cash value growth with indexed returns and a 0% floor. Policy loans provide tax-free retirement income with NO income limits (unlike Roth IRA) and NO contribution caps (unlike 401(k)/IRA). IUL also includes living benefit riders for tax-free access during qualifying health events.'
            });
        }

        // Ensure score stays in 1-10 range
        score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

        return {
            score,
            level: this.getRiskLevel(score),
            reasons,
            recommendations: score <= 6 ? recommendations : []
        };
    },

    /**
     * Calculate Market / Sequence of Returns Risk
     */
    calculateMarketRisk(data) {
        let score = 7; // Start optimistic
        const reasons = [];
        const recommendations = [];

        // Check portfolio withdrawal rate
        const portfolioBalance = (data.market_portfolioBalance || 0);
        const annualIncome = (data.market_annualIncome || 0);
        const pensionIncome = (data.market_pensionIncome || 0);
        const ssIncome = (data.market_ssIncome || 0);
        
        const guaranteedIncome = pensionIncome + ssIncome;
        const portfolioWithdrawal = Math.max(0, annualIncome - guaranteedIncome);
        
        if (portfolioBalance > 0) {
            const withdrawalRate = (portfolioWithdrawal / portfolioBalance) * 100;
            
            if (withdrawalRate > 6) {
                score -= 3;
                reasons.push(`High withdrawal rate: ${withdrawalRate.toFixed(1)}%`);
                recommendations.push({
                    title: 'Reduce Portfolio Withdrawal Rate',
                    description: 'Your withdrawal rate exceeds safe withdrawal guidelines. Consider delaying retirement, increasing guaranteed income sources, or reducing expenses.'
                });
            } else if (withdrawalRate > 4) {
                score -= 1;
                reasons.push(`Withdrawal rate ${withdrawalRate.toFixed(1)}% is above 4% safe threshold`);
                recommendations.push({
                    title: 'Implement Bucket Strategy',
                    description: 'Divide portfolio into 3 buckets: cash (1-2 years expenses), bonds (3-7 years), and stocks (8+ years). This protects against sequence of returns risk.'
                });
            } else {
                score += 2;
                reasons.push(`Safe withdrawal rate: ${withdrawalRate.toFixed(1)}%`);
            }
        }

        // Check guaranteed income coverage
        if (annualIncome > 0) {
            const guaranteedPercent = (guaranteedIncome / annualIncome) * 100;
            
            if (guaranteedPercent > 80) {
                score += 2;
                reasons.push('Over 80% of income from guaranteed sources');
            } else if (guaranteedPercent < 50) {
                score -= 2;
                reasons.push('Less than 50% of income from guaranteed sources');
                recommendations.push({
                    title: 'Consider Income Annuity',
                    description: 'Purchase a deferred income annuity (DIA) or qualified longevity annuity contract (QLAC) to increase guaranteed lifetime income and reduce market dependency.'
                });
            }
        }

        // Check asset allocation
        const equityPercent = data.market_equityAllocation || 60;
        const yearsToRetirement = (data.market_plannedRetirementAge || 65) - (data.clientAge || 50);
        
        if (yearsToRetirement < 5 && equityPercent > 70) {
            score -= 2;
            reasons.push('High equity allocation near retirement');
            recommendations.push({
                title: 'Reduce Equity Exposure',
                description: 'With retirement approaching, gradually shift to a more conservative allocation to protect against market downturns.'
            });
        }

        score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

        return {
            score,
            level: this.getRiskLevel(score),
            reasons,
            recommendations: score <= 6 ? recommendations : []
        };
    },

    /**
     * Calculate Inflation Risk
     */
    calculateInflationRisk(data) {
        let score = 6; // Start in middle
        const reasons = [];
        const recommendations = [];

        // Check COLA on pension
        const hasPensionCOLA = data.inflation_pensionCOLA === 'yes';
        if (data.hasPension || data.market_pensionIncome > 0) {
            if (hasPensionCOLA) {
                score += 2;
                reasons.push('Pension includes COLA protection');
            } else {
                score -= 2;
                reasons.push('Pension has no COLA – purchasing power will decline');
                recommendations.push({
                    title: 'Maintain Growth Allocation',
                    description: 'Keep at least 60% of your portfolio in equities to outpace inflation over your retirement horizon. Without pension COLA, your portfolio must provide inflation protection.'
                });
            }
        }

        // Check Social Security COLA
        if (data.hasSocialSecurity || data.market_ssIncome > 0) {
            score += 1;
            reasons.push('Social Security includes annual COLA');
        }

        // Check equity allocation
        const equityPercent = data.market_equityAllocation || 60;
        if (equityPercent < 40) {
            score -= 2;
            reasons.push('Low equity allocation (<40%) limits inflation protection');
            recommendations.push({
                title: 'Increase Equity Allocation',
                description: 'Consider increasing stock allocation to at least 50-60% to maintain purchasing power over a 30+ year retirement.'
            });
        } else if (equityPercent >= 60) {
            score += 1;
            reasons.push('Adequate equity allocation for inflation protection');
        }

        // Check for inflation-protected securities
        if (data.inflationProtection) {
            score += 1;
            reasons.push('Portfolio includes TIPS or I-Bonds');
        } else {
            recommendations.push({
                title: 'Add Inflation-Protected Securities',
                description: 'Allocate 10-20% of fixed income to Treasury Inflation-Protected Securities (TIPS) or Series I Savings Bonds to provide inflation hedge.'
            });
        }

        // Healthcare inflation
        const yearsToMedicare = Math.max(0, 65 - (data.clientAge || 50));
        if (yearsToMedicare > 5 && !data.premedicareCoverage) {
            score -= 1;
            reasons.push('No plan for healthcare costs before Medicare');
            recommendations.push({
                title: 'Plan for Healthcare Inflation',
                description: 'Healthcare costs rise 6-8% annually. Budget $1,500-$2,000/month for pre-65 health insurance. Consider HSA contributions to build a tax-free healthcare reserve.'
            });
        }

        score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

        return {
            score,
            level: this.getRiskLevel(score),
            reasons,
            recommendations: score <= 6 ? recommendations : []
        };
    },

    /**
     * Calculate Longevity Risk
     */
    calculateLongevityRisk(data) {
        let score = 7; // Start optimistic
        const reasons = [];
        const recommendations = [];

        // Check guaranteed lifetime income
        const annualIncome = data.market_annualIncome || 100000;
        const pensionIncome = data.market_pensionIncome || 0;
        const ssIncome = data.market_ssIncome || 0;
        const guaranteedIncome = pensionIncome + ssIncome;
        
        if (annualIncome > 0) {
            const guaranteedPercent = (guaranteedIncome / annualIncome) * 100;
            
            if (guaranteedPercent > 80) {
                score += 2;
                reasons.push('Over 80% of income guaranteed for life');
            } else if (guaranteedPercent < 50) {
                score -= 2;
                reasons.push('Less than 50% guaranteed lifetime income');
                recommendations.push({
                    title: 'Consider Longevity Annuity',
                    description: 'Purchase a Qualified Longevity Annuity Contract (QLAC) with up to $200,000 of IRA funds. Payments start at age 80-85, protecting against outliving your assets.'
                });
            }
        }

        // Check health status
        const clientHealth = data.clientHealthStatus || '';
        const spouseHealth = data.spouseHealthStatus || '';
        
        if (clientHealth === 'Excellent' || spouseHealth === 'Excellent') {
            score -= 1;
            reasons.push('Excellent health increases longevity planning needs');
        }
        if (clientHealth === 'Poor' || spouseHealth === 'Poor') {
            score += 1;
            reasons.push('Health issues may reduce longevity risk');
        }

        // Check family longevity history
        if (data.familyLongevity === 'long') {
            score -= 1;
            reasons.push('Family history of longevity');
        }

        // Check Social Security claiming strategy
        const clientSSAge = this.parseSSAge(data.clientSSClaimAge);
        const spouseSSAge = this.parseSSAge(data.spouseSSClaimAge);
        
        if (clientSSAge >= 70 || spouseSSAge >= 70) {
            score += 1;
            reasons.push('Maximizing Social Security by delaying to age 70');
        } else if (clientSSAge < 67 || spouseSSAge < 67) {
            score -= 1;
            recommendations.push({
                title: 'Delay Social Security Claiming',
                description: 'For every year you delay Social Security past age 62, benefits increase 7-8%. Delaying to 70 provides maximum lifetime income and inflation protection.'
            });
        }

        score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

        return {
            score,
            level: this.getRiskLevel(score),
            reasons,
            recommendations: score <= 6 ? recommendations : []
        };
    },

    /**
     * Calculate Long-Term Care Risk
     */
    calculateLTCRisk(data) {
        let score = 5; // Start at middle
        const reasons = [];
        const recommendations = [];

        // Check LTC insurance
        const hasClientLTC = data.clientLTCInsurance && 
                             data.clientLTCInsurance !== 'None' && 
                             data.clientLTCInsurance !== '-- Select --';
        const hasSpouseLTC = data.spouseLTCInsurance && 
                             data.spouseLTCInsurance !== 'None' && 
                             data.spouseLTCInsurance !== '-- Select --';

        if (hasClientLTC && hasSpouseLTC) {
            score += 3;
            reasons.push('Both spouses have LTC insurance coverage');
        } else if (hasClientLTC || hasSpouseLTC) {
            score += 1;
            reasons.push('One spouse has LTC insurance');
            recommendations.push({
                title: 'Obtain LTC Coverage for Both Spouses',
                description: 'The spouse without coverage remains exposed to catastrophic LTC costs. Get quotes for the uncovered spouse immediately.'
            });
        } else {
            score -= 3;
            reasons.push('No long-term care insurance');
            recommendations.push({
                title: 'IUL with Living Benefits – Tax-Free LTC Protection with No Contribution or Income Limits',
                description: 'An IUL with chronic illness, critical illness, and terminal illness riders provides tax-free access to death benefit for qualifying LTC needs. Unlike traditional LTC insurance (use-it-or-lose-it), premiums build cash value that can be accessed via policy loans or passed to heirs. No income or contribution limits apply, making it ideal for high earners.'
            });
        }

        // Check self-insurance capacity
        const liquidAssets = (data.tax_taxableBalance || 0) + (data.emergencyFundBalance || 0);
        const retirementAssets = (data.market_portfolioBalance || 0);
        
        if (liquidAssets < 200000 && retirementAssets < 1000000 && !hasClientLTC && !hasSpouseLTC) {
            score -= 2;
            reasons.push('Insufficient assets to self-insure LTC risk');
            recommendations.push({
                title: 'Consider Hybrid Life/LTC Policy',
                description: 'A hybrid policy combines life insurance with LTC benefits. If you never need care, heirs receive the death benefit. This addresses the "use-it-or-lose-it" concern of traditional LTC insurance.'
            });
        } else if (liquidAssets > 500000 || retirementAssets > 2000000) {
            score += 1;
            reasons.push('Sufficient assets to partially self-insure LTC costs');
        }

        // Check family LTC history
        const hasFamilyDementia = data.familyDementia && 
                                  data.familyDementia !== 'No known history' &&
                                  data.familyDementia !== '-- Select --';
        
        if (hasFamilyDementia) {
            score -= 2;
            reasons.push('Family history of dementia/Alzheimer\'s increases LTC probability');
            recommendations.push({
                title: 'Obtain LTC Insurance Immediately',
                description: 'Family history of dementia significantly increases your LTC need probability. Get quotes before a diagnosis makes coverage unavailable or unaffordable.'
            });
        }

        // Age consideration
        const clientAge = data.clientAge || 50;
        if (clientAge < 50 && !hasClientLTC) {
            recommendations.push({
                title: 'Lock in LTC Insurance at Current Age',
                description: `At age ${clientAge}, premiums are relatively affordable and underwriting is easier. Every year you wait increases cost and reduces insurability.`
            });
        } else if (clientAge > 65 && !hasClientLTC) {
            score -= 1;
            reasons.push('Over age 65 without LTC coverage – premiums will be very high');
        }

        score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

        return {
            score,
            level: this.getRiskLevel(score),
            reasons,
            recommendations: score <= 6 ? recommendations : []
        };
    },

    /**
     * Calculate Involuntary Early Retirement Risk
     */
    calculateEarlyRetirementRisk(data) {
        let score = 6; // Start in middle
        const reasons = [];
        const recommendations = [];

        // Check disability insurance
        const hasClientDisability = data.clientDisabilityInsurance && 
                                    data.clientDisabilityInsurance !== 'None / No coverage' &&
                                    data.clientDisabilityInsurance !== '-- Select --';
        const hasSpouseDisability = data.spouseDisabilityInsurance && 
                                    data.spouseDisabilityInsurance !== 'None / No coverage' &&
                                    data.spouseDisabilityInsurance !== '-- Select --';

        if (hasClientDisability && hasSpouseDisability) {
            score += 2;
            reasons.push('Both spouses have disability insurance');
        } else if (!hasClientDisability && !hasSpouseDisability) {
            score -= 3;
            reasons.push('No disability insurance for either spouse');
            recommendations.push({
                title: 'Obtain Individual Disability Insurance Immediately',
                description: 'Disability insurance replaces 60-70% of income if you cannot work. Get "own-occupation" coverage with benefit periods to age 65 or lifetime.'
            });
        } else {
            score += 1;
            recommendations.push({
                title: 'Obtain Disability Coverage for Both Spouses',
                description: 'The uninsured spouse remains vulnerable to income loss from disability. Get quotes immediately while both are still insurable.'
            });
        }

        // Check emergency fund
        const emergencyFund = data.emergencyFundBalance || 0;
        const monthlyExpenses = ((data.market_annualIncome || 100000) / 12);
        const monthsCovered = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;

        if (monthsCovered >= 6) {
            score += 2;
            reasons.push(`Emergency fund covers ${monthsCovered.toFixed(1)} months of expenses`);
        } else if (monthsCovered >= 3) {
            score += 1;
            reasons.push(`Emergency fund covers ${monthsCovered.toFixed(1)} months`);
        } else {
            score -= 2;
            reasons.push('Insufficient emergency fund (< 3 months expenses)');
            recommendations.push({
                title: 'Build 6-12 Month Emergency Fund',
                description: `Save ${(monthlyExpenses * 6).toLocaleString('en-US', {style: 'currency', currency: 'USD'})} to ${(monthlyExpenses * 12).toLocaleString('en-US', {style: 'currency', currency: 'USD'})} in a liquid savings account. This cushion prevents forced early retirement from becoming a financial crisis.`
            });
        }

        // Check years to retirement
        const clientAge = data.clientAge || 50;
        const plannedRetirementAge = data.market_plannedRetirementAge || 65;
        const yearsToRetirement = plannedRetirementAge - clientAge;

        if (yearsToRetirement > 15) {
            score -= 1;
            reasons.push(`${yearsToRetirement} years until planned retirement`);
        } else if (yearsToRetirement < 5) {
            score += 2;
            reasons.push('Close to planned retirement age');
        }

        // IUL with Critical Care Rider
        const hasLifeInsurance = data.clientLifeType && 
                                 data.clientLifeType !== 'None' &&
                                 data.clientLifeType !== '-- Select --';
        const hasLivingBenefits = data.clientLivingBenefits === 'Yes' || 
                                  data.spouseLivingBenefits === 'Yes';

        if (!hasLivingBenefits) {
            recommendations.push({
                title: 'Whole Life or IUL with Critical Care Rider – Protection Against Health-Forced Early Retirement',
                description: '46% of people who retire earlier than planned cite health problems or disabilities (EBRI). A critical care/critical illness rider pays a tax-free lump sum (typically 25-50% of death benefit) upon diagnosis of qualifying conditions like heart attack, stroke, cancer, or organ failure. This benefit provides immediate income replacement if a health crisis forces early retirement, protecting your retirement timeline. Cash value serves as emergency fund via policy loans. No income or contribution limits.'
            });
        }

        // Health status check
        const clientHealth = data.clientHealthStatus || '';
        const spouseHealth = data.spouseHealthStatus || '';
        
        if (clientHealth === 'Fair' || clientHealth === 'Poor' || 
            spouseHealth === 'Fair' || spouseHealth === 'Poor') {
            score -= 2;
            reasons.push('Current health issues increase early retirement risk');
            recommendations.push({
                title: 'Model Forced Early Retirement Scenarios',
                description: 'Run financial projections assuming retirement at ages 55, 57, 60, 62 to identify gaps. Determine how much you need in liquid reserves to bridge to Social Security and pension eligibility.'
            });
        }

        score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));

        return {
            score,
            level: this.getRiskLevel(score),
            reasons,
            recommendations: score <= 6 ? recommendations : []
        };
    },

    /**
     * Calculate overall risk score (weighted average)
     */
    calculateOverallScore(scores) {
        const weights = {
            tax: 0.15,
            market: 0.20,
            inflation: 0.15,
            longevity: 0.15,
            ltc: 0.20,
            earlyRetirement: 0.15
        };

        let weightedSum = 0;
        let totalWeight = 0;

        for (const [category, weight] of Object.entries(weights)) {
            if (scores[category] && scores[category].score) {
                weightedSum += scores[category].score * weight;
                totalWeight += weight;
            }
        }

        const overallScore = totalWeight > 0 ? weightedSum / totalWeight : 5;
        return Math.round(overallScore * 10) / 10;
    },

    /**
     * Determine risk level from numeric score
     */
    getRiskLevel(score) {
        if (score <= 3) return 'High Risk';
        if (score <= 6) return 'Moderate Risk';
        return 'Low Risk';
    },

    /**
     * Get color for risk level
     */
    getRiskColor(level) {
        const colors = {
            'High Risk': '#ef4444',
            'Moderate Risk': '#f59e0b',
            'Low Risk': '#10b981'
        };
        return colors[level] || '#6b7280';
    },

    /**
     * Parse Social Security claiming age from string
     */
    parseSSAge(ageString) {
        if (!ageString) return 67; // Default to FRA
        const match = ageString.match(/\d+/);
        return match ? parseInt(match[0]) : 67;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RiskScorer;
}
