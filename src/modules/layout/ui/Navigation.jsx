import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const tabs = [
    { id: 'customers', label: 'Customers', path: '/customers' },
    { id: 'measurements', label: 'Measurements', path: '/measurements' },
    { id: 'patterns', label: 'Patterns', path: '/patterns' }
  ];
  
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={tab.path}
              className={`px-3 py-2 text-sm font-medium rounded-md cursor-pointer ${
                location.pathname === tab.path
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;