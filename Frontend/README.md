
# Patient Risk Assessment Dashboard

A React-based dashboard for visualizing patient risk assessments and drug counterfactuals.

## Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## Deployment to GitHub Pages

### Automatic Deployment
The app automatically deploys to GitHub Pages when you push to the `main` branch.

### Manual Data Updates
To update the patient data and counterfactuals:

1. **Update Data Files**:
   - Replace `data/counterfactuals.csv` with new counterfactual data
   - Replace `data/pool_critical.csv` with new patient data (CSV format)

2. **Commit and Push**:
   ```bash
   git add data/
   git commit -m "Update patient data"
   git push origin main
   ```

3. **Automatic Deployment**:
   - GitHub Actions will build and deploy the app
   - Data files are included in the deployment

### URLs
- **App**: `https://YOUR_USERNAME.github.io/YOUR_REPO/`
- **Data Files**: `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data/`

## Data Format

### Counterfactuals CSV
```csv
ID,Current Drug,New Drug,Current Risk,New Risk,Change in Risk,Old Class,New Class,New Status
172246181,HYDROXYZINE,SERTRALINE,0.6644,0.6087,-0.556,Critical/Permanent,Critical/Permanent,CRITICAL
```

### Patients Parquet
Contains patient demographic and prescription data with risk scores.

## Architecture

- **Frontend**: React + TypeScript + Vite
- **Data**: CSV files parsed with papaparse
- **Hosting**: GitHub Pages
- **CI/CD**: GitHub Actions

---

*Original Figma design: https://www.figma.com/design/75TsZpwTuX7Nm1XS7MAicN/CSCE6242-UI-Draft*
  
