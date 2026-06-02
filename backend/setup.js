const { execSync } = require('child_process');

function runSql(sql) {
  console.log(`Executing: ${sql}`);
  try {
    const output = execSync(`team-db "${sql.replace(/"/g, '\\"')}"`);
    console.log(output.toString());
  } catch (error) {
    console.error(`Error executing SQL: ${error.message}`);
  }
}

const schemas = [
  `DROP TABLE IF EXISTS reviews`,
  `DROP TABLE IF EXISTS conversations`,
  `DROP TABLE IF EXISTS outreach`,
  `DROP TABLE IF EXISTS bookings`,
  `DROP TABLE IF EXISTS leads`,
  `CREATE TABLE leads (
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
  `CREATE TABLE bookings (
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
  `CREATE TABLE outreach (
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
  `CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER REFERENCES leads(id),
    session_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER REFERENCES leads(id),
    google_review_link TEXT,
    asked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed BOOLEAN DEFAULT 0,
    completed_at DATETIME
  )`
];

schemas.forEach(schema => runSql(schema));
console.log("Database setup completed with lead's specific schema.");
