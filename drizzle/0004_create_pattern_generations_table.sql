CREATE TABLE IF NOT EXISTS "pattern_generations" (
  "id" SERIAL PRIMARY KEY,
  "customer_id" INTEGER NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
  "pattern_id" INTEGER NOT NULL REFERENCES "patterns"("id") ON DELETE CASCADE,
  "measurements_id" INTEGER NOT NULL REFERENCES "measurements"("id") ON DELETE CASCADE,
  "pdf_url" TEXT,
  "created_at" TIMESTAMP DEFAULT NOW()
);