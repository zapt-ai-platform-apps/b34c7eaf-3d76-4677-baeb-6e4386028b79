import React from 'react';

const MeasurementsList = ({ measurements, customer, onSelect, loading, selectedId }) => {
  if (loading) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Saved Measurements</h2>
        <div className="flex justify-center items-center p-4">
          <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Saved Measurements</h2>
        <p className="text-gray-500">Please select a customer first.</p>
      </div>
    );
  }
  
  if (measurements.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Saved Measurements for {customer.name}</h2>
        <p className="text-gray-500">No measurements saved yet.</p>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Saved Measurements for {customer.name}</h2>
      
      <ul className="divide-y divide-gray-200">
        {measurements.map(measurement => (
          <li 
            key={measurement.id}
            className={`py-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === measurement.id ? 'bg-indigo-50' : ''}`}
            onClick={() => onSelect(measurement.id)}
          >
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Measurements from {formatDate(measurement.createdAt)}</p>
                <div className="mt-1 grid grid-cols-2 gap-x-4 text-sm text-gray-500">
                  <div>Chest: {measurement.chest} cm</div>
                  <div>Waist: {measurement.waist} cm</div>
                  <div>Hip: {measurement.hip} cm</div>
                  {measurement.height && <div>Height: {measurement.height} cm</div>}
                </div>
              </div>
              {selectedId === measurement.id && (
                <div className="ml-2 flex-shrink-0">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Selected
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeasurementsList;