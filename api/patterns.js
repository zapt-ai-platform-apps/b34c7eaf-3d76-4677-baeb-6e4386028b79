import { patterns } from '../drizzle/schema.js';
import { getDatabase, handleApiError } from './_apiUtils.js';
import Sentry from './_sentry.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  const db = getDatabase();

  console.log(`Processing ${req.method} request to /api/patterns`);

  try {
    // GET patterns
    if (req.method === 'GET') {
      const patternType = new URL(req.url, 'http://localhost').searchParams.get('type');
      
      let query = db.select().from(patterns);
      
      if (patternType) {
        query = query.where(eq(patterns.type, patternType));
      }
      
      const allPatterns = await query;
      console.log(`Retrieved ${allPatterns.length} patterns`);
      return res.status(200).json(allPatterns);
    }
    
    // Only GET method is supported for patterns since they're predefined
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    Sentry.captureException(error);
    return handleApiError(res, error);
  }
}