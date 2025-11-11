-- Add category_id to providers table
ALTER TABLE providers ADD COLUMN category_id INT NULL;

-- Add foreign key constraint
ALTER TABLE providers 
ADD CONSTRAINT providers_category_fk 
FOREIGN KEY (category_id) REFERENCES categories(id) 
ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add index for better query performance
CREATE INDEX idx_providers_category_id ON providers(category_id);

