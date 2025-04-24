import React from 'react';
import { AppProviders } from './AppProviders';
import AppContent from '../modules/app/ui/App';

/**
 * Main App shell that includes providers and the app content
 */
export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}