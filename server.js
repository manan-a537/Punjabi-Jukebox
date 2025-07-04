import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(cors());

const uri = 'mongodb+srv://mananarora537:VFljITiujlI0Q1Cw@songs.d9mf3t0.mongodb.net/?retryWrites=true&w=majority&appName=Songs';
const dbName = 'mananarora537';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from public/songs
app.use('/songs', express.static(path.join(__dirname, 'public', 'songs')));

// Serve static files from dist (for production build)
app.use(express.static(path.join(__dirname, 'dist')));

app.get('/api/songs', async (req, res) => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const songs = await db.collection('songs').find().toArray();
    res.json(songs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

// Fallback: serve index.html for any non-API route (SPA support)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));