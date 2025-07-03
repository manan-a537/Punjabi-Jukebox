import { MongoClient } from 'mongodb';
import fs from 'fs';

// Replace <db_password> with your actual password
const uri = 'mongodb+srv://mananarora537:VFljITiujlI0Q1Cw@songs.d9mf3t0.mongodb.net/?retryWrites=true&w=majority&appName=Songs';
const dbName = 'mananarora537';

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('songs');

    // Clear the collection first
    await collection.deleteMany({});

    // Read songs.json
    const songs = JSON.parse(fs.readFileSync('songs.json', 'utf-8'));

    // Insert all songs
    const result = await collection.insertMany(songs);
    console.log(`Inserted ${result.insertedCount} songs!`);
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main();