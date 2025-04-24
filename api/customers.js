import { connectToDatabase, handleApiError, parseObjectId, formatDocument, formatDocuments } from './_apiUtils.js';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`Processing ${req.method} request to /api/customers`);

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('customers');

    // GET customers
    if (req.method === 'GET') {
      const customerId = req.url.includes('/api/customers/') ? 
        req.url.split('/').pop() : null;

      if (customerId && customerId !== 'customers') {
        // GET specific customer
        try {
          const customer = await collection.findOne({
            _id: parseObjectId(customerId)
          });

          if (!customer) {
            return res.status(404).json({ error: 'Customer not found' });
          }

          return res.status(200).json(formatDocument(customer));
        } catch (error) {
          if (error.message.includes('Invalid ID format')) {
            return res.status(400).json({ error: 'Invalid customer ID format' });
          }
          throw error;
        }
      } else {
        // GET all customers
        const allCustomers = await collection.find({}).toArray();
        console.log(`Retrieved ${allCustomers.length} customers`);
        return res.status(200).json(formatDocuments(allCustomers));
      }
    }
    
    // POST new customer
    if (req.method === 'POST') {
      const { name, email, phone } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }
      
      // Check if customer with this email already exists
      const existingCustomer = await collection.findOne({ email });
      
      if (existingCustomer) {
        return res.status(409).json({ error: 'Customer with this email already exists' });
      }
      
      const result = await collection.insertOne({
        name,
        email,
        phone,
        createdAt: new Date()
      });
      
      const newCustomer = await collection.findOne({ _id: result.insertedId });
      console.log('Created new customer:', newCustomer);
      
      return res.status(201).json(formatDocument(newCustomer));
    }
    
    // PUT update customer
    if (req.method === 'PUT' && req.url.includes('/api/customers/')) {
      const customerId = req.url.split('/').pop();
      const { name, email, phone } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }
      
      try {
        const result = await collection.findOneAndUpdate(
          { _id: parseObjectId(customerId) },
          { $set: { name, email, phone, updatedAt: new Date() } },
          { returnDocument: 'after' }
        );
          
        if (!result) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        
        console.log('Updated customer:', result);
        return res.status(200).json(formatDocument(result));
      } catch (error) {
        if (error.message.includes('Invalid ID format')) {
          return res.status(400).json({ error: 'Invalid customer ID format' });
        }
        throw error;
      }
    }
    
    // DELETE customer
    if (req.method === 'DELETE' && req.url.includes('/api/customers/')) {
      const customerId = req.url.split('/').pop();
      
      try {
        const customer = await collection.findOne({
          _id: parseObjectId(customerId)
        });
        
        if (!customer) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        
        await collection.deleteOne({ _id: parseObjectId(customerId) });
        
        console.log('Deleted customer:', customer);
        return res.status(200).json(formatDocument(customer));
      } catch (error) {
        if (error.message.includes('Invalid ID format')) {
          return res.status(400).json({ error: 'Invalid customer ID format' });
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