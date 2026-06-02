const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const { sendEmail, sendSMS, createCalendarEvent, formatLeadNotification, calculateEndTime } = require('./services');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const GOOGLE_REVIEW_URL = process.env.GOOGLE_REVIEW_URL || "https://g.page/immersive-estates/review";

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
  app.use(express.static(frontendDist));
  app.use((req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(frontendDist, 'index.html'));
    }
  });
}

// Helper to qualify lead
function getQualification(monthly_listings) {
  // monthly_listings: 1-5, 6-15, 15+
  if (monthly_listings === '15+') return 'hot';
  if (monthly_listings === '6-15') return 'warm';
  return 'cold';
}

// --- LEADS ---

app.post('/api/leads', async (req, res) => {
  const { name, brokerage, email, phone, monthly_listings, has_website, lead_source } = req.body;
  const qualification = getQualification(monthly_listings);
  
  const sql = `INSERT INTO leads (name, brokerage, email, phone, monthly_listings, has_website, lead_source, lead_status) 
               VALUES ('${name || ''}', '${brokerage || ''}', '${email || ''}', '${phone || ''}', '${monthly_listings || ''}', ${has_website ? 1 : 0}, '${lead_source || 'direct'}', '${qualification}')`;
  db.execute(sql);
  
  // Get the newly created lead
  const leads = db.query(`SELECT * FROM leads WHERE name = '${name}' AND email = '${email}' ORDER BY id DESC LIMIT 1`);
  const lead = leads[0];
  
  // Send notification
  await sendEmail({
    to: email || 'owner@immersive-estates.com',
    subject: qualification === 'hot' 
      ? `🔥 HOT LEAD: ${name} from ${brokerage} (${monthly_listings}/mo)`
      : `New Lead: ${name} from ${brokerage}`,
    body: formatLeadNotification({ name, brokerage, email, phone, monthly_listings, has_website, qualification })
  });

  res.status(201).json({ success: true, lead, qualification });
});

app.get('/api/leads', (req, res) => {
  const { status, source, search } = req.query;
  let sql = 'SELECT * FROM leads';
  const filters = [];
  if (status) filters.push(`lead_status = '${status}'`);
  if (source) filters.push(`lead_source = '${source}'`);
  if (search) filters.push(`name LIKE '%${search}%'`);
  
  if (filters.length > 0) sql += ' WHERE ' + filters.join(' AND ');
  
  const leads = db.query(sql);
  res.json({ leads });
});

app.put('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const updates = [];
  for (const [key, value] of Object.entries(req.body)) {
    if (['name', 'brokerage', 'email', 'phone', 'monthly_listings', 'has_website', 'lead_source', 'lead_status', 'notes'].includes(key)) {
      updates.push(`${key} = '${value}'`);
    }
  }
  updates.push(`updated_at = CURRENT_TIMESTAMP`);
  
  const sql = `UPDATE leads SET ${updates.join(', ')} WHERE id = ${id}`;
  db.execute(sql);
  
  const leads = db.query(`SELECT * FROM leads WHERE id = ${id}`);
  res.json({ success: true, lead: leads[0] });
});

app.post('/api/leads/:id/qualify', (req, res) => {
  const { id } = req.params;
  const leads = db.query(`SELECT * FROM leads WHERE id = ${id}`);
  if (leads.length === 0) return res.status(404).json({ success: false, error: 'Lead not found' });
  
  const lead = leads[0];
  const qualification = getQualification(lead.monthly_listings);
  
  db.execute(`UPDATE leads SET lead_status = '${qualification}', updated_at = CURRENT_TIMESTAMP WHERE id = ${id}`);
  res.json({ success: true, lead_status: qualification, reason: `Based on listing volume: ${lead.monthly_listings}` });
});

// --- BOOKINGS ---

app.post('/api/bookings', (req, res) => {
  const { lead_id, property_address, access_instructions, preferred_date, preferred_time } = req.body;
  const sql = `INSERT INTO bookings (lead_id, property_address, access_instructions, preferred_date, preferred_time, status) 
               VALUES (${lead_id}, '${property_address}', '${access_instructions || ''}', '${preferred_date || ''}', '${preferred_time || ''}', 'pending')`;
  db.execute(sql);
  
  const bookings = db.query(`SELECT * FROM bookings WHERE lead_id = ${lead_id} ORDER BY id DESC LIMIT 1`);
  res.status(201).json({ success: true, booking: bookings[0] });
});

app.get('/api/bookings', (req, res) => {
  const { status, lead_id } = req.query;
  let sql = 'SELECT * FROM bookings';
  const filters = [];
  if (status) filters.push(`status = '${status}'`);
  if (lead_id) filters.push(`lead_id = ${lead_id}`);
  if (filters.length > 0) sql += ' WHERE ' + filters.join(' AND ');
  
  const bookings = db.query(sql);
  res.json({ bookings });
});

app.put('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  const updates = [];
  for (const [key, value] of Object.entries(req.body)) {
    if (['status', 'confirmed_date', 'confirmed_time', 'property_address', 'access_instructions', 'preferred_date', 'preferred_time', 'reminder_sent'].includes(key)) {
      updates.push(`${key} = '${value}'`);
    }
  }
  const sql = `UPDATE bookings SET ${updates.join(', ')} WHERE id = ${id}`;
  db.execute(sql);
  
  const bookings = db.query(`SELECT * FROM bookings WHERE id = ${id}`);
  res.json({ success: true, booking: bookings[0] });
});

app.post('/api/bookings/:id/complete', async (req, res) => {
  const { id } = req.params;
  
  // Set booking status to completed
  db.execute(`UPDATE bookings SET status = 'completed' WHERE id = ${id}`);
  
  const bookings = db.query(`SELECT * FROM bookings WHERE id = ${id}`);
  if (bookings.length === 0) return res.status(404).json({ success: false, error: 'Booking not found' });
  const booking = bookings[0];
  const lead_id = booking.lead_id;

  const leads = db.query(`SELECT * FROM leads WHERE id = ${lead_id}`);
  const lead = leads[0];

  // 1. Log outreach record confirming delivery
  const confirmationMsg = `Your 360° tour for ${booking.property_address} is ready! We hope you love the results.`;
  db.execute(`INSERT INTO outreach (lead_id, channel, direction, content, status) 
               VALUES (${lead_id}, 'email', 'outbound', '${confirmationMsg.replace(/'/g, "''")}', 'sent')`);

  // Notifications
  await sendSMS({
    to: lead.phone,
    body: confirmationMsg
  });
  await sendEmail({
    to: lead.email,
    subject: `Your 360° Tour for ${booking.property_address} is Ready!`,
    body: confirmationMsg
  });

  // 2. Schedule a 30-day re-engagement
  // Instruction says: "store as a review record with later date"
  const reengageDate = new Date();
  reengageDate.setDate(reengageDate.getDate() + 30);
  const reengageDateStr = reengageDate.toISOString().replace('T', ' ').substring(0, 19);
  db.execute(`INSERT INTO reviews (lead_id, asked_at, completed) VALUES (${lead_id}, '${reengageDateStr}', 0)`);

  // Return suggested messages
  res.json({ 
    success: true, 
    booking,
    suggested_messages: [
      confirmationMsg,
      "Do you have any other upcoming listings that could use an immersive tour? We'd love to help you sell them faster."
    ]
  });
});

app.post('/api/bookings/:id/confirm', async (req, res) => {
  const { id } = req.params;
  const today = new Date().toISOString().split('T')[0];
  const sql = `UPDATE bookings SET status = 'confirmed', confirmed_date = '${today}' WHERE id = ${id}`;
  db.execute(sql);
  
  const bookings = db.query(`SELECT * FROM bookings WHERE id = ${id}`);
  const booking = bookings[0];

  const leads = db.query(`SELECT * FROM leads WHERE id = ${booking.lead_id}`);
  const lead = leads[0];

  // Create Calendar Event
  await createCalendarEvent({
    title: `360° Shoot - ${booking.property_address}`,
    startTime: `${booking.preferred_date}T${booking.preferred_time}:00`,
    endTime: calculateEndTime(booking.preferred_date, booking.preferred_time),
    location: booking.property_address,
    description: `Client: ${lead.name} (${lead.brokerage})\nAccess: ${booking.access_instructions || 'None provided'}`
  });

  res.json({ success: true, booking });
});

// --- CHAT ---

app.post('/api/chat/message', (req, res) => {
  const { lead_id, message, session_data: incoming_session } = req.body;
  let session = incoming_session || { step: 'awaiting_name' };
  let currentLeadId = lead_id;

  if (currentLeadId && !incoming_session) {
    const convs = db.query(`SELECT * FROM conversations WHERE lead_id = ${currentLeadId} ORDER BY updated_at DESC LIMIT 1`);
    if (convs.length > 0) {
      session = JSON.parse(convs[0].session_data);
    }
  }

  let reply = "";
  let lead_complete = false;

  switch (session.step) {
    case 'awaiting_name':
      reply = "Hi! I'm your ImmersiveEstates assistant. To get started, what's your full name?";
      session.step = 'collecting_name';
      break;
    case 'collecting_name':
      session.name = message;
      reply = `Nice to meet you, ${message}! Which brokerage are you with?`;
      session.step = 'awaiting_brokerage';
      break;
    case 'awaiting_brokerage':
      session.brokerage = message;
      reply = "Got it. How many active listings do you typically handle per month? (options: 1-5, 6-15, 15+)";
      session.step = 'awaiting_listings';
      break;
    case 'awaiting_listings':
      session.monthly_listings = message; // ideally normalize this
      reply = "Thanks. Do you have a personal website for your listings? (Yes/No)";
      session.step = 'awaiting_website';
      break;
    case 'awaiting_website':
      session.has_website = message.toLowerCase().includes('yes') ? 1 : 0;
      session.step = 'complete';
      lead_complete = true;
      
      // Create or update lead
      if (!currentLeadId) {
        const qualification = getQualification(session.monthly_listings);
        const insertSql = `INSERT INTO leads (name, brokerage, monthly_listings, has_website, lead_source, lead_status) 
                           VALUES ('${session.name}', '${session.brokerage}', '${session.monthly_listings}', ${session.has_website}, 'website_widget', '${qualification}')`;
        db.execute(insertSql);
        const newLeads = db.query(`SELECT id FROM leads WHERE name = '${session.name}' ORDER BY id DESC LIMIT 1`);
        currentLeadId = newLeads[0].id;
      }
      
      reply = `Perfect, I've got your details. You handle ${session.monthly_listings} listings monthly with ${session.brokerage}. Would you like to book a 360° photo shoot for one of your active listings?`;
      break;
    case 'complete':
      if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('book')) {
        reply = "Excellent! Please tell me the property address and your preferred date/time.";
        session.step = 'awaiting_booking_details';
      } else {
        reply = "No problem. I'm here if you need any 360° tours in the future!";
      }
      break;
    case 'awaiting_booking_details':
      reply = "Thank you! We've recorded your request and an agent will reach out to confirm the shoot shortly.";
      session.step = 'finished';
      // Create booking
      db.execute(`INSERT INTO bookings (lead_id, property_address, status) VALUES (${currentLeadId}, '${message}', 'pending')`);
      break;
    default:
      reply = "I'm here to help with your immersive real estate tours. What can I do for you?";
  }

  // Save session
  if (currentLeadId) {
    const sessionJson = JSON.stringify(session).replace(/'/g, "''");
    const check = db.query(`SELECT id FROM conversations WHERE lead_id = ${currentLeadId}`);
    if (check.length > 0) {
      db.execute(`UPDATE conversations SET session_data = '${sessionJson}', updated_at = CURRENT_TIMESTAMP WHERE lead_id = ${currentLeadId}`);
    } else {
      db.execute(`INSERT INTO conversations (lead_id, session_data) VALUES (${currentLeadId}, '${sessionJson}')`);
    }
  }

  res.json({ success: true, reply, session_data: session, lead_id: currentLeadId, lead_complete });
});

app.get('/api/chat/history/:lead_id', (req, res) => {
  const { lead_id } = req.params;
  const conversations = db.query(`SELECT * FROM conversations WHERE lead_id = ${lead_id} ORDER BY created_at ASC`);
  res.json({ conversations });
});

// --- OUTREACH ---

app.post('/api/outreach', (req, res) => {
  const { lead_id, channel, direction, content } = req.body;
  const sql = `INSERT INTO outreach (lead_id, channel, direction, content, status) 
               VALUES (${lead_id}, '${channel}', '${direction}', '${content.replace(/'/g, "''")}', 'sent')`;
  db.execute(sql);
  const out = db.query(`SELECT * FROM outreach WHERE lead_id = ${lead_id} ORDER BY id DESC LIMIT 1`);
  res.json({ success: true, outreach: out[0] });
});

app.get('/api/outreach/pending', async (req, res) => {
  // 1. Get explicitly pending future outreaches
  const pendingScheduled = db.query("SELECT * FROM outreach WHERE status = 'pending' AND sent_at <= CURRENT_TIMESTAMP");
  
  // 2. Get follow-ups for sent outreaches that haven't received a response (24h, 72h, 7d)
  const activeOutreach = db.query(`
    SELECT * FROM outreach 
    WHERE direction = 'outbound' 
    AND response_received = 0 
    AND status = 'sent'
    AND followup_number < 3
  `);
  
  const now = new Date();
  const followupsNeeded = activeOutreach.filter(o => {
    const sentAt = new Date(o.sent_at);
    const hoursSince = (now - sentAt) / (1000 * 60 * 60);
    
    if (o.followup_number === 0 && hoursSince >= 24) return true;
    if (o.followup_number === 1 && hoursSince >= 72) return true;
    if (o.followup_number === 2 && hoursSince >= 168) return true;
    return false;
  });

  const allPending = [...pendingScheduled, ...followupsNeeded];

  // Trigger actual sending
  for (const item of allPending) {
    const leads = db.query(`SELECT * FROM leads WHERE id = ${item.lead_id}`);
    if (leads.length === 0) continue;
    const lead = leads[0];

    if (item.channel === 'email' && item.direction === 'outbound') {
      await sendEmail({ to: lead.email, subject: 'Follow-up', body: item.content });
    } else if (item.channel === 'sms' && item.direction === 'outbound') {
      await sendSMS({ to: lead.phone, body: item.content });
    }
    // Mark as delivered
    db.execute(`UPDATE outreach SET status = 'delivered' WHERE id = ${item.id}`);
  }

  res.json({ pending: allPending });
});

// --- REVIEWS ---

app.post('/api/reviews/request/:lead_id', (req, res) => {
  const { lead_id } = req.params;
  const reviewMsg = `We'd love to hear your feedback on our latest 360° tour. Please leave us a review here: ${GOOGLE_REVIEW_URL}`;
  
  db.execute(`INSERT INTO outreach (lead_id, channel, direction, content, status) 
               VALUES (${lead_id}, 'email', 'outbound', '${reviewMsg.replace(/'/g, "''")}', 'sent')`);
               
  db.execute(`INSERT INTO reviews (lead_id, google_review_link, asked_at) VALUES (${lead_id}, '${GOOGLE_REVIEW_URL}', CURRENT_TIMESTAMP)`);
  
  const rev = db.query(`SELECT * FROM reviews WHERE lead_id = ${lead_id} ORDER BY id DESC LIMIT 1`);
  res.json({ success: true, review: rev[0] });
});

app.get('/api/reviews/pending', (req, res) => {
  // Leads where booking is completed more than 2 days ago but review hasn't been asked or completed
  const sql = `SELECT DISTINCT l.* FROM leads l 
               JOIN bookings b ON l.id = b.lead_id 
               LEFT JOIN reviews r ON l.id = r.lead_id 
               WHERE b.status = 'completed' 
               AND (r.id IS NULL OR r.completed = 0)
               AND b.created_at <= date('now', '-2 days')`;
  const pending_reviews = db.query(sql);
  res.json({ pending_reviews });
});

app.get('/api/re-engagement/pending', (req, res) => {
  const sql = `
    SELECT DISTINCT l.* FROM leads l
    JOIN bookings b ON l.id = b.lead_id
    WHERE b.status = 'completed'
    AND b.created_at BETWEEN date('now', '-35 days') AND date('now', '-25 days')
    AND l.id NOT IN (
      SELECT lead_id FROM outreach 
      WHERE sent_at > date('now', '-20 days')
    )
  `;
  const pending = db.query(sql);
  res.json({ pending });
});

// --- METRICS ---

app.get('/api/metrics', (req, res) => {
  const totalLeads = db.query("SELECT COUNT(*) as count FROM leads")[0].count;
  const leadsThisWeek = db.query("SELECT COUNT(*) as count FROM leads WHERE created_at > date('now', '-7 days')")[0].count;
  const totalBookings = db.query("SELECT COUNT(*) as count FROM bookings")[0].count;
  const conversionRate = totalLeads > 0 ? (totalBookings / totalLeads) : 0;
  const hotLeads = db.query("SELECT COUNT(*) as count FROM leads WHERE lead_status = 'hot'")[0].count;
  const pendingFollowups = db.query("SELECT COUNT(*) as count FROM outreach WHERE status = 'sent' AND response_received = 0")[0].count;
  
  // Avg listings calculation (using midpoint)
  const leads = db.query("SELECT monthly_listings FROM leads");
  let totalListings = 0;
  leads.forEach(l => {
    if (l.monthly_listings === '15+') totalListings += 20;
    else if (l.monthly_listings === '6-15') totalListings += 10;
    else totalListings += 3;
  });
  const avgListings = leads.length > 0 ? (totalListings / leads.length) : 0;

  res.json({
    total_leads: totalLeads,
    leads_this_week: leadsThisWeek,
    conversion_rate: (conversionRate * 100).toFixed(2) + '%',
    hot_leads: hotLeads,
    pending_followups: pendingFollowups,
    avg_listings_per_lead: avgListings.toFixed(1)
  });
});

app.listen(PORT, '0.0.0.0', async () => {
  // Initialize database if not already done
  try {
    await db.initDb();
    console.log('Database ready');
  } catch (err) {
    console.error('Database init error:', err.message);
  }
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
