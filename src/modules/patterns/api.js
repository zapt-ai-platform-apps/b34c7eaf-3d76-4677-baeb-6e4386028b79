/**
 * Patterns API module
 */
export const api = {
  /**
   * Get all available patterns
   * @param {string} type - Optional pattern type filter
   * @returns {Promise<Array>} List of patterns
   */
  async getPatterns(type = null) {
    try {
      const url = type ? `/api/patterns?type=${type}` : '/api/patterns';
      const response = await fetch(url);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch patterns');
      }
      
      const patterns = await response.json();
      return patterns;
    } catch (error) {
      console.error('Error fetching patterns:', error);
      throw error;
    }
  },
  
  /**
   * Generate a pattern for a customer with their measurements
   * @param {Object} data - Generation data (patternId, customerId, measurementsId)
   * @returns {Promise<Object>} Generated pattern data
   */
  async generatePattern(data) {
    try {
      const response = await fetch('/api/generatePattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate pattern');
      }
      
      const generationData = await response.json();
      return generationData;
    } catch (error) {
      console.error('Error generating pattern:', error);
      throw error;
    }
  }
};