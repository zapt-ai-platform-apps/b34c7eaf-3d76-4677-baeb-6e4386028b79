import { pgTable, serial, text, timestamp, integer, decimal, unique } from 'drizzle-orm/pg-core';

export const customers = pgTable('customers', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow()
});

export const measurements = pgTable('measurements', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  chest: decimal('chest', { precision: 5, scale: 1 }).notNull(),
  waist: decimal('waist', { precision: 5, scale: 1 }).notNull(),
  hip: decimal('hip', { precision: 5, scale: 1 }).notNull(),
  neck: decimal('neck', { precision: 5, scale: 1 }),
  shoulder: decimal('shoulder', { precision: 5, scale: 1 }),
  armLength: decimal('arm_length', { precision: 5, scale: 1 }),
  inseam: decimal('inseam', { precision: 5, scale: 1 }),
  height: decimal('height', { precision: 5, scale: 1 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const patterns = pgTable('patterns', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});

export const patternGenerations = pgTable('pattern_generations', {
  id: serial('id').primaryKey(),
  customerId: integer('customer_id').notNull().references(() => customers.id, { onDelete: 'cascade' }),
  patternId: integer('pattern_id').notNull().references(() => patterns.id, { onDelete: 'cascade' }),
  measurementsId: integer('measurements_id').notNull().references(() => measurements.id, { onDelete: 'cascade' }),
  pdfUrl: text('pdf_url'),
  createdAt: timestamp('created_at').defaultNow()
});