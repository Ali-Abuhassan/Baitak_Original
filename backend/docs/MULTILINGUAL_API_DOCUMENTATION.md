# Multilingual API Documentation

## Overview

The Baitak API now supports two languages: English (en) and Arabic (ar). The system automatically detects the language from the request headers and returns localized responses accordingly.

## Language Detection

The API detects the language from the `lang` header in the request:

```http
GET /api/categories
lang: ar
```

Supported language codes:

- `en` - English (default)
- `ar` - Arabic

## Response Format

All API responses now include localized messages and data:

### English Response

```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Cleaning Services",
        "description": "Professional cleaning services",
        "slug": "cleaning-services"
      }
    ]
  }
}
```

### Arabic Response

```json
{
  "success": true,
  "message": "تم استرجاع الفئات بنجاح",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "خدمات التنظيف",
        "description": "خدمات تنظيف مهنية",
        "slug": "cleaning-services"
      }
    ]
  }
}
```

## Database Schema Updates

The following models have been updated to support multilingual fields:

### Category Model

- `name_en` - English name
- `name_ar` - Arabic name
- `description_en` - English description
- `description_ar` - Arabic description

### Service Model

- `name_en` - English name
- `name_ar` - Arabic name
- `description_en` - English description
- `description_ar` - Arabic description

### Provider Model

- `business_name_en` - English business name
- `business_name_ar` - Arabic business name
- `bio_en` - English bio
- `bio_ar` - Arabic bio

### City and Area Models

Already had multilingual support:

- `name_en` - English name
- `name_ar` - Arabic name

## API Usage Examples

### 1. Get Categories (English)

```bash
curl -X GET "http://localhost:3000/api/categories" \
  -H "lang: en"
```

### 2. Get Categories (Arabic)

```bash
curl -X GET "http://localhost:3000/api/categories" \
  -H "lang: ar"
```

### 3. Create User (English)

```bash
curl -X POST "http://localhost:3000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -H "lang: en" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+1234567890",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 4. Create User (Arabic)

```bash
curl -X POST "http://localhost:3000/api/auth/signup" \
  -H "Content-Type: application/json" \
  -H "lang: ar" \
  -d '{
    "first_name": "أحمد",
    "last_name": "محمد",
    "phone": "+1234567890",
    "email": "ahmed@example.com",
    "password": "password123"
  }'
```

## Error Messages

All error messages are now localized:

### English Error

```json
{
  "success": false,
  "message": "User not found",
  "error": "User with ID 123 does not exist"
}
```

### Arabic Error

```json
{
  "success": false,
  "message": "المستخدم غير موجود",
  "error": "User with ID 123 does not exist"
}
```

## Translation Keys

The system uses translation keys for all messages. Here are some common ones:

### Authentication

- `login_successful` - Login successful
- `account_created` - Account created successfully
- `invalid_credentials` - Invalid credentials
- `user_not_found` - User not found
- `user_already_exists` - User already exists

### Bookings

- `booking_created` - Booking created successfully
- `booking_updated` - Booking updated successfully
- `booking_not_found` - Booking not found
- `booking_status_updated` - Booking status updated

### Services

- `service_created` - Service created successfully
- `service_not_found` - Service not found
- `service_unauthorized` - Unauthorized to access service

### Providers

- `provider_created` - Provider created successfully
- `provider_not_found` - Provider not found
- `provider_approved` - Provider approved

## Adding New Translations

To add new translations, update the `services/translationService.js` file:

```javascript
const translations = {
  en: {
    // ... existing translations
    new_message: "New message in English",
  },
  ar: {
    // ... existing translations
    new_message: "رسالة جديدة بالعربية",
  },
};
```

## Database Migration

To add multilingual fields to existing data, you can run SQL commands:

```sql
-- Add multilingual fields to categories
ALTER TABLE categories ADD COLUMN name_en VARCHAR(100);
ALTER TABLE categories ADD COLUMN name_ar VARCHAR(100);
ALTER TABLE categories ADD COLUMN description_en TEXT;
ALTER TABLE categories ADD COLUMN description_ar TEXT;

-- Add multilingual fields to services
ALTER TABLE services ADD COLUMN name_en VARCHAR(200);
ALTER TABLE services ADD COLUMN name_ar VARCHAR(200);
ALTER TABLE services ADD COLUMN description_en TEXT;
ALTER TABLE services ADD COLUMN description_ar TEXT;

-- Add multilingual fields to providers
ALTER TABLE providers ADD COLUMN business_name_en VARCHAR(200);
ALTER TABLE providers ADD COLUMN business_name_ar VARCHAR(200);
ALTER TABLE providers ADD COLUMN bio_en TEXT;
ALTER TABLE providers ADD COLUMN bio_ar TEXT;
```

## Frontend Integration

### JavaScript/React Example

```javascript
// Set language in API calls
const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(endpoint, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      lang: getCurrentLanguage(), // 'en' or 'ar'
      ...options.headers,
    },
  });

  return response.json();
};

// Usage
const categories = await apiCall("/api/categories");
console.log(categories.message); // Will be in the selected language
```

### Vue.js Example

```javascript
// In your Vue component
export default {
  data() {
    return {
      language: "en", // or 'ar'
    };
  },
  methods: {
    async fetchData() {
      const response = await this.$http.get("/api/categories", {
        headers: { lang: this.language },
      });
      return response.data;
    },
  },
};
```

## RTL Support

The system automatically detects RTL (Right-to-Left) for Arabic:

```javascript
// In your frontend
const isRTL = req.isRTL; // true for Arabic, false for English

// Apply RTL styles
if (isRTL) {
  document.body.style.direction = "rtl";
  document.body.style.textAlign = "right";
} else {
  document.body.style.direction = "ltr";
  document.body.style.textAlign = "left";
}
```

## Testing

Run the test script to verify language support:

```bash
node test_language_support.js
```

This will test:

- Language middleware
- Translation service
- Localized field functions
- Response helpers
- Sample data formatting

## Best Practices

1. **Always include the lang header** in your API requests
2. **Use translation keys** instead of hardcoded messages
3. **Test both languages** during development
4. **Handle RTL layout** in your frontend
5. **Provide fallbacks** for missing translations
6. **Keep translations consistent** across the application

## Troubleshooting

### Common Issues

1. **Missing lang header**: Defaults to English
2. **Invalid language code**: Falls back to English
3. **Missing translation**: Falls back to English translation
4. **RTL not working**: Check if `req.isRTL` is being used correctly

### Debug Mode

Enable debug logging by setting the environment variable:

```bash
DEBUG=language:*
```

This will log language detection and translation processes.

## Support

For issues or questions about the multilingual system, please check:

1. This documentation
2. The test script output
3. Server logs for language-related errors
4. Translation service configuration

