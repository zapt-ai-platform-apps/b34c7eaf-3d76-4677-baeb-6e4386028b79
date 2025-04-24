import React from 'react';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const tabs = [
    { id: 'customers', label: 'Customers' },
    { id: 'measurements', label: 'Measurements' },
    { id: 'patterns', label: 'Patterns' }
  ];
  
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                currentPage === tab.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setCurrentPage(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;