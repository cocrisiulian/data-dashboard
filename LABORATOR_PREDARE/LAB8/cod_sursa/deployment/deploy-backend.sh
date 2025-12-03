#!/bin/bash

# Deploy Backend to Railway
# Usage: ./deploy-backend.sh

echo "🚀 Starting Backend Deployment to Railway..."

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📦 Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

# Navigate to backend folder
cd labs_api || exit 1

# Build project locally first
echo "🔨 Testing backend locally..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed!"
    exit 1
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Prisma generate failed!"
    exit 1
fi

echo "✅ Local setup successful!"

# Check critical environment variables
echo "🔍 Checking required environment variables..."

required_vars=("DATABASE_URL" "JWT_SECRET")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "⚠️  Warning: Missing environment variables:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "   Set them in Railway dashboard: Variables tab"
fi

# Login to Railway
echo "🔐 Logging into Railway..."
railway login

# Link to project
echo "🔗 Linking to Railway project..."
railway link

# Deploy to Railway
echo "🚀 Deploying to Railway..."
railway up

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Check deployment logs in Railway dashboard"
    echo "   2. Test health endpoint: /health"
    echo "   3. Verify DATABASE_URL connection"
    echo "   4. Update CORS_ORIGIN with frontend URL"
    echo "   5. Test API endpoints with Postman"
else
    echo "❌ Deployment failed! Check Railway logs."
    exit 1
fi

cd ..
