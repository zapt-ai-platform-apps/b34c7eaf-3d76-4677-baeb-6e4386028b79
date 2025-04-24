import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './Navigation';
import CustomerList from '@/modules/customers/ui/CustomerList';
import MeasurementsList from '@/modules/customers/ui/MeasurementsList';
import PatternSelector from '@/modules/patterns/ui/PatternSelector';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Pattern Generator</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create custom sewing patterns from body measurements
          </p>
          <a 
            href="https://www.zapt.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            Made on ZAPT
          </a>
        </div>
      </header>
      
      <Navigation />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/measurements" element={<MeasurementsList />} />
          <Route path="/patterns" element={<PatternSelector />} />
          <Route path="/" element={<Navigate to="/customers" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;