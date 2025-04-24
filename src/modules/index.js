import * as Sentry from '@sentry/browser';
import { initializeDatabase } from './core/api';

export async function initializeModules() {
  try {
    console.log('Initializing application modules...');
    
    // Initialize the database
    await initializeDatabase();
    
    console.log('All modules initialized successfully');
  } catch (error) {
    console.error('Failed to initialize modules:', error);
    Sentry.captureException(error);
    throw error;
  }
}