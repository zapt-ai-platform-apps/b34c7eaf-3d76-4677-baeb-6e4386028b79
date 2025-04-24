/**
 * Module initialization
 */
import { eventBus } from './core/events';
import { events as appEvents } from './app/events';

export { api as appApi } from './app/api';

export async function initializeModules() {
  // Set up event listeners
  eventBus.subscribe(appEvents.APP_INITIALIZED, (data) => {
    console.log('App initialized with state:', data);
  });
  
  eventBus.subscribe(appEvents.APP_ERROR, (data) => {
    console.error('App error:', data.error);
  });
  
  console.log('Modules initialized');
}