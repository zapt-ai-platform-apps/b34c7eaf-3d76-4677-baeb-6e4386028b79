import { connectToDatabase, handleApiError, formatDocuments } from './_apiUtils.js';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`Processing ${req.method} request to /api/patterns`);

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('patterns');

    // GET patterns
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      const patternType = url.searchParams.get('type');
      
      let query = {};
      if (patternType) {
        query.type = patternType;
      }
      
      const allPatterns = await collection.find(query).toArray();
      console.log(`Retrieved ${allPatterns.length} patterns`);
      
      return res.status(200).json(formatDocuments(allPatterns));
    }
    
    // Only GET method is supported for patterns since they're predefined
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    Sentry.captureException(error);
    return handleApiError(res, error);
  }
}