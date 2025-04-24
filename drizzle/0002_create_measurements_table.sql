CREATE TABLE IF NOT EXISTS "measurements" (
  "id" SERIAL PRIMARY KEY,
  "customer_id" INTEGER NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
  "chest" DECIMAL(5,1) NOT NULL,
  "waist" DECIMAL(5,1) NOT NULL,
  "hip" DECIMAL(5,1) NOT NULL,
  "neck" DECIMAL(5,1),
  "shoulder" DECIMAL(5,1),
  "arm_length" DECIMAL(5,1),
  "inseam" DECIMAL(5,1),
  "height" DECIMAL(5,1),
  "created_at" TIMESTAMP DEFAULT NOW(),
  "updated_at" TIMESTAMP DEFAULT NOW()
);