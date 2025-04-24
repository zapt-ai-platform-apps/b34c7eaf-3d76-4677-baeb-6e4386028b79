import { MongoClient, ObjectId } from 'mongodb';

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db('pattern-generator');
  
  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}

export function handleApiError(res, error) {
  console.error('API Error:', error);
  return res.status(500).json({ 
    error: 'Internal Server Error',
    message: error.message 
  });
}

export function parseObjectId(id) {
  try {
    return new ObjectId(id);
  } catch (error) {
    throw new Error(`Invalid ID format: ${id}`);
  }
}

export function formatDocument(doc) {
  if (!doc) return null;
  return {
    ...doc,
    id: doc._id.toString(),
    _id: undefined
  };
}

export function formatDocuments(docs) {
  return docs.map(formatDocument);
}