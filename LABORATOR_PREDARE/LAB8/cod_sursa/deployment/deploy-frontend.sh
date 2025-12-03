#!/bin/bash

# Deploy Frontend to Vercel
# Usage: ./deploy-frontend.sh

echo "🚀 Starting Frontend Deployment to Vercel..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Build project locally first to catch errors
echo "🔨 Building project locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Fix errors before deploying."
    exit 1
fi

echo "✅ Local build successful!"

# Check environment variables
echo "🔍 Checking environment variables..."

if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "⚠️  Warning: NEXT_PUBLIC_API_URL not set in environment"
    echo "   Set it in Vercel dashboard: Settings → Environment Variables"
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Check deployment in Vercel dashboard"
    echo "   2. Test URL provided above"
    echo "   3. Configure custom domain if needed"
    echo "   4. Update CORS in backend with new URL"
else
    echo "❌ Deployment failed! Check Vercel logs."
    exit 1
fi
