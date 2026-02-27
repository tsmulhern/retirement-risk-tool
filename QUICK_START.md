# 🚀 RetireSecure™ Risk Analyzer - Quick Start Guide
## Get Your Tool Live in 20 Minutes (No Coding Required)

---

## 📋 What You Need

- ✅ GitHub account (free - we'll create one)
- ✅ Netlify account (free - we'll create one)
- ✅ Your Squarespace website (where you'll embed the tool)
- ✅ 20 minutes of time

**No coding, programming, or technical skills required!**

---

## Step 1: Download Your Files (2 minutes)

You already have all the files. You need to upload these **8 files** to GitHub:

```
✓ index.html
✓ css/style.css
✓ js/script.js
✓ js/pdfParser.js
✓ js/scorer.js
✓ README.md
✓ DEPLOYMENT.md
✓ TESTING.md
```

**Important:** Keep the folder structure:
- `css/` folder containing `style.css`
- `js/` folder containing 3 JavaScript files
- Other files in the main folder

---

## Step 2: Create GitHub Account (3 minutes)

1. Go to **[github.com](https://github.com)**
2. Click **"Sign up"** (top right)
3. Enter your email → Click "Continue"
4. Create a password → Click "Continue"
5. Choose a username (e.g., `tmulhern-advisor`) → Click "Continue"
6. Complete the verification puzzle
7. Click **"Create account"**
8. Check your email and click the verification link

✅ **You now have a GitHub account!**

---

## Step 3: Create Repository (5 minutes)

A "repository" is like a folder on GitHub where your files live.

1. **Log in to GitHub**
2. Click the **"+"** icon (top right) → Select **"New repository"**
3. Fill in:
   - **Repository name:** `retirement-risk-tool` (no spaces)
   - **Description:** `RetireSecure Risk Analyzer`
   - **Public** (must be public for free Netlify)
   - ✅ Check **"Add a README file"**
4. Click **"Create repository"**

You'll see your new repository page with just a README file.

---

## Step 4: Upload Files to GitHub (3 minutes)

1. On your repository page, click **"Add file"** → **"Upload files"**
2. **Drag and drop** all 8 files from your computer:
   - Drag `index.html`
   - Drag the `css` folder
   - Drag the `js` folder
   - Drag the 3 .md files (README, DEPLOYMENT, TESTING)
3. Wait for upload to complete (green checkmarks appear)
4. Scroll down and click **"Commit changes"** (green button)

✅ **Your files are now on GitHub!**

**Verify:** You should see all files listed on your repository page:
```
✓ css/
✓ js/
✓ index.html
✓ README.md
✓ DEPLOYMENT.md
✓ TESTING.md
```

---

## Step 5: Create Netlify Account (2 minutes)

1. Go to **[netlify.com](https://netlify.com)**
2. Click **"Sign up"** (top right)
3. Click **"Sign up with GitHub"** (IMPORTANT: Use GitHub login!)
4. Click **"Authorize Netlify"** in the popup
5. You'll be logged into Netlify dashboard

✅ **Your GitHub and Netlify are now connected!**

---

## Step 6: Deploy to Netlify (3 minutes)

1. On Netlify dashboard, click **"Add new site"** → **"Import an existing project"**
2. Click **"Deploy with GitHub"**
3. Click **"Authorize Netlify"** again if asked
4. You'll see a list of your repositories → Click **"retirement-risk-tool"**
5. Leave all settings as default:
   - Branch: `main`
   - Build command: *(blank)*
   - Publish directory: *(blank)*
6. Click **"Deploy retirement-risk-tool"** (bottom)

**Wait 30-60 seconds...** Netlify will show "Site deploy in progress" → "Site is live!"

7. **Copy your URL** - It will look like:
   ```
   https://stellar-dolphin-abc123.netlify.app
   ```

✅ **Your tool is now live on the internet!**

---

## Step 7: Test Your Tool (2 minutes)

1. **Click your Netlify URL** (opens in new tab)
2. You should see the RetireSecure™ Risk Analyzer welcome screen
3. Click **"Start Manual Assessment"**
4. Fill in one section → Click "Next"
5. Verify the progress bar updates

✅ **If this works, your tool is fully functional!**

---

## Step 8: Add to Squarespace (5 minutes)

Now embed your live tool into your Squarespace website.

### 8A: Create New Page

1. Log in to **[squarespace.com](https://squarespace.com)**
2. Click **"Pages"** (left sidebar)
3. Click **"+"** → Select **"Blank Page"**
4. Name it: `Risk Analyzer Tool`
5. Click **"Save"**

### 8B: Add Code Block

1. Click **"Edit"** on your new page
2. Click **"+"** to add a block
3. Select **"Code"** (looks like `< >` symbol)
4. **Paste this code** (replace `YOUR-URL-HERE` with your Netlify URL):

```html
<div style="width:100%; overflow:hidden;">
  <iframe 
    src="YOUR-NETLIFY-URL-HERE"
    width="100%" 
    height="950px" 
    style="border:none; border-radius:8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1);"
    allowfullscreen>
  </iframe>
</div>
```

**Example with real URL:**
```html
<div style="width:100%; overflow:hidden;">
  <iframe 
    src="https://stellar-dolphin-abc123.netlify.app"
    width="100%" 
    height="950px" 
    style="border:none; border-radius:8px; box-shadow: 0 2px 12px rgba(0,0,0,0.1);"
    allowfullscreen>
  </iframe>
</div>
```

5. Click **"Apply"**
6. Click **"Save"**

### 8C: Password-Protect the Page

1. Click the **gear icon ⚙️** next to your page name
2. Click **"General"** tab
3. Scroll to **"Password"**
4. Enter a password (only you will know it)
5. Click **"Save"**

### 8D: Hide from Navigation (Optional)

1. In **"Pages"** menu, find your page
2. Drag it to the **"Not Linked"** section
3. Now it won't appear in your site menu
4. Access it by going directly to:
   ```
   https://yourwebsite.com/risk-analyzer-tool
   ```

✅ **Done! Bookmark that URL in your browser.**

---

## ✅ Congratulations! You're Live!

Your RetireSecure™ Risk Analyzer is now:
- ✅ Hosted on the internet (Netlify)
- ✅ Embedded in your Squarespace site
- ✅ Password-protected (advisor-only)
- ✅ Ready to use with clients

---

## 🎯 How to Use With Clients

### Before Meeting:
1. Obtain client's Gap Analysis Report and/or Supplemental Form (Page 3)
2. Navigate to your Squarespace page
3. Enter your password

### During Meeting:
1. **Option A:** Upload PDF(s) → Auto-populates data → Review & adjust
2. **Option B:** Complete form manually with client
3. Progress through 6 sections (5-10 minutes)
4. Review results together
5. Print report for client records
6. Discuss priority recommendations

### After Meeting:
1. Click "Restart Assessment" to clear data
2. Tool is ready for next client

---

## 🔄 How to Update the Tool in the Future

When you want to make changes to the tool:

1. Go to **github.com** → Your repository
2. Click on the file you want to update (e.g., `js/scorer.js`)
3. Click the pencil icon (✏️ Edit)
4. Make your changes
5. Scroll down → Click **"Commit changes"**
6. **Netlify automatically redeploys in 30 seconds!**
7. Refresh your Squarespace page → See the updates

---

## 🐛 Troubleshooting

### "My Netlify URL shows a blank page"
- **Fix:** Check that you uploaded the `css` and `js` folders, not just the files inside them
- **Verify:** On GitHub, you should see `css/` and `js/` as folders, not loose files

### "PDF upload shows an error"
- **Fix:** Make sure you have internet connection (tool loads PDF.js from CDN)
- **Test:** Open browser console (F12) → Should not show red errors

### "Squarespace iFrame is blank"
- **Fix:** Make sure you pasted your actual Netlify URL, not the placeholder text
- **Test:** Open the Netlify URL directly in a browser first

### "I can't find the Code block in Squarespace"
- **Fix:** Look for a block with a `< >` symbol, or search for "Code" in the block menu
- **Note:** Code blocks may be in the "More" section of the block menu

### "Tool doesn't work on mobile"
- **Fix:** Increase iFrame height to `1100px` for better mobile display
- **Test:** The tool is mobile-responsive, but may need taller iFrame

---

## 📞 Need Help?

**Technical Support:**
- Check `README.md` for detailed documentation
- Check `TESTING.md` for troubleshooting steps
- Review browser console (F12) for error messages

**Business Questions:**
Terry Mulhern  
TMulhern@Ed-Advisors.com  
(216) 469-8851

---

## 🎉 You Did It!

You just deployed a professional web application without writing a single line of code!

**What you built:**
- ✅ Professional risk assessment tool
- ✅ PDF upload and auto-population
- ✅ Six risk categories with personalized recommendations
- ✅ Print-friendly reports
- ✅ Mobile-responsive design
- ✅ Zero monthly hosting costs
- ✅ Automatic updates (via GitHub → Netlify)

**Start using it with clients today!**

---

**Pro Tip:** Bookmark these three URLs:
1. 🔖 Your Squarespace page: `https://yourwebsite.com/risk-analyzer-tool`
2. 🔖 Your GitHub repository: `https://github.com/YOUR-USERNAME/retirement-risk-tool`
3. 🔖 Your Netlify dashboard: `https://app.netlify.com`
