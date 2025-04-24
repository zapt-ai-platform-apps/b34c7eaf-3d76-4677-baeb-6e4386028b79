import { z } from 'zod';
import { createValidator } from '../core/validators';

// Customer validation schema
export const customerSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  createdAt: z.date().optional()
});

export const validateCustomer = createValidator(customerSchema, 'Customer');

// Measurement validation schema
export const measurementSchema = z.object({
  id: z.number().optional(),
  customerId: z.number(),
  chest: z.number().positive('Chest measurement must be positive'),
  waist: z.number().positive('Waist measurement must be positive'),
  hip: z.number().positive('Hip measurement must be positive'),
  neck: z.number().positive('Neck measurement must be positive').optional(),
  shoulder: z.number().positive('Shoulder measurement must be positive').optional(),
  armLength: z.number().positive('Arm length measurement must be positive').optional(),
  inseam: z.number().positive('Inseam measurement must be positive').optional(),
  height: z.number().positive('Height measurement must be positive').optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
});

export const validateMeasurement = createValidator(measurementSchema, 'Measurement');