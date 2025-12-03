# PowerShell Deployment Script for Backend (Railway)
# Usage: .\deploy-backend.ps1

Write-Host "🚀 Starting Backend Deployment to Railway..." -ForegroundColor Cyan

# Check if railway CLI is installed
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Railway CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Navigate to backend folder
Set-Location labs_api -ErrorAction Stop

# Build project locally first
Write-Host "🔨 Testing backend locally..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

# Generate Prisma Client
Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed!" -ForegroundColor Red
    Set-Location ..
    exit 1
}

Write-Host "✅ Local setup successful!" -ForegroundColor Green

# Check critical environment variables
Write-Host "🔍 Checking required environment variables..." -ForegroundColor Yellow

$requiredVars = @("DATABASE_URL", "JWT_SECRET")
$missingVars = @()

foreach ($var in $requiredVars) {
    if (-not (Get-Item env:$var -ErrorAction SilentlyContinue)) {
        $missingVars += $var
    }
}

if ($missingVars.Count -gt 0) {
    Write-Host "⚠️  Warning: Missing environment variables:" -ForegroundColor Yellow
    foreach ($var in $missingVars) {
        Write-Host "   - $var"
    }
    Write-Host ""
    Write-Host "   Set them in Railway dashboard: Variables tab"
}

# Login to Railway
Write-Host "🔐 Logging into Railway..." -ForegroundColor Cyan
railway login

# Link to project
Write-Host "🔗 Linking to Railway project..." -ForegroundColor Cyan
railway link

# Deploy to Railway
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Cyan
railway up

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Check deployment logs in Railway dashboard"
    Write-Host "   2. Test health endpoint: /health"
    Write-Host "   3. Verify DATABASE_URL connection"
    Write-Host "   4. Update CORS_ORIGIN with frontend URL"
    Write-Host "   5. Test API endpoints with Postman"
} else {
    Write-Host "❌ Deployment failed! Check Railway logs." -ForegroundColor Red
    Set-Location ..
    exit 1
}

Set-Location ..
