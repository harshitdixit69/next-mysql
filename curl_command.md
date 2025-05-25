# Asset Management API cURL Commands

## Create Asset (POST)
```bash
# Create a new asset
curl -X POST http://localhost:3000/api/assets \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro 16",
    "type": "Hardware",
    "description": "Latest MacBook Pro with M2 chip",
    "status": "Available",
    "purchaseDate": "2024-03-25",
    "purchasePrice": 2499.99,
    "serialNumber": "MBP2024001",
    "location": "Office 101",
    "assignedUserId": 1
  }'
```

## Get Assets (GET)
```bash
# Get all assets (with pagination)
curl -X GET "http://localhost:3000/api/assets?page=1&limit=10"

# Get assets without pagination (default page=1, limit=10)
curl -X GET http://localhost:3000/api/assets
```

## Update Asset (PUT)
```bash
# Update an asset with ID 1
curl -X PUT "http://localhost:3000/api/assets?id=1" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "In Use",
    "location": "Office 102",
    "assignedUserId": 2
  }'
```

## Delete Asset (DELETE)
```bash
# Delete an asset with ID 1
curl -X DELETE "http://localhost:3000/api/assets?id=1"
```

## Response Examples

### Successful POST Response
```json
{
  "id": 1,
  "name": "MacBook Pro 16",
  "type": "Hardware",
  "description": "Latest MacBook Pro with M2 chip",
  "status": "Available",
  "purchaseDate": "2024-03-25",
  "purchasePrice": 2499.99,
  "serialNumber": "MBP2024001",
  "location": "Office 101",
  "assignedTo": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Successful GET Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "MacBook Pro 16",
      "type": "Hardware",
      "description": "Latest MacBook Pro with M2 chip",
      "status": "Available",
      "purchaseDate": "2024-03-25",
      "purchasePrice": 2499.99,
      "serialNumber": "MBP2024001",
      "location": "Office 101",
      "assignedTo": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "metadata": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Error Response Example
```json
{
  "error": "Asset not found"
}
```

## Common Error Codes

- 400: Bad Request (Invalid input, duplicate serial number)
- 404: Not Found (Asset doesn't exist)
- 500: Internal Server Error

## Notes

1. All requests that include a body should have the `Content-Type: application/json` header
2. The GET endpoint supports pagination with `page` and `limit` query parameters
3. For PUT requests, you only need to include the fields you want to update
4. All responses will be in JSON format
5. Dates should be in ISO format (YYYY-MM-DD)
6. Prices should be numbers with up to 2 decimal places 