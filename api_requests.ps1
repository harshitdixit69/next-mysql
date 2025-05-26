# PowerShell script for testing the User API endpoints

# Configuration
$baseUrl = "http://localhost:4000/api"
$authToken = $null

# Headers function that includes the auth token when available
function Get-RequestHeaders {
    $headers = @{
        "Content-Type" = "application/json"
    }
    if ($authToken) {
        $headers["Authorization"] = "Bearer $authToken"
    }
    return $headers
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
        $headers = Get-RequestHeaders
        if ($Body) {
            $response = Invoke-RestMethod -Method $Method -Uri $Url -Body $Body -Headers $headers
        } else {
            $response = Invoke-RestMethod -Method $Method -Uri $Url -Headers $headers
        }
        Write-Host "Response:" -ForegroundColor Yellow
        $response | ConvertTo-Json -Depth 10
        return $response
    }
    catch {
        Write-Host "Error:" -ForegroundColor Red
        Write-Host $_.Exception.Message
        return $null
    }
    Write-Host "====================`n" -ForegroundColor Green
}

# 1. Register a new user
Write-Host "1. Registering new user..." -ForegroundColor Cyan
$newUser = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$registerResponse = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/auth/register" -Body $newUser

# Store the token if registration was successful
if ($registerResponse -and $registerResponse.token) {
    $authToken = $registerResponse.token
    Write-Host "Registration successful! Token stored." -ForegroundColor Green
}

# 2. Login
Write-Host "2. Logging in..." -ForegroundColor Cyan
$loginData = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-ApiRequest -Method "POST" -Url "$baseUrl/auth/login" -Body $loginData

# Update token if login was successful
if ($loginResponse -and $loginResponse.token) {
    $authToken = $loginResponse.token
    Write-Host "Login successful! Token updated." -ForegroundColor Green
}

# 3. Get All Users (with authentication)
Write-Host "3. Getting all users..." -ForegroundColor Cyan
Invoke-ApiRequest -Method "GET" -Url "$baseUrl/users"

# 4. Get Users with Filters
Write-Host "4. Getting filtered users..." -ForegroundColor Cyan
$queryParams = "page=1&limit=10&search=john&role=USER&isActive=true"
Invoke-ApiRequest -Method "GET" -Url "$baseUrl/users?$queryParams"

# 5. Create New User (requires authentication)
Write-Host "5. Creating new user..." -ForegroundColor Cyan
$newUserData = @{
    name = "Jane Smith"
    email = "jane@example.com"
    phone = "+1234567890"
    address = "456 Oak St"
    role = "USER"
    isActive = $true
} | ConvertTo-Json

Invoke-ApiRequest -Method "POST" -Url "$baseUrl/users" -Body $newUserData

# 6. Update User
Write-Host "6. Updating user..." -ForegroundColor Cyan
$userId = 1 # Replace with actual user ID
$updateData = @{
    name = "Jane Smith Updated"
    email = "jane.updated@example.com"
} | ConvertTo-Json

Invoke-ApiRequest -Method "PUT" -Url "$baseUrl/users/$userId" -Body $updateData

# 7. Delete User
Write-Host "7. Deleting user..." -ForegroundColor Cyan
$userIdToDelete = 2 # Replace with actual user ID
Invoke-ApiRequest -Method "DELETE" -Url "$baseUrl/users/$userIdToDelete"

Write-Host "All API tests completed!" -ForegroundColor Green 