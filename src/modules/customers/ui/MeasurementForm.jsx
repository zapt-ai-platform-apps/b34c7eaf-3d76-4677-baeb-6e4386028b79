import React from 'react';
import { useForm } from 'react-hook-form';

const MeasurementForm = ({ customer, onSubmit, loading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  if (!customer) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Body Measurements</h2>
        <p className="text-gray-500">Please select a customer first.</p>
      </div>
    );
  }
  
  const submitHandler = (data) => {
    // Convert string values to numbers
    const numericData = Object.entries(data).reduce((acc, [key, value]) => {
      acc[key] = value === '' ? undefined : parseFloat(value);
      return acc;
    }, {});
    
    // Add customer ID
    onSubmit({
      ...numericData,
      customerId: customer.id
    });
  };
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Body Measurements for {customer.name}</h2>
      </div>
      
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label" htmlFor="chest">Chest (cm) *</label>
            <input
              id="chest"
              type="number"
              step="0.1"
              className="form-input"
              placeholder="Chest measurement"
              {...register('chest', { 
                required: 'Chest measurement is required',
                min: { value: 1, message: 'Must be greater than 0' }
              })}
            />
            {errors.chest && <p className="form-error">{errors.chest.message}</p>}
          </div>
          
          <div>
            <label className="form-label" htmlFor="waist">Waist (cm) *</label>
            <input
              id="waist"
              type="number"
              step="0.1"
              className="form-input"
              placeholder="Waist measurement"
              {...register('waist', { 
                required: 'Waist measurement is required',
                min: { value: 1, message: 'Must be greater than 0' }
              })}
            />
            {errors.waist && <p className="form-error">{errors.waist.message}</p>}
          </div>
          
          <div>
            <label className="form-label" htmlFor="hip">Hip (cm) *</label>
            <input
              id="hip"
              type="number"
              step="0.1"
              className="form-input"
              placeholder="Hip measurement"
              {...register('hip', { 
                required: 'Hip measurement is required',
                min: { value: 1, message: 'Must be greater than 0' }
              })}
            />
            {errors.hip && <p className="form-error">{errors.hip.message}</p>}
          </div>
          
          <div>
            <label className="form-label" htmlFor="neck">Neck (cm)</label>
            <input
              id="neck"
              type="number"
              step="0.1"
              className="form-input"
              placeholder="Neck measurement"
              {...register('neck', { 
                min: { value: 1, message: 'Must be greater than 0' }
              })}
            />
            {errors.neck && <p className="form-error">{errors.neck.message}</p>}
          </div>
          
          <div>
            <label className="form-label" htmlFor="shoulder">Shoulder (cm)</label>
            <input
              id="shoulder"
              type="number"
              step="0.1"
              className="form-input"
              placeholder="Shoulder measurement"
              {...register('shoulder', { 
                min: { value: 1, message: 'Must be greater than 0' }
              })}
            />
            {errors.shoulder && <p className="form-error">{errors.shoulder.message}</p>}
          </div>
          
          <div>
            <label className="form-label" htmlFor="armLength">Arm Length (cm)</label>
            <input
              id="armLength"
              type="number"
              step="0.1"
              className="form-input"
              placeholder="Arm length measurement"
              {...register('armLength', { 
                min: { value: 1, message: 'Must be greater than 0' }
              })}
            />
            {errors.armLength && <p className="form-error">{errors.armLength.message}</p>}
          </div>
          
          <div>
            <label className="form-label" htmlFor="inseam">Inseam (cm)</label>
            <input
              id="inseam"
              type="number"
              step="0.1"
              className="form-input"
              placeholder="Inseam measurement"
              {...register('inseam', { 
                min: { value: 1, message: 'Must be greater than 0' }
              })}
            />
            {errors.inseam && <p className="form-error">{errors.inseam.message}</p>}
          </div>
          
          <div>
            <label className="form-label" htmlFor="height">Height (cm)</label>
            <input
              id="height"
              type="number"
              step="0.1"
              className="form-input"
              placeholder="Height measurement"
              {...register('height', { 
                min: { value: 1, message: 'Must be greater than 0' }
              })}
            />
            {errors.height && <p className="form-error">{errors.height.message}</p>}
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-4">* Required measurements</p>
        
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
              Saving Measurements...
            </span>
          ) : (
            'Save Measurements'
          )}
        </button>
      </form>
    </div>
  );
};

export default MeasurementForm;