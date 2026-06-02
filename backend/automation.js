const db = require('./db');

function handleBookingCompleted(bookingId) {
  console.log(`[Automation] Triggering follow-up for booking ${bookingId}`);
  const bookings = db.query(`SELECT * FROM bookings WHERE id = ${bookingId}`);
  if (bookings.length === 0) {
    console.log(`[Automation] Booking ${bookingId} not found`);
    return;
  }
  const booking = bookings[0];
  const leadId = booking.lead_id;

  const leads = db.query(`SELECT * FROM leads WHERE id = ${leadId}`);
  if (leads.length === 0) {
    console.log(`[Automation] Lead ${leadId} not found`);
    return;
  }
  const lead = leads[0];
  const address = booking.property_address || 'your property';

  // 1. Confirmation message (Immediate)
  const confirmMsg = `Your 360° tour for ${address} is ready! We hope you love the results.`;
  db.execute(`INSERT INTO outreach (lead_id, channel, direction, content, status) 
               VALUES (${leadId}, 'email', 'outbound', '${confirmMsg.replace(/'/g, "''")}', 'sent')`);
  console.log(`[Automation] Sent confirmation for booking ${bookingId}`);

  // 2. Ask about next listing (Immediate)
  const nextListingMsg = `Do you have any other upcoming listings that could use an immersive tour? We'd love to help you sell them faster.`;
  db.execute(`INSERT INTO outreach (lead_id, channel, direction, content, status) 
               VALUES (${leadId}, 'email', 'outbound', '${nextListingMsg.replace(/'/g, "''")}', 'sent')`);
  console.log(`[Automation] Sent next-listing inquiry for lead ${leadId}`);

  // 3. 30-day re-engagement (Scheduled)
  const reengageDate = new Date();
  reengageDate.setDate(reengageDate.getDate() + 30);
  const reengageDateStr = reengageDate.toISOString().replace('T', ' ').substring(0, 19);
  const reengageMsg = `It's been 30 days since our last shoot. Any new properties coming up? We're ready when you are!`;
  db.execute(`INSERT INTO outreach (lead_id, channel, direction, content, sent_at, status) 
               VALUES (${leadId}, 'email', 'outbound', '${reengageMsg.replace(/'/g, "''")}', '${reengageDateStr}', 'pending')`);
  console.log(`[Automation] Scheduled 30-day re-engagement for lead ${leadId}`);

  // 4. Google review request (Immediate)
  const reviewLink = process.env.GOOGLE_REVIEW_URL || "https://g.page/immersive-estates/review";
  db.execute(`INSERT INTO reviews (lead_id, google_review_link) VALUES (${leadId}, '${reviewLink}')`);
  
  const reviewMsg = `We'd love your feedback on the 360° tour for ${address}. Please leave us a review here: ${reviewLink}`;
  db.execute(`INSERT INTO outreach (lead_id, channel, direction, content, status) 
               VALUES (${leadId}, 'email', 'outbound', '${reviewMsg.replace(/'/g, "''")}', 'sent')`);
  console.log(`[Automation] Sent review request for lead ${leadId}`);
  
  console.log(`[Automation] Completed all triggers for booking ${bookingId}`);
}

module.exports = { handleBookingCompleted };