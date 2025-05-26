# Asset Management API Curl Commands

## Authentication

### Register User
```bash
curl -X POST "http://localhost:4000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "your-password"
  }'
```

### Login
```bash
curl -X POST "http://localhost:4000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "your-password"
  }'
```

## Asset Management
Note: Replace `$TOKEN` with the JWT token received from login response.

### Get All Assets
```bash
curl -X GET "http://localhost:4000/api/assets" \
  -H "Authorization: Bearer $TOKEN"
```

### Create Asset (Admin Only)
```bash
# Create a new asset with all fields
curl -X POST "http://localhost:4000/api/assets" \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Dell XPS 15" \
  -F "type=Hardware" \
  -F "status=AVAILABLE" \
  -F "description=High-performance laptop" \
  -F "location=Main Office" \
  -F "department=Engineering" \
  -F "purchaseDate=2024-03-25" \
  -F "purchaseCost=1899.99" \
  -F "vendor=Dell" \
  -F "serialNumber=XPS15-2024-001" \
  -F "barcode=DELL-XPS15-001"

# Create with minimal required fields
curl -X POST "http://localhost:4000/api/assets" \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Monitor" \
  -F "type=Hardware"
```

### Update Asset (Admin Only)
```bash
# Update all fields
curl -X PUT "http://localhost:4000/api/assets?id=1" \
  -H "Authorization: Bearer $TOKEN" \
  -F "name=Dell XPS 15 Laptop" \
  -F "type=Hardware" \
  -F "description=Updated description" \
  -F "status=IN_USE" \
  -F "location=Floor 2" \
  -F "department=Engineering" \
  -F "purchaseDate=2024-03-25" \
  -F "purchaseCost=1899.99" \
  -F "vendor=Dell" \
  -F "warrantyExpiration=2027-03-25" \
  -F "serialNumber=XPS15-2024-001" \
  -F "barcode=DELL-XPS15-001" \
  -F "lastMaintenance=2024-03-25" \
  -F "nextMaintenance=2024-09-25" \
  -F "notes=New notes added"

# Update specific fields only
curl -X PUT "http://localhost:4000/api/assets?id=1" \
  -H "Authorization: Bearer $TOKEN" \
  -F "status=MAINTENANCE" \
  -F "notes=Sent for repair"
```

### Delete Asset (Admin Only)
```bash
curl -X DELETE "http://localhost:4000/api/assets?id=1" \
  -H "Authorization: Bearer $TOKEN"
```

## Response Examples

### Authentication Response
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "USER"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Asset Response (GET/POST/PUT)
```json
{
  "id": 1,
  "name": "Dell XPS 15 Laptop",
  "type": "Hardware",
  "description": "High-performance developer laptop",
  "status": "AVAILABLE",
  "location": "Main Office",
  "department": "Engineering",
  "purchaseDate": "2024-03-25T00:00:00.000Z",
  "purchaseCost": "1899.99",
  "vendor": "Dell",
  "warrantyExpiration": "2027-03-25T00:00:00.000Z",
  "serialNumber": "XPS15-2024-001",
  "barcode": "DELL-XPS15-001",
  "lastMaintenance": "2024-03-25T00:00:00.000Z",
  "nextMaintenance": "2024-09-25T00:00:00.000Z",
  "imageUrl": null,
  "notes": "Assigned to senior developers",
  "createdAt": "2024-03-25T10:30:00.000Z",
  "updatedAt": "2024-03-25T10:30:00.000Z"
}
```

### Success Response (DELETE)
```json
{
  "message": "Asset deleted successfully"
}
```

### Error Response
```json
{
  "error": "Error message here"
}
```

## Notes
1. Server runs on port 4000
2. Use `-F` flags for form data (POST and PUT requests)
3. Date fields should be in ISO format or YYYY-MM-DD format
4. Status options: "AVAILABLE", "IN_USE", "MAINTENANCE", "RETIRED"
5. Required fields: name, type
6. Authentication is required for all asset endpoints
7. Admin role is required for POST, PUT, and DELETE operations 