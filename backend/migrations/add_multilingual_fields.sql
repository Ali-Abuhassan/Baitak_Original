-- Migration script to add multilingual fields to existing tables
-- Run this script to add support for English and Arabic translations

-- Add multilingual fields to categories table
ALTER TABLE categories 
ADD COLUMN name_en VARCHAR(100) AFTER name,
ADD COLUMN name_ar VARCHAR(100) AFTER name_en,
ADD COLUMN description_en TEXT AFTER description,
ADD COLUMN description_ar TEXT AFTER description_en;

-- Add multilingual fields to services table
ALTER TABLE services 
ADD COLUMN name_en VARCHAR(200) AFTER name,
ADD COLUMN name_ar VARCHAR(200) AFTER name_en,
ADD COLUMN description_en TEXT AFTER description,
ADD COLUMN description_ar TEXT AFTER description_en;

-- Add multilingual fields to providers table
ALTER TABLE providers 
ADD COLUMN business_name_en VARCHAR(200) AFTER business_name,
ADD COLUMN business_name_ar VARCHAR(200) AFTER business_name_en,
ADD COLUMN bio_en TEXT AFTER bio,
ADD COLUMN bio_ar TEXT AFTER bio_en;

-- Update existing data to populate English fields (copy from existing fields)
UPDATE categories SET 
  name_en = name,
  description_en = description
WHERE name_en IS NULL;

UPDATE services SET 
  name_en = name,
  description_en = description
WHERE name_en IS NULL;

UPDATE providers SET 
  business_name_en = business_name,
  bio_en = bio
WHERE business_name_en IS NULL;

-- Add indexes for better performance
CREATE INDEX idx_categories_name_en ON categories(name_en);
CREATE INDEX idx_categories_name_ar ON categories(name_ar);
CREATE INDEX idx_services_name_en ON services(name_en);
CREATE INDEX idx_services_name_ar ON services(name_ar);
CREATE INDEX idx_providers_business_name_en ON providers(business_name_en);
CREATE INDEX idx_providers_business_name_ar ON providers(business_name_ar);

-- Add some sample Arabic translations for testing
-- Categories
UPDATE categories SET 
  name_ar = 'خدمات التنظيف',
  description_ar = 'خدمات تنظيف مهنية عالية الجودة'
WHERE slug = 'cleaning-services';

UPDATE categories SET 
  name_ar = 'خدمات الصيانة',
  description_ar = 'خدمات صيانة وإصلاح شاملة'
WHERE slug = 'maintenance-services';

UPDATE categories SET 
  name_ar = 'خدمات البستنة',
  description_ar = 'خدمات تنسيق وصيانة الحدائق'
WHERE slug = 'gardening-services';

-- Services (example)
UPDATE services SET 
  name_ar = 'تنظيف المنازل',
  description_ar = 'خدمة تنظيف شاملة للمنازل والشقق'
WHERE name LIKE '%house cleaning%' OR name LIKE '%home cleaning%';

UPDATE services SET 
  name_ar = 'تنظيف المكاتب',
  description_ar = 'خدمة تنظيف المكاتب والمساحات التجارية'
WHERE name LIKE '%office cleaning%';

-- Providers (example)
UPDATE providers SET 
  business_name_ar = 'شركة التنظيف المثالية',
  bio_ar = 'نحن متخصصون في تقديم خدمات التنظيف المهنية عالية الجودة'
WHERE business_name LIKE '%cleaning%' OR business_name LIKE '%clean%';

-- Verify the changes
SELECT 'Categories with multilingual support:' as info;
SELECT id, name, name_en, name_ar, slug FROM categories LIMIT 5;

SELECT 'Services with multilingual support:' as info;
SELECT id, name, name_en, name_ar FROM services LIMIT 5;

SELECT 'Providers with multilingual support:' as info;
SELECT id, business_name, business_name_en, business_name_ar FROM providers LIMIT 5;

-- Show table structure
DESCRIBE categories;
DESCRIBE services;
DESCRIBE providers;

