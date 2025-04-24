import { runMigrations } from './_db_migrations.js';
import Sentry from './_sentry.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Initializing database...');
    await runMigrations();
    return res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    Sentry.captureException(error);
    return res.status(500).json({ error: 'Failed to initialize database', details: error.message });
  }
}