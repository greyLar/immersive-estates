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
    )`,
    `CREATE TABLE IF NOT EXISTS pricing_tiers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price TEXT NOT NULL,
      description TEXT,
      features TEXT,
      featured BOOLEAN DEFAULT 0,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section TEXT NOT NULL UNIQUE,
      content TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    `CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      address TEXT,
      description TEXT,
      thumbnail TEXT,
      rooms TEXT,
      published BOOLEAN DEFAULT 1,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  ];
  
  for (const sql of tables) {
    try {
      execute(sql);
      console.log(`  ✓ Table check/create complete`);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
    }
  }

  // Seed site_content
  const seedContent = [
    {
      section: 'hero',
      content: JSON.stringify({
        headline: "Sell Properties Faster with 360° Immersive Photo Tours",
        subtitle: "Professional 360° photography that puts buyers inside the home. High-end imagery, fast turnaround.",
        cta: "Book a Shoot"
      })
    },
    {
      section: 'services',
      content: JSON.stringify({
        title: "A Premium Way to Showcase Properties",
        subtitle: "Our technology helps you stand out in a crowded market.",
        items: [
          { name: "360° Photography", description: "High-resolution panoramic shots of every room." },
          { name: "Virtual Tours", description: "Interactive walk-throughs for a complete property experience." },
          { name: "Fast Delivery", description: "Processed and delivered within 24 hours of the shoot." }
        ]
      })
    },
    {
      section: 'about',
      content: JSON.stringify({
        text: "ImmersiveEstates provides professional 360° photography services to help real estate agents close deals faster. Our AI-driven workflow ensures seamless booking and follow-up."
      })
    }
  ];

  console.log("Seeding site_content...");
  for (const item of seedContent) {
    try {
      execute(`INSERT OR IGNORE INTO site_content (section, content) VALUES ('${item.section}', '${item.content.replace(/'/g, "''")}')`);
      console.log(`  ✓ Seeded section: ${item.section}`);
    } catch (err) {
      console.error(`  ✗ Error seeding ${item.section}: ${err.message}`);
    }
  }
  
  console.log("=== Setup Complete ===");
}

setup().catch(err => {
  console.error("Setup failed:", err);
  process.exit(1);
});
