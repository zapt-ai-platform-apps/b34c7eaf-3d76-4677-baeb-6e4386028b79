import { connectToDatabase, handleApiError, parseObjectId, formatDocument, formatDocuments } from './_apiUtils.js';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`Processing ${req.method} request to /api/measurements`);

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('measurements');

    // GET all measurements or measurements for a specific customer
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      const measurementId = req.url.includes('/api/measurements/') ? 
        req.url.split('/').pop() : null;
      const customerIdParam = url.searchParams.get('customerId');
      
      if (measurementId && measurementId !== 'measurements') {
        // GET specific measurement
        try {
          const measurement = await collection.findOne({
            _id: parseObjectId(measurementId)
          });
          
          if (!measurement) {
            return res.status(404).json({ error: 'Measurement not found' });
          }
          
          return res.status(200).json(formatDocument(measurement));
        } catch (error) {
          if (error.message.includes('Invalid ID format')) {
            return res.status(400).json({ error: 'Invalid measurement ID format' });
          }
          throw error;
        }
      } else {
        // GET all measurements or filtered by customer
        let query = {};
        
        if (customerIdParam) {
          try {
            query.customerId = customerIdParam;
          } catch (error) {
            return res.status(400).json({ error: 'Invalid customer ID format' });
          }
        }
        
        const allMeasurements = await collection.find(query).toArray();
        console.log(`Retrieved ${allMeasurements.length} measurements`);
        return res.status(200).json(formatDocuments(allMeasurements));
      }
    }
    
    // POST new measurement
    if (req.method === 'POST') {
      const { 
        customerId, chest, waist, hip, neck, 
        shoulder, armLength, inseam, height 
      } = req.body;
      
      if (!customerId || !chest || !waist || !hip) {
        return res.status(400).json({ 
          error: 'Customer ID, chest, waist, and hip measurements are required' 
        });
      }
      
      // Convert all values to ensure they're saved as decimals
      const measurementData = {
        customerId,
        chest: parseFloat(chest),
        waist: parseFloat(waist),
        hip: parseFloat(hip),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      if (neck) measurementData.neck = parseFloat(neck);
      if (shoulder) measurementData.shoulder = parseFloat(shoulder);
      if (armLength) measurementData.armLength = parseFloat(armLength);
      if (inseam) measurementData.inseam = parseFloat(inseam);
      if (height) measurementData.height = parseFloat(height);
      
      const result = await collection.insertOne(measurementData);
      const newMeasurement = await collection.findOne({ _id: result.insertedId });
      
      console.log('Created new measurement:', newMeasurement);
      return res.status(201).json(formatDocument(newMeasurement));
    }
    
    // PUT update measurement
    if (req.method === 'PUT' && req.url.includes('/api/measurements/')) {
      const measurementId = req.url.split('/').pop();
      const { 
        chest, waist, hip, neck, 
        shoulder, armLength, inseam, height 
      } = req.body;
      
      if (!chest || !waist || !hip) {
        return res.status(400).json({ 
          error: 'Chest, waist, and hip measurements are required' 
        });
      }
      
      // Convert all values to ensure they're saved as decimals
      const measurementData = {
        chest: parseFloat(chest),
        waist: parseFloat(waist),
        hip: parseFloat(hip),
        updatedAt: new Date()
      };
      
      if (neck) measurementData.neck = parseFloat(neck);
      if (shoulder) measurementData.shoulder = parseFloat(shoulder);
      if (armLength) measurementData.armLength = parseFloat(armLength);
      if (inseam) measurementData.inseam = parseFloat(inseam);
      if (height) measurementData.height = parseFloat(height);
      
      try {
        const result = await collection.findOneAndUpdate(
          { _id: parseObjectId(measurementId) },
          { $set: measurementData },
          { returnDocument: 'after' }
        );
          
        if (!result) {
          return res.status(404).json({ error: 'Measurement not found' });
        }
        
        console.log('Updated measurement:', result);
        return res.status(200).json(formatDocument(result));
      } catch (error) {
        if (error.message.includes('Invalid ID format')) {
          return res.status(400).json({ error: 'Invalid measurement ID format' });
        }
        throw error;
      }
    }
    
    // DELETE measurement
    if (req.method === 'DELETE' && req.url.includes('/api/measurements/')) {
      const measurementId = req.url.split('/').pop();
      
      try {
        const measurement = await collection.findOne({
          _id: parseObjectId(measurementId)
        });
        
        if (!measurement) {
          return res.status(404).json({ error: 'Measurement not found' });
        }
        
        await collection.deleteOne({ _id: parseObjectId(measurementId) });
        
        console.log('Deleted measurement:', measurement);
        return res.status(200).json(formatDocument(measurement));
      } catch (error) {
        if (error.message.includes('Invalid ID format')) {
          return res.status(400).json({ error: 'Invalid measurement ID format' });
        }
        throw error;
      }
    }
    
    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    Sentry.captureException(error);
    return handleApiError(res, error);
  }
}