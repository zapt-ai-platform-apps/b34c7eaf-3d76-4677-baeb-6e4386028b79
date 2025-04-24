import { validateCustomer, validateMeasurement } from './validators';

/**
 * Customers API module
 */
export const api = {
  /**
   * Create a new customer
   * @param {Object} customerData - Customer data (name, email, phone)
   * @returns {Promise<Object>} Created customer
   */
  async createCustomer(customerData) {
    try {
      // Validate customer data
      const validatedData = validateCustomer(customerData, {
        actionName: 'createCustomer',
        location: 'customers/api.js',
        direction: 'outgoing',
        moduleFrom: 'customers',
        moduleTo: 'api'
      });
      
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create customer');
      }
      
      const customer = await response.json();
      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  },
  
  /**
   * Get all customers
   * @returns {Promise<Array>} List of customers
   */
  async getCustomers() {
    try {
      const response = await fetch('/api/customers');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch customers');
      }
      
      const customers = await response.json();
      return customers;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },
  
  /**
   * Get a specific customer
   * @param {number} id - Customer ID
   * @returns {Promise<Object>} Customer data
   */
  async getCustomer(id) {
    try {
      const response = await fetch(`/api/customers/${id}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch customer');
      }
      
      const customer = await response.json();
      return customer;
    } catch (error) {
      console.error(`Error fetching customer ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Save measurements for a customer
   * @param {Object} measurementData - Measurement data
   * @returns {Promise<Object>} Saved measurement data
   */
  async saveMeasurements(measurementData) {
    try {
      // Validate measurement data
      const validatedData = validateMeasurement(measurementData, {
        actionName: 'saveMeasurements',
        location: 'customers/api.js',
        direction: 'outgoing',
        moduleFrom: 'customers',
        moduleTo: 'api'
      });
      
      const response = await fetch('/api/measurements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save measurements');
      }
      
      const measurements = await response.json();
      return measurements;
    } catch (error) {
      console.error('Error saving measurements:', error);
      throw error;
    }
  },
  
  /**
   * Get measurements for a customer
   * @param {number} customerId - Customer ID
   * @returns {Promise<Array>} List of measurements
   */
  async getCustomerMeasurements(customerId) {
    try {
      const response = await fetch(`/api/measurements?customerId=${customerId}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch measurements');
      }
      
      const measurements = await response.json();
      return measurements;
    } catch (error) {
      console.error(`Error fetching measurements for customer ${customerId}:`, error);
      throw error;
    }
  }
};