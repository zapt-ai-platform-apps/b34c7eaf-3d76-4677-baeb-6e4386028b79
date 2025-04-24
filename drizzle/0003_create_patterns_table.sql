CREATE TABLE IF NOT EXISTS "patterns" (
  "id" SERIAL PRIMARY KEY,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "type" TEXT NOT NULL,
  "created_at" TIMESTAMP DEFAULT NOW()
);

-- Insert some default patterns
INSERT INTO "patterns" ("name", "description", "type") VALUES
('Basic T-Shirt', 'Simple short-sleeve t-shirt pattern', 'top'),
('A-Line Skirt', 'Classic A-line skirt pattern', 'bottom'),
('Basic Pants', 'Simple pants with elastic waistband', 'bottom'),
('Button-Up Shirt', 'Classic button-up shirt with collar', 'top')
ON CONFLICT DO NOTHING;