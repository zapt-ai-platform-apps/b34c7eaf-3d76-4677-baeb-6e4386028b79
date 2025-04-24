import { connectToDatabase } from './_apiUtils.js';

// Used to run migrations for MongoDB
export async function runMigrations() {
  const { db } = await connectToDatabase();
  
  console.log('Running MongoDB migrations...');
  
  // Create collections if they don't exist
  await createCollections(db);
  
  // Create indexes
  await createIndexes(db);
  
  // Seed initial data
  await seedInitialData(db);
  
  console.log('Migrations completed successfully');
}

async function createCollections(db) {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);
  
  // Create customers collection if it doesn't exist
  if (!collectionNames.includes('customers')) {
    await db.createCollection('customers');
    console.log('Created customers collection');
  }
  
  // Create measurements collection if it doesn't exist
  if (!collectionNames.includes('measurements')) {
    await db.createCollection('measurements');
    console.log('Created measurements collection');
  }
  
  // Create patterns collection if it doesn't exist
  if (!collectionNames.includes('patterns')) {
    await db.createCollection('patterns');
    console.log('Created patterns collection');
  }
  
  // Create patternGenerations collection if it doesn't exist
  if (!collectionNames.includes('patternGenerations')) {
    await db.createCollection('patternGenerations');
    console.log('Created patternGenerations collection');
  }
}

async function createIndexes(db) {
  // Customers indexes
  const customerIndexes = await db.collection('customers').listIndexes().toArray();
  if (!customerIndexes.some(index => index.key && index.key.email)) {
    await db.collection('customers').createIndex({ email: 1 }, { unique: true });
    console.log('Created email index on customers collection');
  }
  
  // Measurements indexes
  const measurementsIndexes = await db.collection('measurements').listIndexes().toArray();
  if (!measurementsIndexes.some(index => index.key && index.key.customerId)) {
    await db.collection('measurements').createIndex({ customerId: 1 });
    console.log('Created customerId index on measurements collection');
  }
  
  // Pattern generations indexes
  const generationsIndexes = await db.collection('patternGenerations').listIndexes().toArray();
  if (!generationsIndexes.some(index => index.key && index.key.customerId)) {
    await db.collection('patternGenerations').createIndex({ customerId: 1 });
    console.log('Created customerId index on patternGenerations collection');
  }
  if (!generationsIndexes.some(index => index.key && index.key.patternId)) {
    await db.collection('patternGenerations').createIndex({ patternId: 1 });
    console.log('Created patternId index on patternGenerations collection');
  }
}

async function seedInitialData(db) {
  // Add default patterns if they don't exist
  const patternsCount = await db.collection('patterns').countDocuments();
  
  if (patternsCount === 0) {
    const defaultPatterns = [
      {
        name: 'Basic T-Shirt',
        description: 'Simple short-sleeve t-shirt pattern',
        type: 'top',
        createdAt: new Date()
      },
      {
        name: 'A-Line Skirt',
        description: 'Classic A-line skirt pattern',
        type: 'bottom',
        createdAt: new Date()
      },
      {
        name: 'Basic Pants',
        description: 'Simple pants with elastic waistband',
        type: 'bottom',
        createdAt: new Date()
      },
      {
        name: 'Button-Up Shirt',
        description: 'Classic button-up shirt with collar',
        type: 'top',
        createdAt: new Date()
      }
    ];
    
    await db.collection('patterns').insertMany(defaultPatterns);
    console.log('Seeded default patterns');
  }
}