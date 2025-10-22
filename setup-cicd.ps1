# CI/CD Setup Script for Vercel Auto-Deploy (PowerShell)

Write-Host ""
Write-Host "CI/CD AUTO-DEPLOY SETUP" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path .git)) {
    Write-Host "Git not initialized. Initializing..." -ForegroundColor Yellow
    git init
    Write-Host "Git initialized" -ForegroundColor Green
} else {
    Write-Host "Git already initialized" -ForegroundColor Green
}

# Check current branch
$currentBranch = git branch --show-current
if ($currentBranch -ne "main" -and $currentBranch -ne "master") {
    Write-Host "Current branch: $currentBranch" -ForegroundColor Yellow
    Write-Host "Vercel recommends using main or master as production branch" -ForegroundColor Yellow
}

# Stage all files
Write-Host ""
Write-Host "Staging all files..." -ForegroundColor Cyan
git add .

# Commit
Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Cyan
git commit -m "Setup CI/CD for automatic Vercel deployments"

# Check if remote exists
$remotes = git remote
if ($remotes -contains "origin") {
    Write-Host "Remote origin exists" -ForegroundColor Green
    $remoteUrl = git remote get-url origin
    Write-Host "URL: $remoteUrl" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "No remote repository configured" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To add your GitHub repository:" -ForegroundColor White
    Write-Host "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git" -ForegroundColor Gray
    Write-Host ""
    $repoUrl = Read-Host "Enter your GitHub repository URL (or press Enter to skip)"
    if ($repoUrl) {
        git remote add origin $repoUrl
        Write-Host "Remote added" -ForegroundColor Green
    }
}

# Push to GitHub
Write-Host ""
$pushNow = Read-Host "Push to GitHub now? (y/n)"
if ($pushNow -eq "y" -or $pushNow -eq "Y") {
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push -u origin $currentBranch
    Write-Host "Pushed to GitHub" -ForegroundColor Green
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Click Add New Project" -ForegroundColor White
Write-Host "3. Import your GitHub repository" -ForegroundColor White
Write-Host "4. Add environment variable:" -ForegroundColor White
Write-Host "   Key: OPENWEATHER_API_KEY" -ForegroundColor Gray
Write-Host "   Value: 89972890df182b96246044805e4d18c8" -ForegroundColor Gray
Write-Host "5. Click Deploy" -ForegroundColor White
Write-Host ""
Write-Host "After that, every git push will auto-deploy!" -ForegroundColor Green
Write-Host ""
Write-Host "Read CICD_SETUP.md for detailed instructions" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""
