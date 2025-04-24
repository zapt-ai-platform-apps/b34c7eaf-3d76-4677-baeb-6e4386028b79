/**
 * Core API utility functions for the application
 */

/**
 * Initialize the database by running migrations
 * @returns {Promise<Object>} The response from the API
 */
export async function initializeDatabase() {
  try {
    const response = await fetch('/api/_init_db', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to initialize database');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}