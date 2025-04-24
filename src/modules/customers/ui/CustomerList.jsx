import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { getCustomers, deleteCustomer } from '../api';
import CustomerForm from './CustomerForm';

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch customers:', err);
      Sentry.captureException(err);
      setError('Failed to load customers. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        setDeletingId(id);
        await deleteCustomer(id);
        setCustomers(customers.filter(customer => customer.id !== id));
      } catch (err) {
        console.error('Failed to delete customer:', err);
        Sentry.captureException(err);
        setError('Failed to delete customer. Please try again later.');
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleCustomerAdded = (newCustomer) => {
    setCustomers([...customers, newCustomer]);
    setIsAddingCustomer(false);
  };

  if (loading && customers.length === 0) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        <p>{error}</p>
        <button 
          onClick={fetchCustomers}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Customers</h2>
        <button
          onClick={() => setIsAddingCustomer(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 cursor-pointer"
        >
          Add Customer
        </button>
      </div>

      {isAddingCustomer && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">Add New Customer</h3>
          <CustomerForm 
            onCancel={() => setIsAddingCustomer(false)}
            onSuccess={handleCustomerAdded}
          />
        </div>
      )}

      {customers.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <p className="text-gray-500">No customers yet. Add your first customer to get started!</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {customers.map((customer) => (
              <li key={customer.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <p className="text-sm font-medium text-indigo-600 truncate">{customer.name}</p>
                      <p className="mt-1 text-sm text-gray-500">{customer.email}</p>
                      {customer.phone && <p className="mt-1 text-sm text-gray-500">{customer.phone}</p>}
                    </div>
                    <div className="flex space-x-2">
                      <Link
                        to={`/measurements?customerId=${customer.id}`}
                        className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded text-sm hover:bg-indigo-200 cursor-pointer"
                      >
                        Measurements
                      </Link>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id)}
                        disabled={deletingId === customer.id}
                        className={`px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 cursor-pointer ${
                          deletingId === customer.id ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                      >
                        {deletingId === customer.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerList;