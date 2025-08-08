# CI/CD Documentation

## Overview
This repository uses GitHub Actions for Continuous Integration and Continuous Deployment (CI/CD). The pipeline automates testing, building, and deployment processes for both frontend and backend applications.

## Workflows

### 1. Main CI/CD Pipeline (`ci-cd.yml`)
**Triggers:** Push to `main`, `develop`, `full-stack` branches and pull requests to `main`, `develop`

**Jobs:**
- **Frontend Job:**
  - Installs dependencies
  - Runs linting checks
  - Executes tests with coverage
  - Builds the React application
  - Builds and pushes Docker image to GitHub Container Registry

- **Backend Job:**
  - Installs dependencies
  - Validates application startup
  - Builds and pushes Docker image to GitHub Container Registry

- **Security Scan Job:**
  - Runs Trivy vulnerability scanner
  - Uploads results to GitHub Security tab

- **Deploy Job:**
  - Runs only on `main` branch pushes
  - Placeholder for deployment logic

### 2. Pull Request Validation (`pr-validation.yml`)
**Triggers:** Pull requests to `main`, `develop`

**Features:**
- Validates both frontend and backend
- Checks Docker builds
- Scans for secrets using TruffleHog
- Adds size labels to PRs
- Comments validation results on PR

### 3. Release Pipeline (`release.yml`)
**Triggers:** Push of version tags (e.g., `v1.0.0`)

**Features:**
- Creates GitHub releases with auto-generated changelogs
- Builds and pushes release-tagged Docker images
- Creates deployment packages
- Deploys to production environment

### 4. Dependency Updates (`dependency-updates.yml`)
**Triggers:** Weekly schedule (Mondays) or manual dispatch

**Features:**
- Checks for outdated npm packages
- Creates PRs with dependency updates
- Runs security audits
- Creates issues for security vulnerabilities

## Required Secrets

Configure the following secrets in your GitHub repository settings:

### Application Secrets
- `REACT_APP_API_BASE_URL` - Backend API base URL
- `REACT_APP_AUTH0_DOMAIN` - Auth0 domain
- `REACT_APP_AUTH0_CLIENT_ID` - Auth0 client ID
- `REACT_APP_AUTH0_AUDIENCE` - Auth0 audience
- `BASE_FILE_URL_FOR_IMG` - Base URL for images
- `REACT_APP_NO_IMAGE_AVAILABLE_LOGO` - Default image URL

### Deployment Secrets (if using external services)
- `DEPLOY_HOST` - Production server hostname
- `DEPLOY_USER` - SSH username for deployment
- `DEPLOY_KEY` - SSH private key for deployment
- `DOCKER_REGISTRY_PASSWORD` - If using external Docker registry

## Container Registry

Docker images are pushed to GitHub Container Registry (ghcr.io) with the following naming convention:
- Frontend: `ghcr.io/liamtrann/densndent-frontend`
- Backend: `ghcr.io/liamtrann/densndent-backend`

## Branch Strategy

- **`main`** - Production branch, triggers full CI/CD including deployment
- **`develop`** - Development branch, triggers CI/CD without production deployment
- **`full-stack`** - Feature branch, triggers CI/CD pipeline
- **Feature branches** - Should be merged via PRs with validation

## Deployment Environments

### Development
- Triggered on pushes to `develop` branch
- Deploys to development environment
- Uses development configuration

### Production
- Triggered on pushes to `main` branch
- Requires manual approval (configured in GitHub Environment settings)
- Uses production configuration

## Monitoring and Notifications

### Security
- Vulnerability scanning with Trivy
- Dependency auditing with npm audit
- Secret scanning with TruffleHog
- Results uploaded to GitHub Security tab

### Quality Gates
- All tests must pass
- Linting must pass without warnings
- Docker builds must succeed
- Security scans must not find high-severity issues

## Manual Deployment

To deploy manually:

1. **Create a release tag:**
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Manual workflow dispatch:**
   - Go to Actions tab in GitHub
   - Select the workflow
   - Click "Run workflow"

## Troubleshooting

### Common Issues

1. **Build failures:**
   - Check if all required secrets are configured
   - Verify Node.js version compatibility
   - Check for dependency conflicts

2. **Docker build failures:**
   - Verify Dockerfile syntax
   - Check if all required files are included in build context
   - Ensure build arguments are properly set

3. **Deployment failures:**
   - Check deployment target connectivity
   - Verify deployment credentials
   - Check environment variable configuration

### Viewing Logs
- Go to Actions tab in GitHub repository
- Click on the failed workflow run
- Expand the failed job to see detailed logs

## Customization

### Adding New Environments
1. Create environment in GitHub repository settings
2. Configure required secrets for the environment
3. Add deployment job in workflow file
4. Update branch protection rules if needed

### Adding Database Migrations
Add a migration step before deployment:
```yaml
- name: Run database migrations
  run: |
    # Add your migration commands here
    npm run migrate
```

### Adding Integration Tests
Add integration test job:
```yaml
integration-tests:
  needs: [frontend, backend]
  runs-on: ubuntu-latest
  steps:
    - name: Run integration tests
      run: |
        docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```
