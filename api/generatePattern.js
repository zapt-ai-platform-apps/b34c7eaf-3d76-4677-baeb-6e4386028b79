import { connectToDatabase, handleApiError, parseObjectId, formatDocument } from './_apiUtils.js';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  console.log('Processing pattern generation request');
  
  try {
    const { db } = await connectToDatabase();
    const { patternId, customerId, measurementsId } = req.body;
    
    if (!patternId || !customerId || !measurementsId) {
      return res.status(400).json({ 
        error: 'Pattern ID, customer ID, and measurements ID are required' 
      });
    }
    
    // Verify that pattern exists
    const pattern = await db.collection('patterns').findOne({
      _id: parseObjectId(patternId)
    });
    
    if (!pattern) {
      return res.status(404).json({ error: 'Pattern not found' });
    }
    
    // Verify that customer exists
    const customer = await db.collection('customers').findOne({
      _id: parseObjectId(customerId)
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    // Verify that measurements exist and belong to the customer
    const measurement = await db.collection('measurements').findOne({
      _id: parseObjectId(measurementsId),
      customerId: customerId
    });
    
    if (!measurement) {
      return res.status(404).json({ 
        error: 'Measurements not found or do not belong to this customer' 
      });
    }
    
    // Create a record of the pattern generation
    // In a real app, we would generate the PDF here and store its URL
    const pdfUrl = `/api/downloadPattern?generationId=${Date.now()}`; // Placeholder URL
    
    const result = await db.collection('patternGenerations').insertOne({
      patternId,
      customerId,
      measurementsId,
      pdfUrl,
      createdAt: new Date()
    });
    
    const generation = await db.collection('patternGenerations').findOne({
      _id: result.insertedId
    });
    
    console.log('Pattern generation created:', generation);
    
    return res.status(201).json({
      ...formatDocument(generation),
      pattern: formatDocument(pattern),
      customer: formatDocument(customer),
      measurements: formatDocument(measurement)
    });
  } catch (error) {
    Sentry.captureException(error);
    return handleApiError(res, error);
  }
}