import { initializeLayout } from '@/modules/layout/internal/initialize';
import { eventBus } from '@/modules/core/events';
import { events as layoutEvents } from '@/modules/layout/events';

/**
 * Initialize all application modules
 */
export async function initializeModules() {
  console.log('Initializing modules...');
  
  // Subscribe to app initialization events
  eventBus.subscribe(layoutEvents.APP_INITIALIZED, () => {
    console.log('Application initialized successfully');
  });
  
  // Initialize modules
  await initializeLayout();
  
  console.log('All modules initialized');
}