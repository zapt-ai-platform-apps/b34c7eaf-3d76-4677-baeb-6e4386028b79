import { useState, useCallback } from 'react';
import { api } from '../api';
import { eventBus } from '../../core/events';
import { events } from '../events';

export const useCustomersState = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loadCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const customersData = await api.getCustomers();
      setCustomers(customersData);
      return customersData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const createCustomer = useCallback(async (customerData) => {
    setLoading(true);
    setError(null);
    
    try {
      const newCustomer = await api.createCustomer(customerData);
      setCustomers(prev => [...prev, newCustomer]);
      
      // Publish event
      eventBus.publish(events.CUSTOMER_CREATED, { customer: newCustomer });
      
      return newCustomer;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const selectCustomer = useCallback(async (customerId) => {
    setLoading(true);
    setError(null);
    
    try {
      const customer = await api.getCustomer(customerId);
      setSelectedCustomer(customer);
      
      // Load measurements for the selected customer
      const customerMeasurements = await api.getCustomerMeasurements(customerId);
      setMeasurements(customerMeasurements);
      
      return { customer, measurements: customerMeasurements };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const saveMeasurements = useCallback(async (measurementData) => {
    setLoading(true);
    setError(null);
    
    try {
      const savedMeasurements = await api.saveMeasurements(measurementData);
      
      // Update measurements list if this is for the currently selected customer
      if (selectedCustomer && selectedCustomer.id === measurementData.customerId) {
        setMeasurements(prev => [...prev, savedMeasurements]);
      }
      
      // Publish event
      eventBus.publish(events.MEASUREMENTS_SAVED, { 
        measurements: savedMeasurements,
        customerId: measurementData.customerId
      });
      
      return savedMeasurements;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedCustomer]);
  
  return {
    customers,
    selectedCustomer,
    measurements,
    loading,
    error,
    loadCustomers,
    createCustomer,
    selectCustomer,
    saveMeasurements
  };
};