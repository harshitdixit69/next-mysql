# API Curl Commands

## Get Users (with pagination and search)
```bash
# Get all users (default page 1, limit 5)
curl "http://localhost:4000/api/users"

# With pagination and search
curl "http://localhost:4000/api/users?page=1&limit=10&search=john&role=ADMIN&isActive=true"
```

## Create User (POST)
```bash
curl -X POST http://localhost:4000/api/users \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"John Doe\", \"email\": \"john@example.com\", \"phone\": \"+1234567890\", \"address\": \"123 Main St\", \"role\": \"USER\", \"isActive\": true}"
```

## Update User (PUT)
```bash
# Replace {id} with the actual user ID
curl -X PUT http://localhost:4000/api/users/{id} \
  -H "Content-Type: application/json" \
  -d "{\"name\": \"Updated Name\", \"email\": \"updated@example.com\", \"phone\": \"+1987654321\", \"address\": \"456 New St\", \"role\": \"ADMIN\", \"isActive\": true}"
```

## Delete User (DELETE)
```bash
# Replace {id} with the actual user ID
curl -X DELETE http://localhost:4000/api/users/{id}
```

## Windows PowerShell Commands
For Windows PowerShell, use these alternative commands:

### Create User
```powershell
curl -X POST http://localhost:4000/api/users -H "Content-Type: application/json" -d "{`"name`": `"John Doe`", `"email`": `"john@example.com`", `"phone`": `"+1234567890`", `"address`": `"123 Main St`", `"role`": `"USER`", `"isActive`": true}"
```

### Update User
```powershell
curl -X PUT http://localhost:4000/api/users/1 -H "Content-Type: application/json" -d "{`"name`": `"Updated Name`", `"email`": `"updated@example.com`", `"phone`": `"+1987654321`", `"address`": `"456 New St`", `"role`": `"ADMIN`", `"isActive`": true}"
``` 