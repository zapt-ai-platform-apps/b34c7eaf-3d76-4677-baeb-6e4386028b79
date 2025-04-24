import React from 'react';
import { AppProviders } from '@/app/AppProviders';
import AppContent from '@/modules/layout/ui/App';

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