# Asset Management API cURL Commands

## Create Asset (POST)
```bash
# Create a new asset with all fields
curl -X POST http://localhost:4000/api/assets \
  -F "name=Dell XPS 15 Laptop" \
  -F "type=Hardware" \
  -F "description=High-performance developer laptop" \
  -F "status=AVAILABLE" \
  -F "location=Main Office" \
  -F "department=Engineering" \
  -F "purchaseDate=2024-03-25" \
  -F "purchaseCost=1899.99" \
  -F "vendor=Dell" \
  -F "warrantyExpiration=2027-03-25" \
  -F "serialNumber=XPS15-2024-001" \
  -F "barcode=DELL-XPS15-001" \
  -F "lastMaintenance=2024-03-25" \
  -F "nextMaintenance=2024-09-25" \
  -F "notes=Assigned to senior developers" \
  -F "assignedUserId=1" \
  -F "image=@/path/to/image.jpg"

# Create minimal asset
curl -X POST http://localhost:4000/api/assets \
  -F "name=Office Chair" \
  -F "type=Furniture"
```

## Get Assets (GET)

### Basic Queries
```bash
# Get all assets (default pagination: page=1, limit=10)
curl -X GET http://localhost:4000/api/assets

# Get assets with pagination
curl -X GET "http://localhost:4000/api/assets?page=1&limit=20"

# Search assets
curl -X GET "http://localhost:4000/api/assets?search=laptop"
```

### Filtering
```bash
# Filter by status
curl -X GET "http://localhost:4000/api/assets?status=AVAILABLE"

# Filter by type
curl -X GET "http://localhost:4000/api/assets?type=Hardware"

# Filter by department
curl -X GET "http://localhost:4000/api/assets?department=Engineering"

# Combined filters
curl -X GET "http://localhost:4000/api/assets?status=IN_USE&type=Hardware&department=Engineering"
```

### Sorting
```bash
# Sort by name (ascending)
curl -X GET "http://localhost:4000/api/assets?sortBy=name&sortOrder=asc"

# Sort by purchase date (descending)
curl -X GET "http://localhost:4000/api/assets?sortBy=purchaseDate&sortOrder=desc"

# Sort by cost (highest first)
curl -X GET "http://localhost:4000/api/assets?sortBy=cost&sortOrder=desc"
```

## Update Asset (PUT)
```bash
# Update all fields
curl -X PUT "http://localhost:4000/api/assets?id=1" \
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
  -F "notes=New notes added" \
  -F "assignedUserId=2" \
  -F "image=@/path/to/new-image.jpg"

# Update specific fields
curl -X PUT "http://localhost:4000/api/assets?id=1" \
  -F "status=MAINTENANCE" \
  -F "notes=Sent for repair"
```

## Delete Asset (DELETE)
```bash
# Delete an asset
curl -X DELETE "http://localhost:4000/api/assets?id=1"
```

## Response Examples

### Successful POST/PUT Response
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
  "imageUrl": "https://example.com/images/asset1.jpg",
  "notes": "Assigned to senior developers",
  "assignedTo": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "department": "Engineering",
    "role": "USER"
  },
  "createdAt": "2024-03-25T10:30:00.000Z",
  "updatedAt": "2024-03-25T10:30:00.000Z"
}
```

### Successful GET Response
```json
{
  "data": [
    {
      "id": 1,
      "name": "Dell XPS 15 Laptop",
      "type": "Hardware",
      "status": "AVAILABLE",
      "department": "Engineering",
      "assignedTo": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "metadata": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "error": "Asset not found"
}
```

## Notes

1. All requests that include file uploads must use `multipart/form-data` (`-F` flag in cURL)
2. Dates should be in ISO format (YYYY-MM-DD)
3. Valid status values: `AVAILABLE`, `IN_USE`, `MAINTENANCE`, `CHECKED_OUT`
4. The GET endpoint supports:
   - Pagination (`page` and `limit`)
   - Search (searches in name, serial number, and barcode)
   - Filtering by status, type, and department
   - Sorting by name, purchase date, or cost
5. Image uploads should be sent as form data with the key `image`
6. All monetary values should be numbers with up to 2 decimal places
7. When updating, you only need to include the fields you want to change 