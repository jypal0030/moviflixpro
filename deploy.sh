#!/bin/bash

# Movieflix Pro Deployment Script
# This script helps deploy the project to Vercel

echo "🚀 Starting Movieflix Pro Deployment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run linting
echo "🔍 Running linting..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix the errors before deploying."
    exit 1
fi

# Run build
echo "🏗️  Building the project..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors before deploying."
    exit 1
fi

# Run type check if TypeScript
if [ -f "tsconfig.json" ]; then
    echo "🔍 Running TypeScript check..."
    npx tsc --noEmit
    if [ $? -ne 0 ]; then
        echo "❌ TypeScript check failed. Please fix the errors before deploying."
        exit 1
    fi
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment completed successfully!"
echo "🌐 Your site is now live!"