import React from 'react';

/**
 * Component for selecting a customer when on the measurements page
 */
const CustomerSelection = ({ customers, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="card col-span-2">
        <h2 className="text-xl font-bold mb-4">Select Customer for Measurements</h2>
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
    <div className="card col-span-2">
      <h2 className="text-xl font-bold mb-4">Select Customer for Measurements</h2>
      
      {customers.length === 0 ? (
        <div className="text-center py-6">
          <p className="text-gray-500 mb-4">No customers registered yet.</p>
          <p className="text-sm text-gray-600">Please create a customer in the Customers tab first.</p>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-4">Please select a customer to record or view their measurements:</p>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {customers.map(customer => (
              <div 
                key={customer.id}
                className="border rounded-lg p-4 hover:bg-indigo-50 transition-colors cursor-pointer"
                onClick={() => onSelect(customer.id)}
              >
                <h3 className="font-medium text-lg mb-1">{customer.name}</h3>
                <p className="text-sm text-gray-600">{customer.email}</p>
                {customer.phone && <p className="text-sm text-gray-500 mt-1">{customer.phone}</p>}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerSelection;