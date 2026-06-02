// Database utility — uses sql.js (pure JS SQLite, no native compilation)
// Database file is stored at DB_PATH or ./data/immersive-estates.db
const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data', 'immersive-estates.db');

let db = null;

function getDb() {
  if (db) return db;
  throw new Error('Database not initialized. Run setup first.');
}

async function initDb() {
  const SQL = await initSqlJs();
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  
  db.run('PRAGMA journal_mode=WAL');
  db.run('PRAGMA foreign_keys=ON');
  saveDb();
  return db;
}

function saveDb() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(DB_PATH, buffer);
}

function query(sql) {
  const d = getDb();
  try {
    const results = d.exec(sql);
    if (results.length === 0) return [];
    const columns = results[0].columns;
    const values = results[0].values;
    return values.map(row => {
      const obj = {};
      columns.forEach((col, i) => { obj[col] = row[i]; });
      return obj;
    });
  } catch (error) {
    console.error(`Query error: ${error.message}`);
    throw error;
  }
}

function execute(sql) {
  const d = getDb();
  try {
    d.run(sql);
    saveDb();
    return true;
  } catch (error) {
    console.error(`Execute error: ${error.message}`);
    throw error;
  }
}

// Get the last inserted row ID
function lastInsertId() {
  const d = getDb();
  const result = d.exec('SELECT last_insert_rowid() as id');
  return result[0]?.values?.[0]?.[0] || null;
}

module.exports = { query, execute, lastInsertId, initDb };