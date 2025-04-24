import { connectToDatabase, handleApiError, formatDocument, formatDocuments, collection } from './_apiUtils.js';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`Processing ${req.method} request to /api/measurements`);

  try {
    await connectToDatabase();
    const measurements = collection('measurements');

    // GET all measurements or measurements for a specific customer
    if (req.method === 'GET') {
      const url = new URL(req.url, 'http://localhost');
      const measurementId = req.url.includes('/api/measurements/') ? 
        req.url.split('/').pop() : null;
      const customerIdParam = url.searchParams.get('customerId');
      
      if (measurementId && measurementId !== 'measurements') {
        // GET specific measurement
        try {
          const measurement = await measurements.findOne({
            _id: measurementId
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
          query.customerId = customerIdParam;
        }
        
        const allMeasurements = await measurements.find(query);
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (neck) measurementData.neck = parseFloat(neck);
      if (shoulder) measurementData.shoulder = parseFloat(shoulder);
      if (armLength) measurementData.armLength = parseFloat(armLength);
      if (inseam) measurementData.inseam = parseFloat(inseam);
      if (height) measurementData.height = parseFloat(height);
      
      const result = await measurements.insertOne(measurementData);
      const newMeasurement = await measurements.findOne({ _id: result.insertedId });
      
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
        updatedAt: new Date().toISOString()
      };
      
      if (neck) measurementData.neck = parseFloat(neck);
      if (shoulder) measurementData.shoulder = parseFloat(shoulder);
      if (armLength) measurementData.armLength = parseFloat(armLength);
      if (inseam) measurementData.inseam = parseFloat(inseam);
      if (height) measurementData.height = parseFloat(height);
      
      try {
        const updatedMeasurement = await measurements.findOneAndUpdate(
          { _id: measurementId },
          { $set: measurementData }
        );
          
        if (!updatedMeasurement) {
          return res.status(404).json({ error: 'Measurement not found' });
        }
        
        console.log('Updated measurement:', updatedMeasurement);
        return res.status(200).json(formatDocument(updatedMeasurement));
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
        const measurement = await measurements.findOne({
          _id: measurementId
        });
        
        if (!measurement) {
          return res.status(404).json({ error: 'Measurement not found' });
        }
        
        await measurements.deleteOne({ _id: measurementId });
        
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