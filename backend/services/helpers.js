function formatLeadNotification(lead) {
  const track = lead.has_website ? 'Website Track (Embeddable Photos)' : 'Zillow/MLS Track (File Delivery)';
  return `
New Lead from ImmersiveEstates
━━━━━━━━━━━━━━━━━━━━━━━
Name: ${lead.name}
Brokerage: ${lead.brokerage}
Email: ${lead.email || 'N/A'}
Phone: ${lead.phone || 'N/A'}
Listings/Month: ${lead.monthly_listings}
Track: ${track}
Qualification: ${lead.qualification || lead.lead_status}
━━━━━━━━━━━━━━━━━━━━━━━
`.trim();
}

function calculateEndTime(date, time) {
  // Add 2 hours to start time for a standard shoot
  const [hours, minutes] = time.split(':').map(Number);
  const endHours = hours + 2;
  return `${date}T${String(endHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
}

module.exports = { formatLeadNotification, calculateEndTime };
