const SMS_ENABLED = process.env.SMS_ENABLED === 'true' || false;

async function sendSMS({ to, body }) {
  if (SMS_ENABLED && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({ body, from: process.env.TWILIO_PHONE, to });
  } else {
    console.log(`[SMS] To: ${to} | Body: ${body.substring(0, 100)}...`);
  }
  return { success: true, to };
}

module.exports = { sendSMS };
