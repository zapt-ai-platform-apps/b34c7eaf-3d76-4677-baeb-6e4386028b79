import { patternGenerations, patterns, measurements, customers } from '../drizzle/schema.js';
import { getDatabase, handleApiError } from './_apiUtils.js';
import Sentry from './_sentry.js';
import { eq, and } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const db = getDatabase();
  
  console.log('Processing pattern generation request');
  
  try {
    const { patternId, customerId, measurementsId } = req.body;
    
    if (!patternId || !customerId || !measurementsId) {
      return res.status(400).json({ 
        error: 'Pattern ID, customer ID, and measurements ID are required' 
      });
    }
    
    // Verify that pattern exists
    const pattern = await db.select()
      .from(patterns)
      .where(eq(patterns.id, patternId))
      .limit(1);
      
    if (pattern.length === 0) {
      return res.status(404).json({ error: 'Pattern not found' });
    }
    
    // Verify that customer exists
    const customer = await db.select()
      .from(customers)
      .where(eq(customers.id, customerId))
      .limit(1);
      
    if (customer.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Verify that measurements exist and belong to the customer
    const measurement = await db.select()
      .from(measurements)
      .where(
        and(
          eq(measurements.id, measurementsId),
          eq(measurements.customerId, customerId)
        )
      )
      .limit(1);
      
    if (measurement.length === 0) {
      return res.status(404).json({ 
        error: 'Measurements not found or do not belong to this customer' 
      });
    }
    
    // Create a record of the pattern generation
    // In a real app, we would generate the PDF here and store its URL
    const pdfUrl = `/api/downloadPattern?generationId=${Date.now()}`; // Placeholder URL
    
    const generation = await db.insert(patternGenerations)
      .values({
        patternId: parseInt(patternId),
        customerId: parseInt(customerId),
        measurementsId: parseInt(measurementsId),
        pdfUrl
      })
      .returning();
    
    console.log('Pattern generation created:', generation[0]);
    
    return res.status(201).json({
      ...generation[0],
      pattern: pattern[0],
      customer: customer[0],
      measurements: measurement[0]
    });
  } catch (error) {
    Sentry.captureException(error);
    return handleApiError(res, error);
  }
}