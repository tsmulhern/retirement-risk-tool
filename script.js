/**
 * RetireSecure™ PDF Parser
 * Extracts data from Gap Analysis Reports and Supplemental Forms
 */

// PDF Parser Module
const PDFParser = {
    /**
     * Parse Gap Analysis Report PDF
     * @param {File} file - The uploaded PDF file
     * @returns {Promise<Object>} - Extracted data object
     */
    async parseGapAnalysis(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            let fullText = '';
            
            // Extract text from all pages
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + '\n';
            }
            
            return this.extractGapAnalysisData(fullText);
        } catch (error) {
            console.error('Error parsing Gap Analysis PDF:', error);
            throw new Error('Failed to parse Gap Analysis PDF. Please ensure it\'s a valid PDF file.');
        }
    },

    /**
     * Parse Supplemental Form PDF (Page 3 only)
     * @param {File} file - The uploaded PDF file
     * @returns {Promise<Object>} - Extracted form data
     */
    async parseSupplementalForm(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            
            // Extract form fields
            const formData = {};
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const annotations = await page.getAnnotations();
                
                annotations.forEach(annot => {
                    if (annot.fieldType && annot.fieldName) {
                        let value = annot.buttonValue || annot.fieldValue || '';
                        
                        // Handle arrays (dropdowns with multiple selections)
                        if (Array.isArray(value)) {
                            value = value[0] || '';
                        }
                        
                        // Convert bytes to string if needed
                        if (typeof value === 'object' && value.length) {
                            value = String.fromCharCode(...value);
                        }
                        
                        // Clean up the value
                        value = value.toString().trim();
                        
                        // Skip empty values and "-- Select --" defaults
                        if (value && value !== '-- Select --') {
                            formData[annot.fieldName] = value;
                        }
                    }
                });
            }
            
            return this.extractSupplementalData(formData);
        } catch (error) {
            console.error('Error parsing Supplemental Form PDF:', error);
            throw new Error('Failed to parse Supplemental Form PDF. Please ensure it\'s a valid PDF file.');
        }
    },

    /**
     * Extract data from Gap Analysis text
     * @param {string} text - Full text content from PDF
     * @returns {Object} - Structured data object
     */
    extractGapAnalysisData(text) {
        const data = {};
        
        // Extract ages
        const clientAgeMatch = text.match(/Client.*?age\s+(\d+)/i) || text.match(/(\d+)\s+years?\s+old/i);
        const spouseAgeMatch = text.match(/Spouse.*?age\s+(\d+)/i);
        
        data.clientAge = clientAgeMatch ? parseInt(clientAgeMatch[1]) : null;
        data.spouseAge = spouseAgeMatch ? parseInt(spouseAgeMatch[1]) : null;
        
        // Extract income
        const incomeMatch = text.match(/(?:combined\s+)?income.*?\$?([\d,]+)/i);
        data.combinedIncome = incomeMatch ? parseInt(incomeMatch[1].replace(/,/g, '')) : null;
        
        // Extract retirement accounts
        const retirementAccountMatch = text.match(/(?:401\(?k\)?|IRA|retirement\s+account).*?\$?([\d,]+)/i);
        data.retirementAccountBalance = retirementAccountMatch ? parseInt(retirementAccountMatch[1].replace(/,/g, '')) : null;
        
        // Detect pension
        data.hasPension = /pension|OPERS|STRS|PERS|CalPERS|SERS/i.test(text);
        
        // Detect Social Security
        data.hasSocialSecurity = /social\s+security|SS\s+benefit/i.test(text);
        
        // Extract projected retirement age
        const retirementAgeMatch = text.match(/retire(?:ment)?.*?age\s+(\d+)/i);
        data.plannedRetirementAge = retirementAgeMatch ? parseInt(retirementAgeMatch[1]) : null;
        
        // Detect tax diversification
        data.hasRothAccounts = /Roth\s+(?:IRA|401\(?k\)?)|Roth\s+conversion/i.test(text);
        data.hasTaxableAccounts = /taxable\s+(?:account|brokerage)|brokerage\s+account/i.test(text);
        
        // Detect insurance
        data.hasLTCInsurance = /long[‑\s-]term\s+care|LTC\s+(?:insurance|policy)/i.test(text);
        data.hasDisabilityInsurance = /disability\s+insurance|LTD|long[‑\s-]term\s+disability/i.test(text);
        data.hasLifeInsurance = /life\s+insurance|death\s+benefit/i.test(text);
        
        // Detect emergency fund
        const emergencyFundMatch = text.match(/emergency\s+(?:fund|savings|reserve).*?\$?([\d,]+)/i);
        data.emergencyFundBalance = emergencyFundMatch ? parseInt(emergencyFundMatch[1].replace(/,/g, '')) : null;
        
        // Detect health information
        data.hasHealthIssues = /health\s+(?:issue|problem|condition)|chronic\s+(?:illness|condition)/i.test(text);
        
        // Detect inflation concerns
        data.inflationProtection = /TIPS|I-bonds|inflation[‑\s-]protected|COLA/i.test(text);
        
        return data;
    },

    /**
     * Extract data from Supplemental Form fields
     * @param {Object} formData - Raw form field data
     * @returns {Object} - Structured data object
     */
    extractSupplementalData(formData) {
        const data = {};
        
        // Disability Insurance
        data.clientDisabilityInsurance = formData.client_disability || '';
        data.spouseDisabilityInsurance = formData.spouse_disability || '';
        data.disabilityMonthlyBenefit = this.parseNumber(formData.disability_monthly_benefit);
        data.disabilityElimination = formData.disability_elimination || '';
        data.disabilityBenefitPeriod = formData.disability_benefit_period || '';
        
        // Emergency Fund
        data.emergencyFundBalance = this.parseNumber(formData.emergency_fund_balance);
        data.emergencyMonths = formData.emergency_months || '';
        
        // Life Insurance
        data.clientLifeType = formData.client_life_type || '';
        data.clientLifeDeathBenefit = this.parseNumber(formData.client_life_death_benefit);
        data.clientLivingBenefits = formData.client_living_benefits || '';
        data.spouseLifeType = formData.spouse_life_type || '';
        data.spouseLifeDeathBenefit = this.parseNumber(formData.spouse_life_death_benefit);
        data.spouseLivingBenefits = formData.spouse_living_benefits || '';
        
        // Family Health History
        data.familyDementia = formData.family_dementia || '';
        data.familyHeartStroke = formData.family_heart_stroke || '';
        
        // Retirement Account Allocation
        data.equityAllocation = formData.equity_allocation || '';
        data.roth401kAvailable = formData.roth_401k_available || '';
        
        // Roth IRA / Taxable Accounts
        data.rothIraOwnership = formData.roth_ira_ownership || '';
        data.rothCombinedBalance = this.parseNumber(formData.roth_combined_balance);
        data.brokerageExists = formData.brokerage_exists || '';
        data.brokerageBalance = this.parseNumber(formData.brokerage_balance);
        
        // Current Health Status
        data.clientHealthStatus = formData.client_health_status || '';
        data.spouseHealthStatus = formData.spouse_health_status || '';
        data.tobaccoUse = formData.tobacco_use || '';
        data.chronicConditions = formData.chronic_conditions || '';
        
        // Long-Term Care Insurance
        data.clientLTCInsurance = formData.client_ltc_coverage || '';
        data.spouseLTCInsurance = formData.spouse_ltc_coverage || '';
        data.ltcMonthlyBenefit = this.parseNumber(formData.ltc_monthly_benefit);
        data.ltcInflationRider = formData.ltc_inflation_rider || '';
        
        // Pre-Medicare Healthcare
        data.premedicareCoverage = formData.premedicare_coverage || '';
        data.premedicareMonthlyPremium = this.parseNumber(formData.premedicare_monthly_premium);
        
        // Social Security Claiming Strategy
        data.clientSSClaimAge = formData.client_ss_claim_age || '';
        data.spouseSSClaimAge = formData.spouse_ss_claim_age || '';
        data.ssOptimizationDone = formData.ss_optimization_done || '';
        
        // Additional Notes
        data.additionalNotes = formData.additional_notes || '';
        
        return data;
    },

    /**
     * Parse numeric value from string
     * @param {string} value - String value potentially containing a number
     * @returns {number|null} - Parsed number or null
     */
    parseNumber(value) {
        if (!value) return null;
        const cleaned = value.toString().replace(/[$,\s]/g, '');
        const num = parseFloat(cleaned);
        return isNaN(num) ? null : num;
    },

    /**
     * Merge Gap Analysis and Supplemental data
     * @param {Object} gapData - Data from Gap Analysis
     * @param {Object} suppData - Data from Supplemental Form
     * @returns {Object} - Merged data object
     */
    mergeData(gapData, suppData) {
        // Supplemental data takes priority over Gap Analysis data
        return {
            ...gapData,
            ...suppData
        };
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFParser;
}
