#!/bin/bash

# CI/CD Setup Script for Vercel Auto-Deploy
# This script helps you set up automatic deployments

echo "🚀 WindBorne Balloon Tracker - CI/CD Setup"
echo "=========================================="
echo ""

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Git not initialized. Initializing..."
    git init
    echo "✅ Git initialized"
else
    echo "✅ Git already initialized"
fi

# Check current branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  Current branch: $CURRENT_BRANCH"
    echo "   Vercel recommends using 'main' or 'master' as production branch"
fi

# Stage all files
echo ""
echo "📦 Staging all files..."
git add .

# Commit
echo ""
echo "💾 Creating commit..."
git commit -m "Setup CI/CD for automatic Vercel deployments"

# Check if remote exists
if git remote | grep -q origin; then
    echo "✅ Remote 'origin' exists"
    REMOTE_URL=$(git remote get-url origin)
    echo "   URL: $REMOTE_URL"
else
    echo ""
    echo "⚠️  No remote repository configured"
    echo ""
    echo "To add your GitHub repository:"
    echo "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    echo ""
    read -p "Enter your GitHub repository URL (or press Enter to skip): " REPO_URL
    if [ ! -z "$REPO_URL" ]; then
        git remote add origin "$REPO_URL"
        echo "✅ Remote added"
    fi
fi

# Push to GitHub
echo ""
read -p "Push to GitHub now? (y/n): " PUSH_NOW
if [ "$PUSH_NOW" = "y" ] || [ "$PUSH_NOW" = "Y" ]; then
    echo "📤 Pushing to GitHub..."
    git push -u origin $CURRENT_BRANCH
    echo "✅ Pushed to GitHub"
fi

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Go to https://vercel.com/dashboard"
echo "2. Click 'Add New Project'"
echo "3. Import your GitHub repository"
echo "4. Add environment variable:"
echo "   Key: OPENWEATHER_API_KEY"
echo "   Value: 89972890df182b96246044805e4d18c8"
echo "5. Click 'Deploy'"
echo ""
echo "🎉 After that, every git push will auto-deploy!"
echo ""
echo "📖 Read CICD_SETUP.md for detailed instructions"
echo "=========================================="

