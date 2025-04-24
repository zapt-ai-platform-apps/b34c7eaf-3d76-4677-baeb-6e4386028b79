import React, { useEffect } from 'react';
import { usePatternsState } from '../internal/state';

const PatternSelector = ({ customer, measurementId, onGenerate }) => {
  const { patterns, loading, loadPatterns, generatePattern, error } = usePatternsState();
  
  useEffect(() => {
    loadPatterns();
  }, [loadPatterns]);
  
  if (!customer || !measurementId) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Select a Pattern</h2>
        <p className="text-gray-500">Please select a customer and their measurements first.</p>
      </div>
    );
  }
  
  const handleGeneratePattern = async (patternId) => {
    try {
      const result = await generatePattern({
        patternId,
        customerId: customer.id,
        measurementsId: measurementId
      });
      
      if (onGenerate) {
        onGenerate(result);
      }
    } catch (err) {
      console.error('Error generating pattern:', err);
    }
  };
  
  if (loading) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Select a Pattern</h2>
        <div className="flex justify-center items-center p-4">
          <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Select a Pattern</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
          <p className="font-bold">Error loading patterns</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Select a Pattern for {customer.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patterns.map(pattern => (
          <div key={pattern.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <h3 className="font-medium text-lg">{pattern.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{pattern.description}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {pattern.type}
              </span>
              <button
                onClick={() => handleGeneratePattern(pattern.id)}
                disabled={loading}
                className="mt-4 w-full btn-primary cursor-pointer"
              >
                {loading ? 'Generating...' : 'Generate Pattern'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatternSelector;