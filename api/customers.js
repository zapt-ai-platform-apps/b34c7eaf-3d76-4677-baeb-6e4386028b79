import { connectToDatabase, handleApiError, parseObjectId, formatDocument, formatDocuments, collection } from './_apiUtils.js';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  console.log(`Processing ${req.method} request to /api/customers`);

  try {
    await connectToDatabase();
    const customers = collection('customers');

    // GET customers
    if (req.method === 'GET') {
      const customerId = req.url.includes('/api/customers/') ? 
        req.url.split('/').pop() : null;

      if (customerId && customerId !== 'customers') {
        // GET specific customer
        try {
          const customer = await customers.findOne({
            _id: customerId
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
        const allCustomers = await customers.find({});
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
      const existingCustomer = await customers.findOne({ email });
      
      if (existingCustomer) {
        return res.status(409).json({ error: 'Customer with this email already exists' });
      }
      
      const result = await customers.insertOne({
        name,
        email,
        phone,
        createdAt: new Date().toISOString()
      });
      
      const newCustomer = await customers.findOne({ _id: result.insertedId });
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
        const updatedCustomer = await customers.findOneAndUpdate(
          { _id: customerId },
          { $set: { name, email, phone, updatedAt: new Date().toISOString() } }
        );
          
        if (!updatedCustomer) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        
        console.log('Updated customer:', updatedCustomer);
        return res.status(200).json(formatDocument(updatedCustomer));
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
        const customer = await customers.findOne({
          _id: customerId
        });
        
        if (!customer) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        
        await customers.deleteOne({ _id: customerId });
        
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