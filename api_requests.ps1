# PowerShell script for testing the User API endpoints

# Configuration
$baseUrl = "http://localhost:4000/api/users"
$headers = @{
    "Content-Type" = "application/json"
}

# Function to make the request and format the response
function Invoke-ApiRequest {
    param (
        [string]$Method,
        [string]$Url,
        [string]$Body
    )
    Write-Host "`n=== $Method Request to $Url ===" -ForegroundColor Green
    
    if ($Body) {
        Write-Host "Request Body:" -ForegroundColor Yellow
        Write-Host $Body
    }
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Method $Method -Uri $Url -Body $Body -Headers $headers
        } else {
            $response = Invoke-RestMethod -Method $Method -Uri $Url -Headers $headers
        }
        Write-Host "Response:" -ForegroundColor Yellow
        $response | ConvertTo-Json -Depth 10
    }
    catch {
        Write-Host "Error:" -ForegroundColor Red
        Write-Host $_.Exception.Message
    }
    Write-Host "====================`n" -ForegroundColor Green
}

# 1. Get All Users (default pagination)
Write-Host "1. Getting all users..." -ForegroundColor Cyan
Invoke-ApiRequest -Method "GET" -Url $baseUrl

# 2. Get Users with Filters
Write-Host "2. Getting filtered users..." -ForegroundColor Cyan
$queryParams = "page=1&limit=10&search=john&role=ADMIN&isActive=true"
Invoke-ApiRequest -Method "GET" -Url "$baseUrl`?$queryParams"

# 3. Create New User
Write-Host "3. Creating new user..." -ForegroundColor Cyan
$newUser = @{
    name = "John Doe"
    email = "john@example.com"
    phone = "+1234567890"
    address = "123 Main St"
    role = "USER"
    isActive = $true
} | ConvertTo-Json

Invoke-ApiRequest -Method "POST" -Url $baseUrl -Body $newUser

# 4. Update User
Write-Host "4. Updating user..." -ForegroundColor Cyan
$userId = 1 # Replace with actual user ID
$updateUser = @{
    name = "Updated Name"
    email = "updated@example.com"
    phone = "+1987654321"
    address = "456 New St"
    role = "ADMIN"
    isActive = $true
} | ConvertTo-Json

Invoke-ApiRequest -Method "PUT" -Url "$baseUrl/$userId" -Body $updateUser

# 5. Delete User
Write-Host "5. Deleting user..." -ForegroundColor Cyan
$userId = 1 # Replace with actual user ID
Invoke-ApiRequest -Method "DELETE" -Url "$baseUrl/$userId"

Write-Host "All API tests completed!" -ForegroundColor Green 