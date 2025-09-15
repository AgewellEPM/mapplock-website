#!/bin/bash

# MappLock Website Deployment Script
# Deploy to mapplock.com or GitHub Pages

echo "🚀 MappLock Website Deployment"
echo "=============================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -d "applock-website" ]; then
    print_error "Please run this script from the repository root directory"
    exit 1
fi

# Parse command line arguments
DEPLOY_TARGET=${1:-"github"}

case $DEPLOY_TARGET in
    "github")
        print_status "Deploying to GitHub Pages..."

        # Navigate to app directory
        cd applock-website

        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then
            print_status "Installing dependencies..."
            npm install
        fi

        # Build for GitHub Pages
        print_status "Building for production (GitHub Pages)..."
        npm run build -- --configuration production --base-href=/mapplock-website/

        # Install gh-pages if not installed
        if ! npm list angular-cli-ghpages > /dev/null 2>&1; then
            print_status "Installing angular-cli-ghpages..."
            npm install --save-dev angular-cli-ghpages
        fi

        # Deploy to GitHub Pages
        print_status "Deploying to GitHub Pages..."
        npx angular-cli-ghpages --dir=dist/applock-website

        print_success "Deployed to GitHub Pages!"
        echo "Visit: https://yourusername.github.io/mapplock-website"
        ;;

    "production")
        print_status "Deploying to production (mapplock.com)..."

        # Navigate to app directory
        cd applock-website

        # Install dependencies if needed
        if [ ! -d "node_modules" ]; then
            print_status "Installing dependencies..."
            npm install
        fi

        # Build for production
        print_status "Building for production..."
        npm run build -- --configuration production

        # Create deployment package
        print_status "Creating deployment package..."
        cd dist/applock-website
        tar -czf ../../mapplock-website.tar.gz *
        cd ../..

        print_success "Production build ready!"
        echo "Upload mapplock-website.tar.gz to your hosting provider"
        echo ""
        echo "For Netlify:"
        echo "  1. Drag the dist/applock-website folder to Netlify"
        echo "  2. Set custom domain to mapplock.com"
        echo ""
        echo "For Vercel:"
        echo "  vercel --prod ./dist/applock-website"
        ;;

    "netlify")
        print_status "Deploying to Netlify..."

        # Navigate to app directory
        cd applock-website

        # Build for production
        print_status "Building for production..."
        npm run build -- --configuration production

        # Check if netlify-cli is installed
        if ! command -v netlify &> /dev/null; then
            print_error "Netlify CLI not found. Install it with: npm install -g netlify-cli"
            exit 1
        fi

        # Deploy to Netlify
        print_status "Deploying to Netlify..."
        netlify deploy --prod --dir=dist/applock-website

        print_success "Deployed to Netlify!"
        ;;

    "vercel")
        print_status "Deploying to Vercel..."

        # Navigate to app directory
        cd applock-website

        # Build for production
        print_status "Building for production..."
        npm run build -- --configuration production

        # Check if vercel is installed
        if ! command -v vercel &> /dev/null; then
            print_error "Vercel CLI not found. Install it with: npm install -g vercel"
            exit 1
        fi

        # Deploy to Vercel
        print_status "Deploying to Vercel..."
        vercel --prod ./dist/applock-website

        print_success "Deployed to Vercel!"
        ;;

    *)
        print_error "Unknown deployment target: $DEPLOY_TARGET"
        echo ""
        echo "Usage: ./deploy.sh [target]"
        echo ""
        echo "Available targets:"
        echo "  github     - Deploy to GitHub Pages (default)"
        echo "  production - Build for production deployment"
        echo "  netlify    - Deploy to Netlify"
        echo "  vercel     - Deploy to Vercel"
        exit 1
        ;;
esac

echo ""
print_success "Deployment complete!"