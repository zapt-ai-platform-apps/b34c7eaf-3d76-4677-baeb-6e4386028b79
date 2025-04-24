import * as Sentry from '@sentry/browser';

/**
 * Creates a validator function for the given schema
 * @param {Object} schema - Schema to validate against
 * @param {string} contextName - Name of what's being validated
 * @returns {function} - Validator function
 */
export const createValidator = (schema, contextName) => {
  return (data, options = {}) => {
    const {
      actionName = 'unknown',
      location = 'unknown',
      direction = 'unknown',
      moduleFrom = 'unknown',
      moduleTo = 'unknown'
    } = options;
    
    try {
      // Simple validation for now since we don't have zod
      if (!data) {
        throw new Error(`${contextName} cannot be null or undefined`);
      }
      
      // In a real app, we would use zod or another validation library
      // This is just a simple placeholder
      const validatedData = schema ? { ...data } : data;
      
      return validatedData;
    } catch (error) {
      // Create context for error reporting
      const validationContext = {
        type: contextName,
        action: actionName,
        location,
        direction,
        flow: `${moduleFrom} → ${moduleTo}`,
        timestamp: new Date().toISOString()
      };
      
      // Log to console
      console.error(`Validation failed: ${error.message}`, validationContext);
      
      // Send to Sentry
      Sentry.captureException(error, {
        extra: {
          ...validationContext,
          receivedData: JSON.stringify(data)
        },
        tags: {
          validationType: contextName,
          validationAction: actionName,
          validationDirection: direction,
          moduleFlow: `${moduleFrom}-to-${moduleTo}`
        }
      });
      
      throw error;
    }
  };
};