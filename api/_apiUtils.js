import { Low } from 'lowdb';
import { Memory } from 'lowdb/node';
import { nanoid } from 'nanoid';

// Create an in-memory database
const adapter = new Memory();
const db = new Low(adapter);

// Default data for the database
const defaultData = {
  customers: [],
  measurements: [],
  patterns: [
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
  ],
  patternGenerations: []
};

// State flag to track initialization
let isInitialized = false;

// Connect to the database
export async function connectToDatabase() {
  if (!isInitialized) {
    // Initialize the database with default data
    db.data = defaultData;
    isInitialized = true;
    
    console.log('Initialized in-memory database');
  }
  
  return { db };
}

export function handleApiError(res, error) {
  console.error('API Error:', error);
  return res.status(500).json({ 
    error: 'Internal Server Error',
    message: error.message 
  });
}

export function parseObjectId(id) {
  return id;
}

export function formatDocument(doc) {
  if (!doc) return null;
  return {
    ...doc,
    id: doc._id,
    _id: undefined
  };
}

export function formatDocuments(docs) {
  return docs.map(formatDocument);
}

// Collection-like interface for LowDB
export function collection(collectionName) {
  return {
    async find(query = {}) {
      if (!db.data) {
        await connectToDatabase();
      }
      
      const collection = db.data[collectionName] || [];
      
      if (Object.keys(query).length === 0) {
        return collection;
      }
      
      return collection.filter(doc => {
        return Object.entries(query).every(([key, value]) => {
          return doc[key] === value;
        });
      });
    },
    
    async findOne(query = {}) {
      if (!db.data) {
        await connectToDatabase();
      }
      
      const collection = db.data[collectionName] || [];
      
      return collection.find(doc => {
        return Object.entries(query).every(([key, value]) => {
          return doc[key] === value;
        });
      });
    },
    
    async insertOne(doc) {
      if (!db.data) {
        await connectToDatabase();
      }
      
      const collection = db.data[collectionName] || [];
      
      const _id = doc._id || nanoid();
      
      const newDoc = {
        ...doc,
        _id
      };
      
      collection.push(newDoc);
      db.data[collectionName] = collection;
      
      return {
        insertedId: _id
      };
    },
    
    async findOneAndUpdate(query, update) {
      if (!db.data) {
        await connectToDatabase();
      }
      
      const collection = db.data[collectionName] || [];
      
      const index = collection.findIndex(doc => {
        return Object.entries(query).every(([key, value]) => {
          return doc[key] === value;
        });
      });
      
      if (index === -1) {
        return null;
      }
      
      const doc = collection[index];
      
      // Apply update
      const updatedDoc = {
        ...doc,
        ...update.$set,
        updatedAt: new Date().toISOString()
      };
      
      collection[index] = updatedDoc;
      db.data[collectionName] = collection;
      
      return updatedDoc;
    },
    
    async deleteOne(query) {
      if (!db.data) {
        await connectToDatabase();
      }
      
      const collection = db.data[collectionName] || [];
      
      const index = collection.findIndex(doc => {
        return Object.entries(query).every(([key, value]) => {
          return doc[key] === value;
        });
      });
      
      if (index === -1) {
        return;
      }
      
      collection.splice(index, 1);
      db.data[collectionName] = collection;
    },
    
    async countDocuments(query = {}) {
      const docs = await this.find(query);
      return docs.length;
    },
    
    async listIndexes() {
      return [];
    },
    
    async createIndex() {
      return;
    }
  };
}