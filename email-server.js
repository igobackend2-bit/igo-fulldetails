/**
 * IGO Groups — Contact Form Email Server
 * Uses Gmail SMTP + Google App Password to send department-routed emails.
 *
 * SETUP (one-time):
 *   npm install express nodemailer cors
 *
 * RUN:
 *   node email-server.js
 *
 * Keep this terminal open while the site is running.
 * The contact form at contact.html will POST to http://localhost:3001/contact
 */

const express   = require('express');
const nodemailer = require('nodemailer');
const cors      = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ── Gmail credentials ──────────────────────────────────────────────────────
const GMAIL_USER = 'igobackend3@gmail.com';
const GMAIL_PASS = 'vmdaiupxtaobrjfn';   // Google App Password (spaces removed)

// ── Department routing ─────────────────────────────────────────────────────
const DEPT_TO_EMAIL = {
  sales:   'bd2@igogroups.com',
  hr:      'hr.admin@igogroups.com',
  support: 'bd2@igogroups.com',
  other:   'bd2@igogroups.com'
};

const DEPT_LABEL = {
  sales:   'Sales & Trade',
  hr:      'Careers & HR',
  support: 'Customer Support',
  other:   'General Inquiry'
};

// ── Nodemailer transporter ─────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: GMAIL_USER, pass: GMAIL_PASS }
});

// ── POST /contact ──────────────────────────────────────────────────────────
app.post('/contact', async (req, res) => {
  const { name, email, department, message } = req.body || {};

  if (!name || !email || !department || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const toEmail   = DEPT_TO_EMAIL[department] || 'bd2@igogroups.com';
  const deptLabel = DEPT_LABEL[department]    || department;

  try {
    // 1. Email to the department inbox
    await transporter.sendMail({
      from:    `"IGO Groups Website" <${GMAIL_USER}>`,
      to:      toEmail,
      replyTo: email,
      subject: `IGO Groups Enquiry – ${deptLabel} from ${name}`,
      text: [
        'New enquiry received from the IGO Groups website:',
        '',
        `Name       : ${name}`,
        `Email      : ${email}`,
        `Department : ${deptLabel}`,
        '',
        'Message:',
        message,
        '',
        '──────────────────────────────────',
        `Reply directly to: ${email}`
      ].join('\n')
    });

    // 2. Auto-reply confirmation to the customer
    await transporter.sendMail({
      from:    '"IGO Groups" <igobackend3@gmail.com>',
      to:      email,
      subject: 'Thank you for contacting IGO Groups',
      text: [
        `Dear ${name},`,
        '',
        'Thank you for reaching out to IGO Groups.',
        'We have received your message and our team will get back to you within one business day.',
        '',
        'Best regards,',
        'IGO Groups Team',
        'bd2@igogroups.com  |  +91 73977 89803',
        'www.igogroups.com'
      ].join('\n')
    });

    console.log(`[${new Date().toISOString()}] Mail sent → ${toEmail} | from: ${email} | dept: ${deptLabel}`);
    res.json({ ok: true });

  } catch (err) {
    console.error('Email send error:', err.message);
    res.status(500).json({ error: 'Failed to send email. Please try again.' });
  }
});

// ── Health check ───────────────────────────────────────────────────────────
app.get('/', (req, res) => res.send('IGO Groups email server is running.'));

app.listen(3001, () => {
  console.log('──────────────────────────────────────────');
  console.log('  IGO Groups email server');
  console.log('  Listening on http://localhost:3001');
  console.log('  POST /contact  →  routes to department inbox');
  console.log('──────────────────────────────────────────');
});
