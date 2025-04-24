import * as Sentry from '@sentry/browser';
import { z } from 'zod';

/**
 * Creates a validator function for the given schema
 * @param {z.ZodType} schema - Zod schema to validate against
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
      // Use zod schema for validation
      if (schema) {
        return schema.parse(data);
      }
      
      // If no schema provided, ensure data is not null/undefined
      if (data === null || data === undefined) {
        throw new Error(`${contextName} cannot be null or undefined`);
      }
      
      return data;
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
      
      // Safe version of data for logging
      const safeData = typeof data === 'object' ? 
        JSON.stringify(data, (key, value) => 
          ['password', 'token', 'secret'].includes(key) ? '[REDACTED]' : value
        ) : String(data);
      
      // Format validation errors for zod
      const formattedErrors = error.errors?.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n') || error.message;
      
      // Create descriptive error message with full context
      const errorMessage = `Validation failed in ${validationContext.action} (${validationContext.flow})\n` +
                          `Context: ${contextName} (${direction})\n` +
                          `Location: ${location}\n` +
                          `Errors:\n${formattedErrors}`;
      
      // Log to console with detailed info
      console.error(errorMessage, '\nReceived:', safeData);
      
      // Send to Sentry with full context
      Sentry.captureException(error, {
        extra: {
          ...validationContext,
          receivedData: safeData,
          validationErrors: formattedErrors
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