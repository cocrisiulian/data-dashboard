# PowerShell Deployment Script for Frontend (Vercel)
# Usage: .\deploy-frontend.ps1

Write-Host "🚀 Starting Frontend Deployment to Vercel..." -ForegroundColor Cyan

# Check if vercel CLI is installed
if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# Build project locally first to catch errors
Write-Host "🔨 Building project locally..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed! Fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Local build successful!" -ForegroundColor Green

# Check environment variables
Write-Host "🔍 Checking environment variables..." -ForegroundColor Yellow

if (-not $env:NEXT_PUBLIC_API_URL) {
    Write-Host "⚠️  Warning: NEXT_PUBLIC_API_URL not set in environment" -ForegroundColor Yellow
    Write-Host "   Set it in Vercel dashboard: Settings → Environment Variables"
}

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Check deployment in Vercel dashboard"
    Write-Host "   2. Test URL provided above"
    Write-Host "   3. Configure custom domain if needed"
    Write-Host "   4. Update CORS in backend with new URL"
} else {
    Write-Host "❌ Deployment failed! Check Vercel logs." -ForegroundColor Red
    exit 1
}
