# Script pentru Creare Backup Logic (SQL)
# Ruleaza acest script in PowerShell

# Gaseste PostgreSQL bin folder (verifica versiunile 18, 17, 16, 15)
$pgVersions = @("18", "17", "16", "15", "14")
$pgPath = $null

foreach ($version in $pgVersions) {
    $testPath = "C:\Program Files\PostgreSQL\$version"
    if (Test-Path "$testPath\bin\pg_dump.exe") {
        $pgPath = $testPath
        Write-Host "PostgreSQL $version gasit: $pgPath" -ForegroundColor Green
        break
    }
}

if (-not $pgPath) {
    $pgPath = Get-ChildItem -Path "C:\Program Files\PostgreSQL" -Directory | 
              Where-Object { Test-Path "$($_.FullName)\bin\pg_dump.exe" } |
              Select-Object -First 1 -ExpandProperty FullName
}

if ($pgPath) {
    $pgBin = "$pgPath\bin"
    Write-Host "PostgreSQL gasit: $pgBin" -ForegroundColor Green
    
    # Adauga la PATH
    $env:Path += ";$pgBin"
    
    # Creare backup logic
    $backupFile = "$PSScriptRoot\backup_logic.sql"
    Write-Host "Creare backup logic in: $backupFile" -ForegroundColor Yellow
    
    # Detect database name from environment or use default
    $dbName = "postgres"
    if (Test-Path "$PSScriptRoot\..\..\..\.env") {
        $envContent = Get-Content "$PSScriptRoot\..\..\..\.env" -Raw
        if ($envContent -match 'DATABASE_URL="?postgresql://[^:]+:[^@]+@[^/]+/([^"\s]+)"?') {
            $dbName = $matches[1]
            Write-Host "Database detectata din .env: $dbName" -ForegroundColor Cyan
        }
    }
    
    # Set password environment variable
    $env:PGPASSWORD = "postgres"
    
    & "$pgBin\pg_dump.exe" -U postgres -h localhost -p 5432 --inserts --column-inserts -f $backupFile $dbName
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Backup logic creat cu succes!" -ForegroundColor Green
        $size = (Get-Item $backupFile).Length / 1MB
        $lines = (Get-Content $backupFile).Count
        Write-Host "  Marime: $([math]::Round($size, 2)) MB" -ForegroundColor Cyan
        Write-Host "  Linii: $lines" -ForegroundColor Cyan
    } else {
        Write-Host "Eroare la crearea backup-ului logic" -ForegroundColor Red
    }
} else {
    Write-Host "PostgreSQL nu a fost gasit in C:\Program Files\PostgreSQL" -ForegroundColor Red
    Write-Host "Cauta manual pg_dump.exe si ruleaza:" -ForegroundColor Yellow
    Write-Host '  & "C:\Path\To\PostgreSQL\bin\pg_dump.exe" -U postgres --inserts --column-inserts -f "backup_logic.sql" datainsight_dashboard'
}

Read-Host "Apasa Enter pentru a inchide"
