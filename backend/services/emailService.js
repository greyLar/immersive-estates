// Email Service — logs to console by default, ready for SendGrid/Mailgun integration
const EMAIL_ENABLED = process.env.EMAIL_ENABLED === 'true' || false;

async function sendEmail({ to, subject, body }) {
  const msg = {
    to,
    subject,
    text: body,
    from: process.env.EMAIL_FROM || 'hello@immersive-estates.com'
  };
  
  if (EMAIL_ENABLED && process.env.SENDGRID_API_KEY) {
    // Using SendGrid
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send(msg);
  } else {
    // Development mode - log
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
    console.log(`[EMAIL] Body: ${body.substring(0, 100)}...`);
  }
  
  return { success: true, to, subject };
}

module.exports = { sendEmail };
