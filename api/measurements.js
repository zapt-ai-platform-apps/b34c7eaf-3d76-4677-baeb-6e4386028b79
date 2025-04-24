import { measurements } from '../drizzle/schema.js';
import { getDatabase, handleApiError } from './_apiUtils.js';
import Sentry from './_sentry.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  const db = getDatabase();

  console.log(`Processing ${req.method} request to /api/measurements`);

  try {
    // GET all measurements or measurements for a specific customer
    if (req.method === 'GET') {
      const customerIdParam = new URL(req.url, 'http://localhost').searchParams.get('customerId');
      
      let query = db.select().from(measurements);
      
      if (customerIdParam) {
        const customerId = parseInt(customerIdParam);
        if (isNaN(customerId)) {
          return res.status(400).json({ error: 'Invalid customer ID' });
        }
        
        query = query.where(eq(measurements.customerId, customerId));
      }
      
      const allMeasurements = await query;
      console.log(`Retrieved ${allMeasurements.length} measurements`);
      return res.status(200).json(allMeasurements);
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
        customerId: parseInt(customerId),
        chest: parseFloat(chest),
        waist: parseFloat(waist),
        hip: parseFloat(hip)
      };
      
      if (neck) measurementData.neck = parseFloat(neck);
      if (shoulder) measurementData.shoulder = parseFloat(shoulder);
      if (armLength) measurementData.armLength = parseFloat(armLength);
      if (inseam) measurementData.inseam = parseFloat(inseam);
      if (height) measurementData.height = parseFloat(height);
      
      const newMeasurement = await db.insert(measurements)
        .values(measurementData)
        .returning();
      
      console.log('Created new measurement:', newMeasurement[0]);
      return res.status(201).json(newMeasurement[0]);
    }
    
    // Handle measurement by ID endpoints
    if (req.url.includes('/api/measurements/')) {
      const id = parseInt(req.url.split('/').pop());
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid measurement ID' });
      }
      
      // GET specific measurement
      if (req.method === 'GET') {
        const measurement = await db.select()
          .from(measurements)
          .where(eq(measurements.id, id))
          .limit(1);
          
        if (measurement.length === 0) {
          return res.status(404).json({ error: 'Measurement not found' });
        }
        
        return res.status(200).json(measurement[0]);
      }
      
      // PUT update measurement
      if (req.method === 'PUT') {
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
        
        const updatedMeasurement = await db.update(measurements)
          .set(measurementData)
          .where(eq(measurements.id, id))
          .returning();
          
        if (updatedMeasurement.length === 0) {
          return res.status(404).json({ error: 'Measurement not found' });
        }
        
        console.log('Updated measurement:', updatedMeasurement[0]);
        return res.status(200).json(updatedMeasurement[0]);
      }
      
      // DELETE measurement
      if (req.method === 'DELETE') {
        const deletedMeasurement = await db.delete(measurements)
          .where(eq(measurements.id, id))
          .returning();
          
        if (deletedMeasurement.length === 0) {
          return res.status(404).json({ error: 'Measurement not found' });
        }
        
        console.log('Deleted measurement:', deletedMeasurement[0]);
        return res.status(200).json(deletedMeasurement[0]);
      }
    }
    
    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    Sentry.captureException(error);
    return handleApiError(res, error);
  }
}