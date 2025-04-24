import { eventBus } from '@/modules/core/events';
import { events } from '@/modules/layout/events';

/**
 * Initialize the layout module
 */
export async function initializeLayout() {
  try {
    console.log('Initializing layout module...');
    
    // Any initialization logic for the layout module
    
    // Publish event that layout has been initialized
    eventBus.publish(events.APP_INITIALIZED, { 
      initialized: true,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('Failed to initialize layout module:', error);
    eventBus.publish(events.APP_ERROR, { error });
    throw error;
  }
}