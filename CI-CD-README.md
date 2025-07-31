# Simple CI/CD Setup for Densndent

This repository includes a simple CI/CD pipeline using GitHub Actions that automatically tests your frontend and backend when you push code.

## 🚀 What It Does

When you push to `main` or `full-stack` branches:

1. **Frontend Testing:**
   - Installs dependencies
   - Runs ESLint checks
   - Runs tests
   - Builds the React app

2. **Backend Testing:**
   - Installs dependencies
   - Starts the server briefly to check it works

3. **Security Check:**
   - Runs npm audit on both frontend and backend

## 📋 Setup (Optional)

The pipeline works out of the box, but if you want to customize the React build, add these secrets to your GitHub repository (Settings → Secrets):

```
REACT_APP_API_BASE_URL
REACT_APP_AUTH0_DOMAIN
REACT_APP_AUTH0_CLIENT_ID
REACT_APP_AUTH0_AUDIENCE
BASE_FILE_URL_FOR_IMG
REACT_APP_NO_IMAGE_AVAILABLE_LOGO
```

## 🔧 How to Use

Just push your code:
```bash
git add .
git commit -m "Your changes"
git push origin full-stack
```

The pipeline will automatically run and show you if everything passes ✅ or fails ❌.

## 📊 Viewing Results

Go to your repository → Actions tab to see the test results and logs.

## �️ Adding More Security Tools (Optional)

If you want better security monitoring, you can add these open-source tools:

### 1. **Snyk** (Free for open source)
Add to your workflow:
```yaml
- name: Run Snyk security scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### 2. **CodeQL** (GitHub's free security scanner)
Create `.github/workflows/codeql.yml`:
```yaml
name: CodeQL

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: github/codeql-action/init@v3
      with:
        languages: javascript
    - uses: github/codeql-action/analyze@v3
```

### 3. **Trivy** (Container/filesystem scanner)
Add to your workflow:
```yaml
- name: Run Trivy vulnerability scanner
  uses: aquasecurity/trivy-action@master
  with:
    scan-type: 'fs'
    scan-ref: '.'
```

That's it! Keep it simple and add more features only when you need them. 🎉
