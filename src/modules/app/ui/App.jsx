import React, { useEffect, useState } from 'react';
import { useAppState } from '../internal/state';
import CustomerForm from '../../customers/ui/CustomerForm';
import CustomerList from '../../customers/ui/CustomerList';
import MeasurementForm from '../../customers/ui/MeasurementForm';
import MeasurementsList from '../../customers/ui/MeasurementsList';
import PatternSelector from '../../patterns/ui/PatternSelector';
import PatternDisplay from '../../patterns/ui/PatternDisplay';
import { useCustomersState } from '../../customers/internal/state';
import Navigation from './Navigation';

/**
 * Main App UI component
 */
function App() {
  const { appState, initializeApp, setCurrentPage } = useAppState();
  const { 
    customers, selectedCustomer, measurements, loading, error,
    loadCustomers, createCustomer, selectCustomer, saveMeasurements 
  } = useCustomersState();
  
  const [selectedMeasurementId, setSelectedMeasurementId] = useState(null);
  const [generatedPattern, setGeneratedPattern] = useState(null);
  
  useEffect(() => {
    if (!appState.initialized) {
      initializeApp();
    }
  }, [appState.initialized, initializeApp]);
  
  useEffect(() => {
    // Load customers on initialization
    loadCustomers();
  }, [loadCustomers]);
  
  const handleCustomerSubmit = async (data) => {
    try {
      await createCustomer(data);
    } catch (err) {
      console.error('Error creating customer:', err);
    }
  };
  
  const handleCustomerSelect = async (customerId) => {
    try {
      await selectCustomer(customerId);
      setSelectedMeasurementId(null);
      setGeneratedPattern(null);
    } catch (err) {
      console.error('Error selecting customer:', err);
    }
  };
  
  const handleMeasurementSubmit = async (data) => {
    try {
      const newMeasurement = await saveMeasurements(data);
      setSelectedMeasurementId(newMeasurement.id);
    } catch (err) {
      console.error('Error saving measurements:', err);
    }
  };
  
  const handleMeasurementSelect = (measurementId) => {
    setSelectedMeasurementId(measurementId);
    setGeneratedPattern(null);
  };
  
  const handlePatternGenerated = (result) => {
    setGeneratedPattern(result);
  };
  
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Sewing Pattern Generator</h1>
        </div>
      </header>
      
      <Navigation currentPage={appState.currentPage} setCurrentPage={setCurrentPage} />
      
      <main>
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {appState.currentPage === 'customers' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomerForm onSubmit={handleCustomerSubmit} loading={loading} />
              <CustomerList 
                customers={customers} 
                onSelect={handleCustomerSelect} 
                selectedId={selectedCustomer?.id} 
                loading={loading} 
              />
            </div>
          )}
          
          {appState.currentPage === 'measurements' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MeasurementForm 
                customer={selectedCustomer} 
                onSubmit={handleMeasurementSubmit} 
                loading={loading} 
              />
              <MeasurementsList 
                measurements={measurements} 
                customer={selectedCustomer} 
                onSelect={handleMeasurementSelect} 
                loading={loading} 
                selectedId={selectedMeasurementId} 
              />
            </div>
          )}
          
          {appState.currentPage === 'patterns' && (
            <div className="space-y-6">
              <PatternSelector 
                customer={selectedCustomer} 
                measurementId={selectedMeasurementId} 
                onGenerate={handlePatternGenerated} 
              />
              {generatedPattern && <PatternDisplay generation={generatedPattern} />}
            </div>
          )}
          
          {error && (
            <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white shadow-inner py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">© 2023 Sewing Pattern Generator</p>
            <a 
              href="https://www.zapt.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 text-sm"
            >
              Made on ZAPT
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;