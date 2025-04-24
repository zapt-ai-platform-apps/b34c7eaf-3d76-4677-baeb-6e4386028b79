import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export function getDatabase() {
  const client = postgres(process.env.COCKROACH_DB_URL);
  return drizzle(client);
}

export function handleApiError(res, error) {
  console.error('API Error:', error);
  return res.status(500).json({ 
    error: 'Internal Server Error',
    message: error.message 
  });
}