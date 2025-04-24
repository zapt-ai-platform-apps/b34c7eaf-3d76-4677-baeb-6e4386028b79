import React from 'react';

const CustomerList = ({ customers, onSelect, selectedId, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Customers</h2>
        <div className="flex justify-center items-center p-4">
          <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Customers</h2>
      
      {customers.length === 0 ? (
        <p className="text-gray-500">No customers registered yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {customers.map(customer => (
            <li 
              key={customer.id}
              className={`py-4 px-2 cursor-pointer hover:bg-gray-50 transition-colors ${selectedId === customer.id ? 'bg-indigo-50' : ''}`}
              onClick={() => onSelect(customer.id)}
            >
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{customer.name}</p>
                  <p className="text-sm text-gray-500 truncate">{customer.email}</p>
                </div>
                {selectedId === customer.id && (
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
      )}
    </div>
  );
};

export default CustomerList;