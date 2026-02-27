# RetireSecure™ Risk Analyzer - Sample Test Data

## Purpose
Use these test scenarios to verify the tool calculates scores correctly and displays appropriate recommendations.

---

## Test Scenario 1: High-Risk Profile

### Input Data:
**Tax Risk:**
- Pre-tax accounts: $800,000
- Roth accounts: $0
- Taxable accounts: $0
- State: CA (high-tax state)

**Market Risk:**
- Portfolio balance: $800,000
- Annual income need: $100,000
- Pension income: $0
- Social Security: $30,000
- Equity allocation: 80%
- Planned retirement age: 55

**Inflation Risk:**
- Pension COLA: No pension

**Longevity Risk:**
- Family history: Long (live into 90s)

**LTC Risk:**
- Client coverage: No coverage
- Spouse coverage: No coverage

**Early Retirement Risk:**
- Client disability: No coverage
- Spouse disability: No coverage

### Expected Results:
- **Tax Risk:** ~2.0 (High Risk) - 100% pre-tax, high-tax state
- **Market Risk:** ~4.0 (Moderate Risk) - High withdrawal rate (~9%), high equity near retirement
- **Inflation Risk:** ~5.0 (Moderate Risk) - High equity helps, but no COLA
- **Longevity Risk:** ~5.0 (Moderate Risk) - Low guaranteed income, long lifespan
- **LTC Risk:** ~2.0 (High Risk) - No coverage, low assets
- **Early Retirement Risk:** ~2.0 (High Risk) - No disability insurance, no emergency fund
- **Overall:** ~3.3 (High Risk)

### Expected Recommendations:
- Begin Roth conversions immediately
- Consider IUL for tax-free savings
- Reduce equity allocation to 60-70%
- Build 6-12 month emergency fund
- Obtain disability insurance for both spouses
- IUL with living benefits for LTC coverage
- IUL with critical care rider for early retirement protection

---

## Test Scenario 2: Low-Risk Profile

### Input Data:
**Tax Risk:**
- Pre-tax accounts: $300,000
- Roth accounts: $400,000
- Taxable accounts: $300,000
- State: FL (no state income tax)

**Market Risk:**
- Portfolio balance: $1,000,000
- Annual income need: $100,000
- Pension income: $50,000
- Social Security: $40,000
- Equity allocation: 60%
- Planned retirement age: 67

**Inflation Risk:**
- Pension COLA: Yes - pension includes COLA

**Longevity Risk:**
- Family history: Average lifespan

**LTC Risk:**
- Client coverage: Hybrid Life/LTC policy
- Spouse coverage: Hybrid Life/LTC policy

**Early Retirement Risk:**
- Client disability: Individual own-occupation policy
- Spouse disability: Individual own-occupation policy

### Expected Results:
- **Tax Risk:** ~8.5 (Low Risk) - Good diversification, no state tax
- **Market Risk:** ~9.0 (Low Risk) - Only 1% withdrawal needed, 90% guaranteed income
- **Inflation Risk:** ~8.5 (Low Risk) - Pension COLA + SS COLA + adequate equity
- **Longevity Risk:** ~9.0 (Low Risk) - 90% guaranteed lifetime income
- **LTC Risk:** ~8.0 (Low Risk) - Both spouses covered with hybrid policies
- **Early Retirement Risk:** ~8.5 (Low Risk) - Both insured for disability
- **Overall:** ~8.6 (Low Risk)

### Expected Recommendations:
- None (or minimal) - all categories above 6.0 threshold

---

## Test Scenario 3: Mixed-Risk Profile

### Input Data:
**Tax Risk:**
- Pre-tax accounts: $600,000
- Roth accounts: $200,000
- Taxable accounts: $100,000
- State: OH (moderate tax)

**Market Risk:**
- Portfolio balance: $900,000
- Annual income need: $90,000
- Pension income: $40,000
- Social Security: $35,000
- Equity allocation: 65%
- Planned retirement age: 65

**Inflation Risk:**
- Pension COLA: Partial COLA (capped)

**Longevity Risk:**
- Family history: Long (live into 90s)

**LTC Risk:**
- Client coverage: Traditional LTC policy
- Spouse coverage: No coverage

**Early Retirement Risk:**
- Client disability: Both individual and employer
- Spouse disability: Employer group LTD only

### Expected Results:
- **Tax Risk:** ~5.5 (Moderate Risk) - 67% pre-tax is on the edge
- **Market Risk:** ~8.0 (Low Risk) - Only ~1.5% withdrawal rate
- **Inflation Risk:** ~6.5 (Low Risk) - Partial COLA + good equity
- **Longevity Risk:** ~7.0 (Low Risk) - 83% guaranteed income
- **LTC Risk:** ~6.0 (Moderate Risk) - Only one spouse covered
- **Early Retirement Risk:** ~7.0 (Low Risk) - Good disability coverage
- **Overall:** ~6.7 (Low Risk)

### Expected Recommendations:
- **Tax Risk (<6.0):** Begin Roth conversions, consider IUL
- **LTC Risk (=6.0):** Obtain coverage for spouse, IUL with living benefits

---

## Quick Manual Test Checklist

### Step 1: Welcome Screen
- [ ] Upload cards display correctly
- [ ] "Page 3 Only" instruction clear on Supplemental Form card
- [ ] "Start Manual Assessment" button works

### Step 2: Assessment Flow
- [ ] Progress bar updates (1/6 → 2/6 → ... → 6/6)
- [ ] Required field validation works
- [ ] Previous button appears after section 1
- [ ] Next button changes to "Calculate Results" on section 6

### Step 3: Results Display
- [ ] Overall score displays correctly
- [ ] Six risk cards render with correct colors
- [ ] High Risk = red border
- [ ] Moderate Risk = yellow border
- [ ] Low Risk = green border
- [ ] Recommendations appear for scores ≤ 6
- [ ] No recommendations for scores > 6

### Step 4: IUL Recommendations Check
- [ ] Tax risk ≤ 6 → Shows IUL for tax-free savings
- [ ] LTC risk ≤ 6 → Shows IUL with living benefits
- [ ] Early retirement risk ≤ 6 → Shows IUL with critical care rider

### Step 5: Print Function
- [ ] Click "Print Report"
- [ ] Header/footer/buttons hidden in print preview
- [ ] Risk cards print clearly
- [ ] Recommendations print completely

### Step 6: Restart Function
- [ ] Click "Restart Assessment"
- [ ] Returns to welcome screen
- [ ] All form data cleared
- [ ] PDF upload status cleared

---

## PDF Upload Test

### Test Gap Analysis Upload:
1. Upload a sample retirement gap analysis PDF
2. Check status message: "✓ Gap Analysis data loaded successfully!"
3. Click "Start Manual Assessment"
4. Verify fields are pre-filled where possible
5. Complete assessment
6. Verify scores calculate correctly

### Test Supplemental Form Upload:
1. Upload **Page 3 only** of the RetireSecure™ 3-page client package
2. Check status message: "✓ Supplemental form data loaded successfully!"
3. Click "Start Manual Assessment"
4. Verify detailed fields are pre-filled (disability coverage, LTC, health status, etc.)
5. Complete assessment
6. Verify scores calculate correctly

### Test Both PDFs Uploaded:
1. Upload Gap Analysis first → success message
2. Upload Supplemental Form second → success message
3. Verify both status messages show success
4. Click "Start Manual Assessment"
5. Verify merged data appears (Supplemental takes priority)
6. Complete assessment
7. Verify scores reflect combined data

---

## Browser Compatibility Test

### Desktop Browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Mobile Browsers:
- [ ] Chrome mobile (Android)
- [ ] Safari mobile (iOS)
- [ ] Samsung Internet (Android)

### Test on Each:
- [ ] Layout renders correctly
- [ ] Buttons are clickable (min 44px touch target)
- [ ] Form inputs are usable
- [ ] PDF upload works (mobile file picker)
- [ ] Results are readable
- [ ] Print function works

---

## Performance Test

### Load Time:
- [ ] Page loads in <2 seconds on 4G
- [ ] PDF.js library loads from CDN
- [ ] No console errors on load

### PDF Processing:
- [ ] Gap Analysis PDF parses in <5 seconds
- [ ] Supplemental Form PDF parses in <3 seconds
- [ ] Status messages appear during processing
- [ ] No browser freeze during parsing

### Results Calculation:
- [ ] Scores calculate instantly (<1 second)
- [ ] Results render smoothly
- [ ] Animated gauges display correctly

---

## Accessibility Test

- [ ] Tab navigation works through all form fields
- [ ] Screen reader can read all labels
- [ ] Color contrast meets WCAG AA standards (4.5:1)
- [ ] Focus indicators visible on all interactive elements
- [ ] Form validation messages are announced
- [ ] All images have alt text (if any added)

---

## Security Test

- [ ] No data sent to external servers (check Network tab)
- [ ] PDF parsing happens client-side only
- [ ] No cookies set
- [ ] No localStorage used (unless added later)
- [ ] HTTPS enforced when deployed
- [ ] No inline scripts (CSP compliant)

---

## Bug Reporting Template

If you find a bug, report it with:

**Environment:**
- Browser: [Chrome 120 / Firefox 121 / etc.]
- Device: [Desktop / iPhone 14 / Samsung S23 / etc.]
- OS: [Windows 11 / macOS 14 / Android 13 / iOS 17]

**Steps to Reproduce:**
1. [First step]
2. [Second step]
3. [...]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshot:**
[If applicable]

**Console Errors:**
[Open F12, check Console tab, copy any red errors]

---

**Testing Complete?** You're ready to deploy! 🚀
