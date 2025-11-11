# Service Management APIs

## Provider Service Management Endpoints

### 🔐 **Authentication Required**

All provider endpoints require:

- Valid JWT token in Authorization header: `Bearer <token>`
- User role must be `provider`
- Provider must be approved (`status: 'approved'`)

---

## 📋 **API Endpoints**

### 1. **Create Service**

**POST** `/api/services`

Creates a new service for the authenticated provider.

#### **Request Body:**

```json
{
  "category_id": 1,
  "name": "House Cleaning Service",
  "description": "Professional house cleaning for all rooms",
  "base_price": 50.0,
  "price_type": "hourly",
  "duration_hours": 2,
  "packages": [
    {
      "name": "Standard",
      "price": 100,
      "description": "Basic cleaning service",
      "features": ["Living room", "Kitchen", "Bathroom"]
    },
    {
      "name": "Premium",
      "price": 150,
      "description": "Deep cleaning service",
      "features": ["All rooms", "Windows", "Appliances"]
    }
  ],
  "add_ons": [
    {
      "name": "Extra room",
      "price": 20,
      "description": "Clean additional room"
    },
    {
      "name": "Window cleaning",
      "price": 15,
      "description": "Clean all windows"
    }
  ],
  "images": ["service1.jpg", "service2.jpg"],
  "requirements": "Customer should provide cleaning supplies",
  "included_services": ["Vacuuming", "Mopping", "Dusting"],
  "excluded_services": ["Window cleaning", "Appliance cleaning"],
  "min_advance_booking_hours": 24,
  "max_advance_booking_days": 30
}
```

#### **Response:**

```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "service": {
      "id": 1,
      "provider_id": 1,
      "category_id": 1,
      "name": "House Cleaning Service",
      "slug": "house-cleaning-service",
      "description": "Professional house cleaning for all rooms",
      "base_price": "50.00",
      "price_type": "hourly",
      "duration_hours": "2.00",
      "packages": [...],
      "add_ons": [...],
      "images": [...],
      "requirements": "Customer should provide cleaning supplies",
      "included_services": [...],
      "excluded_services": [...],
      "min_advance_booking_hours": 24,
      "max_advance_booking_days": 30,
      "is_active": true,
      "is_featured": false,
      "view_count": 0,
      "booking_count": 0,
      "created_at": "2024-01-15T10:00:00.000Z",
      "updated_at": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

---

### 2. **Get My Services**

**GET** `/api/services/my/services`

Retrieves all services belonging to the authenticated provider.

#### **Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (`active`, `inactive`)

#### **Example:**

```
GET /api/services/my/services?page=1&limit=10&status=active
```

#### **Response:**

```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": 1,
        "provider_id": 1,
        "category_id": 1,
        "name": "House Cleaning Service",
        "slug": "house-cleaning-service",
        "description": "Professional house cleaning for all rooms",
        "base_price": "50.00",
        "price_type": "hourly",
        "duration_hours": "2.00",
        "packages": [...],
        "add_ons": [...],
        "images": [...],
        "is_active": true,
        "view_count": 15,
        "booking_count": 3,
        "created_at": "2024-01-15T10:00:00.000Z",
        "updated_at": "2024-01-15T10:00:00.000Z",
        "category": {
          "name": "Home Cleaning",
          "slug": "home-cleaning"
        }
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 1,
      "total_services": 1,
      "limit": 10
    }
  }
}
```

---

### 3. **Update Service**

**PUT** `/api/services/:id`

Updates an existing service belonging to the authenticated provider.

#### **Request Body:**

```json
{
  "name": "Premium House Cleaning Service",
  "description": "Updated description",
  "base_price": 60.0,
  "is_active": true
}
```

#### **Response:**

```json
{
  "success": true,
  "message": "Service updated successfully",
  "data": {
    "service": {
      "id": 1,
      "provider_id": 1,
      "category_id": 1,
      "name": "Premium House Cleaning Service",
      "slug": "premium-house-cleaning-service",
      "description": "Updated description",
      "base_price": "60.00",
      "is_active": true,
      "updated_at": "2024-01-15T11:00:00.000Z"
    }
  }
}
```

---

### 4. **Delete Service**

**DELETE** `/api/services/:id`

Soft deletes a service (sets `is_active` to false).

#### **Response:**

```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

---

## 🔒 **Security Features**

### **Authorization Checks:**

1. **Token Validation**: Valid JWT token required
2. **Role Verification**: User must have `provider` role
3. **Provider Status**: Provider must be approved
4. **Ownership Verification**: Can only manage own services

### **Data Validation:**

1. **Category Existence**: Validates category exists before creating service
2. **Provider Approval**: Ensures provider is approved before creating service
3. **Slug Generation**: Auto-generates URL-friendly slugs
4. **Soft Delete**: Services are deactivated, not permanently deleted

---

## 📊 **Service Model Fields**

| Field                       | Type          | Description                 |
| --------------------------- | ------------- | --------------------------- |
| `id`                        | Integer       | Primary key                 |
| `provider_id`               | Integer       | ID of the provider          |
| `category_id`               | Integer       | Service category ID         |
| `name`                      | String(200)   | Service name                |
| `slug`                      | String(200)   | URL-friendly identifier     |
| `description`               | Text          | Service description         |
| `base_price`                | Decimal(10,2) | Base price for service      |
| `price_type`                | Enum          | `hourly`, `fixed`, `custom` |
| `duration_hours`            | Decimal(4,2)  | Default duration            |
| `packages`                  | JSON          | Service packages array      |
| `add_ons`                   | JSON          | Add-on services array       |
| `images`                    | JSON          | Service images array        |
| `requirements`              | Text          | Customer requirements       |
| `included_services`         | JSON          | Included services list      |
| `excluded_services`         | JSON          | Excluded services list      |
| `min_advance_booking_hours` | Integer       | Minimum booking advance     |
| `max_advance_booking_days`  | Integer       | Maximum booking advance     |
| `is_active`                 | Boolean       | Service availability        |
| `is_featured`               | Boolean       | Featured service flag       |
| `view_count`                | Integer       | Number of views             |
| `booking_count`             | Integer       | Number of bookings          |

---

## 🚀 **Usage Examples**

### **Create a Cleaning Service:**

```bash
curl -X POST http://localhost:8000/api/services \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category_id": 1,
    "name": "Deep House Cleaning",
    "description": "Comprehensive house cleaning service",
    "base_price": 75.00,
    "price_type": "hourly",
    "duration_hours": 3
  }'
```

### **Get My Services:**

```bash
curl -X GET "http://localhost:8000/api/services/my/services?status=active" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### **Update Service:**

```bash
curl -X PUT http://localhost:8000/api/services/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "base_price": 80.00,
    "is_active": true
  }'
```

### **Delete Service:**

```bash
curl -X DELETE http://localhost:8000/api/services/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## ⚠️ **Error Responses**

### **401 Unauthorized:**

```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### **403 Forbidden:**

```json
{
  "success": false,
  "message": "Provider not found or not approved"
}
```

### **404 Not Found:**

```json
{
  "success": false,
  "message": "Service not found"
}
```

### **500 Internal Server Error:**

```json
{
  "success": false,
  "message": "Error creating service",
  "error": "Detailed error message"
}
```
