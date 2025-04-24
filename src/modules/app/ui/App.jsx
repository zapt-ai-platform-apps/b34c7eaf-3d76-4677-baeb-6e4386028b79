import React, { useEffect } from 'react';
import { useAppState } from '../internal/state';

/**
 * Main App UI component
 */
function App() {
  const { appState, initializeApp } = useAppState();
  
  useEffect(() => {
    if (!appState.initialized) {
      initializeApp();
    }
  }, [appState.initialized, initializeApp]);
  
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-4">
      <header className="bg-white shadow rounded p-4 mb-4">
        <h1 className="text-xl font-bold text-gray-800">App Template</h1>
      </header>
      <main className="bg-white shadow rounded p-4">
        <p className="text-gray-700">
          This is a ReactJS starter template using a contract-based modular architecture.
        </p>
        <p className="text-gray-700 mt-2">
          App initialized: {appState.initialized ? 'Yes' : 'No'}
        </p>
      </main>
      <footer className="mt-4 text-center text-gray-500 text-sm">
        <a 
          href="https://www.zapt.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700"
        >
          Made on ZAPT
        </a>
      </footer>
    </div>
  );
}

export default App;