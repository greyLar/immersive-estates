// Database setup — creates all tables
const { initDb, execute } = require('./db');

async function setup() {
  console.log("=== ImmersiveEstates Database Setup ===");
  
  await initDb();
  console.log("Database initialized at:", process.env.DB_PATH || './data/immersive-estates.db');
  
  const tables = [
    `CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brokerage TEXT,
      email TEXT,
      phone TEXT,
      monthly_listings TEXT,
      has_website BOOLEAN DEFAULT 0,
      lead_source TEXT,
      lead_status TEXT DEFAULT 'warm',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER REFERENCES leads(id),
      property_address TEXT NOT NULL,
      access_instructions TEXT,
      preferred_date TEXT,
      preferred_time TEXT,
      confirmed_date TEXT,
      confirmed_time TEXT,
      status TEXT DEFAULT 'pending',
      reminder_sent BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS outreach (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER REFERENCES leads(id),
      channel TEXT,
      direction TEXT,
      content TEXT,
      sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      response_received BOOLEAN DEFAULT 0,
      followup_number INTEGER DEFAULT 0,
      status TEXT DEFAULT 'sent'
    )`,
    `CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER REFERENCES leads(id),
      session_data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      lead_id INTEGER REFERENCES leads(id),
      google_review_link TEXT,
      asked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed BOOLEAN DEFAULT 0,
      completed_at DATETIME
    )`
  ];
  
  for (const sql of tables) {
    try {
      execute(sql);
      console.log(`  ✓ Created table`);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
    }
  }
  
  console.log("=== Setup Complete ===");
}

setup().catch(err => {
  console.error("Setup failed:", err);
  process.exit(1);
});