import { connectToDatabase } from './_apiUtils.js';

// Used to run migrations for embedded database
export async function runMigrations() {
  const { db } = await connectToDatabase();
  
  console.log('Running database migrations...');
  
  // Note: Most migrations are not needed with our in-memory database
  // as we initialize with default data, but we keep this for structure consistency
  
  // Seed initial data if not present
  await seedInitialData(db);
  
  console.log('Migrations completed successfully');
}

async function seedInitialData(db) {
  // Check if we need to seed patterns
  if (!db.data.patterns || db.data.patterns.length === 0) {
    console.log('Seeding default patterns');
    
    db.data.patterns = [
      {
        _id: 'pattern1',
        name: 'Basic T-Shirt',
        description: 'Simple short-sleeve t-shirt pattern',
        type: 'top',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'pattern2',
        name: 'A-Line Skirt',
        description: 'Classic A-line skirt pattern',
        type: 'bottom',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'pattern3',
        name: 'Basic Pants',
        description: 'Simple pants with elastic waistband',
        type: 'bottom',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'pattern4',
        name: 'Button-Up Shirt',
        description: 'Classic button-up shirt with collar',
        type: 'top',
        createdAt: new Date().toISOString()
      }
    ];
  }
  
  // Initialize other collections if needed
  if (!db.data.customers) db.data.customers = [];
  if (!db.data.measurements) db.data.measurements = [];
  if (!db.data.patternGenerations) db.data.patternGenerations = [];
}