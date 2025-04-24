/**
 * Internal app state management
 */
import { useState, useCallback } from 'react';
import { eventBus } from '@/modules/core/events';
import { events } from '@/modules/layout/events';
import { validateAppState } from '@/modules/layout/validators';

export const useAppState = () => {
  const [appState, setAppState] = useState({
    initialized: false,
    currentPage: 'customers'
  });

  const initializeApp = useCallback(() => {
    try {
      // Initialize app logic would go here
      const newState = { 
        initialized: true,
        currentPage: 'customers'
      };
      
      // Validate state before setting
      const validatedState = validateAppState(newState, {
        actionName: 'initializeApp',
        location: 'layout/internal/state.js',
        direction: 'internal',
        moduleFrom: 'layout',
        moduleTo: 'layout'
      });
      
      // Update state
      setAppState(validatedState);
      
      // Publish event
      eventBus.publish(events.APP_INITIALIZED, validatedState);
      
      return validatedState;
    } catch (error) {
      // Handle errors
      console.error('Failed to initialize app:', error);
      eventBus.publish(events.APP_ERROR, { error });
      throw error;
    }
  }, []);
  
  const setCurrentPage = useCallback((page) => {
    setAppState(prev => {
      const newState = {
        ...prev,
        currentPage: page
      };
      
      // Publish navigation event
      eventBus.publish(events.NAVIGATION_CHANGED, { page });
      
      return newState;
    });
  }, []);

  return {
    appState,
    initializeApp,
    setCurrentPage
  };
};