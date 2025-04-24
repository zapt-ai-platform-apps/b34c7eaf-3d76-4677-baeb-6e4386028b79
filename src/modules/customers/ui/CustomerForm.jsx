import React from 'react';
import { useForm } from 'react-hook-form';

const CustomerForm = ({ onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Register New Customer</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="form-label" htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            className="form-input"
            placeholder="Enter full name"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="form-error">{errors.name.message}</p>}
        </div>
        
        <div className="mb-4">
          <label className="form-label" htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            className="form-input"
            placeholder="Enter email address"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
        
        <div className="mb-6">
          <label className="form-label" htmlFor="phone">Phone Number (optional)</label>
          <input
            id="phone"
            type="tel"
            className="form-input"
            placeholder="Enter phone number"
            {...register('phone')}
          />
        </div>
        
        <button 
          type="submit" 
          className="btn-primary w-full cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Registering...
            </span>
          ) : (
            'Register Customer'
          )}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;