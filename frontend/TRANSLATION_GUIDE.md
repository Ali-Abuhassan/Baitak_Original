# Translation Guide for Baitak Frontend

This guide explains how to use the internationalization (i18n) system in the Baitak frontend project.

## Overview

The project supports both English and Arabic languages with RTL (Right-to-Left) support for Arabic.

## Setup

### 1. Dependencies Installed
- `react-i18next`: React integration for i18next
- `i18next`: Core internationalization framework
- `i18next-browser-languagedetector`: Automatic language detection

### 2. Configuration Files
- `src/i18n/index.js`: Main i18n configuration
- `src/i18n/locales/en.json`: English translations
- `src/i18n/locales/ar.json`: Arabic translations

## Usage

### 1. Basic Translation in Components

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
      <button>{t('common.sign_up')}</button>
    </div>
  );
};
```

### 2. Language Switching

The language switcher is automatically included in the header. Users can switch between English and Arabic.

### 3. RTL Support

RTL support is automatically handled when Arabic is selected. The CSS includes RTL-specific styles that:
- Reverse text direction
- Adjust margins and padding
- Reverse flex layouts
- Adjust text alignment

## Translation Keys Structure

### Common Keys
```json
{
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "success": "Success",
    "cancel": "Cancel",
    "save": "Save",
    "edit": "Edit",
    "delete": "Delete",
    "confirm": "Confirm",
    "back": "Back",
    "next": "Next",
    "close": "Close",
    "search": "Search",
    "submit": "Submit",
    "continue": "Continue",
    "view": "View",
    "book": "Book",
    "book_now": "Book Now",
    "sign_up": "Sign Up",
    "sign_in": "Sign In",
    "logout": "Logout",
    "profile": "Profile",
    "settings": "Settings",
    "help": "Help",
    "contact": "Contact",
    "about": "About",
    "home": "Home",
    "services": "Services",
    "providers": "Providers",
    "bookings": "Bookings",
    "dashboard": "Dashboard"
  }
}
```

### Page-Specific Keys
- `navigation.*`: Navigation menu items
- `home.*`: Home page content
- `auth.*`: Authentication pages
- `services.*`: Services page content
- `booking.*`: Booking flow content
- `provider.*`: Provider profile content
- `dashboard.*`: Dashboard content
- `errors.*`: Error messages
- `success.*`: Success messages

## Adding New Translations

### 1. Add to English File (`src/i18n/locales/en.json`)
```json
{
  "new_section": {
    "new_key": "English text"
  }
}
```

### 2. Add to Arabic File (`src/i18n/locales/ar.json`)
```json
{
  "new_section": {
    "new_key": "النص العربي"
  }
}
```

### 3. Use in Component
```jsx
const { t } = useTranslation();
return <p>{t('new_section.new_key')}</p>;
```

## Best Practices

### 1. Key Naming Convention
- Use descriptive, hierarchical keys
- Use snake_case for keys
- Group related translations together

Examples:
- `home.title`
- `auth.login.subtitle`
- `booking.form.phone_number`

### 2. Translation Structure
- Keep translations organized by page/feature
- Use consistent terminology
- Include context when needed

### 3. RTL Considerations
- Test both languages thoroughly
- Ensure text fits in Arabic (often longer than English)
- Check icon and layout positioning
- Verify form layouts work in RTL

## Testing Translations

### 1. Language Switching
- Test switching between languages
- Verify all text updates correctly
- Check RTL layout changes

### 2. Missing Translations
- Check browser console for missing keys
- Add fallback translations
- Test with incomplete translation files

### 3. Text Length
- Ensure Arabic text fits in UI elements
- Test responsive design with both languages
- Check form validation messages

## Common Issues and Solutions

### 1. Missing Translation Keys
```jsx
// This will show the key if translation is missing
{t('missing.key', 'Fallback text')}
```

### 2. RTL Layout Issues
- Use CSS classes that work with RTL
- Test with `dir="rtl"` attribute
- Check flexbox and grid layouts

### 3. Dynamic Content
```jsx
// For dynamic content with variables
{t('welcome_message', { name: user.name })}
```

## File Structure

```
src/
├── i18n/
│   ├── index.js              # i18n configuration
│   └── locales/
│       ├── en.json           # English translations
│       └── ar.json           # Arabic translations
├── components/
│   ├── LanguageSwitcher.jsx # Language switcher component
│   └── TranslationExample.jsx # Example usage
└── pages/
    └── Home.jsx              # Example translated component
```

## Next Steps

1. **Translate All Components**: Update all components to use translation keys
2. **Add More Languages**: Extend support for additional languages
3. **Context-Aware Translations**: Add context-specific translations
4. **Pluralization**: Add support for plural forms
5. **Date/Number Formatting**: Add locale-specific formatting

## Resources

- [react-i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)
- [RTL CSS Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Writing_Modes)

