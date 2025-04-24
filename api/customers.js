import { customers } from '../drizzle/schema.js';
import { getDatabase, handleApiError } from './_apiUtils.js';
import Sentry from './_sentry.js';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  const db = getDatabase();

  console.log(`Processing ${req.method} request to /api/customers`);

  try {
    // GET customers
    if (req.method === 'GET') {
      const allCustomers = await db.select().from(customers);
      console.log(`Retrieved ${allCustomers.length} customers`);
      return res.status(200).json(allCustomers);
    }
    
    // POST new customer
    if (req.method === 'POST') {
      const { name, email, phone } = req.body;
      
      if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
      }
      
      // Check if customer with this email already exists
      const existingCustomer = await db.select()
        .from(customers)
        .where(eq(customers.email, email))
        .limit(1);
      
      if (existingCustomer.length > 0) {
        return res.status(409).json({ error: 'Customer with this email already exists' });
      }
      
      const newCustomer = await db.insert(customers)
        .values({ name, email, phone })
        .returning();
      
      console.log('Created new customer:', newCustomer[0]);
      return res.status(201).json(newCustomer[0]);
    }
    
    // Handle customer by ID endpoints
    if (req.url.includes('/api/customers/')) {
      const id = parseInt(req.url.split('/').pop());
      
      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid customer ID' });
      }
      
      // GET specific customer
      if (req.method === 'GET') {
        const customer = await db.select()
          .from(customers)
          .where(eq(customers.id, id))
          .limit(1);
          
        if (customer.length === 0) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        
        return res.status(200).json(customer[0]);
      }
      
      // PUT update customer
      if (req.method === 'PUT') {
        const { name, email, phone } = req.body;
        
        if (!name || !email) {
          return res.status(400).json({ error: 'Name and email are required' });
        }
        
        const updatedCustomer = await db.update(customers)
          .set({ name, email, phone })
          .where(eq(customers.id, id))
          .returning();
          
        if (updatedCustomer.length === 0) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        
        console.log('Updated customer:', updatedCustomer[0]);
        return res.status(200).json(updatedCustomer[0]);
      }
      
      // DELETE customer
      if (req.method === 'DELETE') {
        const deletedCustomer = await db.delete(customers)
          .where(eq(customers.id, id))
          .returning();
          
        if (deletedCustomer.length === 0) {
          return res.status(404).json({ error: 'Customer not found' });
        }
        
        console.log('Deleted customer:', deletedCustomer[0]);
        return res.status(200).json(deletedCustomer[0]);
      }
    }
    
    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
    
  } catch (error) {
    Sentry.captureException(error);
    return handleApiError(res, error);
  }
}