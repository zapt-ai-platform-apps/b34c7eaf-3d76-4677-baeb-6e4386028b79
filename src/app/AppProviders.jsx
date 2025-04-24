import React from 'react';

/**
 * Application providers composition
 * In a real app, this would include providers for auth, theme, etc.
 */
export function AppProviders({ children }) {
  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  );
}