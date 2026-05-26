Write-Host "Starting Karthificial backend..." -ForegroundColor Green

Set-Location "server/backend"

$env:DB_URL="jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:5432/postgres?user=postgres.djqbjehuyenoeckgivkn&password=Se7enMinutessevenminutes"
$env:DB_USERNAME="postgres.jbmsacps-stack"
$env:DB_PASSWORD="Se7enMinutessevenminutes"

java -jar "../../deploy-folder/app.jar"