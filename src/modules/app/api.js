/**
 * Public API for the app module
 */
import { validateAppState } from './validators';
import { useAppState } from './internal/state';

export const api = {
  useAppState: () => {
    const { appState, initializeApp } = useAppState();
    
    // Validate state when exposing it outside the module
    const validatedState = validateAppState(appState, {
      actionName: 'useAppState',
      location: 'app/api.js',
      direction: 'outgoing',
      moduleFrom: 'app',
      moduleTo: 'client'
    });
    
    return {
      appState: validatedState,
      initializeApp
    };
  }
};