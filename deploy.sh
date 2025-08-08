#!/bin/bash

# Hostinger VPS Deployment Script
# Run this on your VPS after uploading the project

echo "🚀 Starting deployment..."

# Navigate to project directory
cd /var/www/huntier-app || exit

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Build the application
echo "🔨 Building application..."
npm run build

# Set up environment
echo "⚙️ Setting up environment..."
# Make sure .env.local exists with production values

# Start with PM2
echo "🎯 Starting application with PM2..."
pm2 delete huntier-app || true
pm2 start npm --name "huntier-app" -- start
pm2 save
pm2 startup

echo "✅ Deployment complete!"
echo "Application running on http://localhost:3000"