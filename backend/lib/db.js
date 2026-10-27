import fs from 'fs';
import path from 'path';

// Simple JSON file used as database
const DB_FILE = path.join(process.cwd(), 'data', 'db.json');

const emptyDb = {
  users: [],
  posts: [],
  comments: [],
  likes: [],
  friendRequests: [],
  notifications: [],
};

export function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    return structuredClone(emptyDb);
  }
  return { ...emptyDb, ...JSON.parse(fs.readFileSync(DB_FILE, 'utf-8')) };
}

export function writeDb(db) {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}
