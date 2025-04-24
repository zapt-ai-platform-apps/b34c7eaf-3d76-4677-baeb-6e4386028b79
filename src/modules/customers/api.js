/**
 * Customer API functions
 */

/**
 * Get all customers
 * @returns {Promise<Array>} List of customers
 */
export async function getCustomers() {
  try {
    const response = await fetch('/api/customers');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch customers');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
}

/**
 * Get a specific customer by ID
 * @param {string} id Customer ID
 * @returns {Promise<Object>} Customer data
 */
export async function getCustomer(id) {
  try {
    const response = await fetch(`/api/customers/${id}`);
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch customer');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching customer ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new customer
 * @param {Object} customerData Customer data
 * @returns {Promise<Object>} Created customer
 */
export async function createCustomer(customerData) {
  try {
    const response = await fetch('/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create customer');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

/**
 * Update an existing customer
 * @param {string} id Customer ID
 * @param {Object} customerData Updated customer data
 * @returns {Promise<Object>} Updated customer
 */
export async function updateCustomer(id, customerData) {
  try {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(customerData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update customer');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating customer ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a customer
 * @param {string} id Customer ID
 * @returns {Promise<Object>} Deleted customer
 */
export async function deleteCustomer(id) {
  try {
    const response = await fetch(`/api/customers/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete customer');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error deleting customer ${id}:`, error);
    throw error;
  }
}