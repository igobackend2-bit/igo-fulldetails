/**
 * IGO Groups — Contact Form Mailer
 * Google Apps Script (deploy as Web App)
 *
 * HOW TO DEPLOY (do this once):
 * 1. Go to https://script.google.com  (sign in as igobackend3@gmail.com)
 * 2. Click "New project"
 * 3. Delete the default code, paste ALL of this file's contents
 * 4. Click the floppy-disk icon to Save  (name it "IGO Contact Mailer")
 * 5. Click Deploy → "New deployment"
 * 6. Click the gear icon next to "Select type" → choose "Web app"
 * 7. Set:
 *      Description       : IGO Groups contact form
 *      Execute as        : Me  (igobackend3@gmail.com)
 *      Who has access    : Anyone
 * 8. Click "Deploy"
 * 9. Authorise the permissions when prompted (allow Gmail access)
 * 10. Copy the Web app URL  →  looks like:
 *       https://script.google.com/macros/s/AKfycb.../exec
 * 11. Open contact.html and careers.html and replace  PASTE_YOUR_APPS_SCRIPT_URL_HERE  with that URL
 * 12. Done — the live contact form and careers "Apply Now" form will now email the right inbox.
 *
 * NOTE: Every time you edit this script you must create a NEW deployment
 * (Deploy → New deployment) to get an updated URL.
 */

// ── Department routing ─────────────────────────────────────────────────────
var DEPT_TO_EMAIL = {
  'sales':   'bd2@igogroups.com',
  'hr':      'hr.admin@igogroups.com',
  'support': 'bd2@igogroups.com',
  'other':   'bd2@igogroups.com'
};

var DEPT_LABEL = {
  'sales':   'Sales & Trade',
  'hr':      'Careers & HR',
  'support': 'Customer Support',
  'other':   'General Inquiry'
};

// ── Handle POST (form submission) ──────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Career application submissions (from the careers.html "Apply Now" modal)
    // are identified by the presence of a "position" field.
    if (data.position) {
      return handleCareerApplication(data);
    }

    var name    = (data.name    || '').trim();
    var email   = (data.email   || '').trim();
    var dept    = (data.department || '').trim();
    var message = (data.message || '').trim();

    if (!name || !email || !dept || !message) {
      return jsonResponse({ok: false, error: 'Missing required fields.'});
    }

    var toEmail   = DEPT_TO_EMAIL[dept] || 'bd2@igogroups.com';
    var deptLabel = DEPT_LABEL[dept]    || dept;

    // 1. Email to the correct department inbox
    MailApp.sendEmail({
      to:      toEmail,
      replyTo: email,
      subject: 'IGO Groups Enquiry – ' + deptLabel + ' from ' + name,
      body: [
        'New enquiry received from the IGO Groups website:',
        '',
        'Name       : ' + name,
        'Email      : ' + email,
        'Department : ' + deptLabel,
        '',
        'Message:',
        message,
        '',
        '────────────────────',
        'Reply directly to: ' + email
      ].join('\n')
    });

    // 2. Auto-reply confirmation to the customer
    MailApp.sendEmail({
      to:      email,
      subject: 'Thank you for contacting IGO Groups',
      body: [
        'Dear ' + name + ',',
        '',
        'Thank you for reaching out to IGO Groups.',
        'We have received your message and our team will respond within one business day.',
        '',
        'Best regards,',
        'IGO Groups Team',
        'bd2@igogroups.com  |  +91 73977 89803',
        'www.igogroups.com'
      ].join('\n')
    });

    return jsonResponse({ok: true});

  } catch (err) {
    return jsonResponse({ok: false, error: err.message});
  }
}

// ── Career application handler (careers.html "Apply Now" form) ────────────
function handleCareerApplication(data) {
  var name       = (data.name       || '').trim();
  var email      = (data.email      || '').trim();
  var phone      = (data.phone      || '').trim();
  var experience = (data.experience || '').trim();
  var position   = (data.position   || '').trim();

  if (!name || !email || !position) {
    return jsonResponse({ok: false, error: 'Missing required fields.'});
  }

  var HR_EMAIL = 'hr.admin@igogroups.com';

  // 1. Email to HR with the applicant's details
  MailApp.sendEmail({
    to:      HR_EMAIL,
    replyTo: email,
    subject: 'IGO Groups Job Application – ' + position + ' – ' + name,
    body: [
      'New job application received from the IGO Groups careers page:',
      '',
      'Position   : ' + position,
      'Name       : ' + name,
      'Email      : ' + email,
      'Phone      : ' + (phone || 'Not provided'),
      'Experience : ' + (experience || 'Not provided'),
      '',
      '────────────────────',
      'Reply directly to: ' + email
    ].join('\n')
  });

  // 2. Auto-reply confirmation to the applicant
  MailApp.sendEmail({
    to:      email,
    subject: 'Thank you for applying to IGO Groups',
    body: [
      'Dear ' + name + ',',
      '',
      'Thank you for applying for the ' + position + ' role at IGO Groups.',
      'Our HR team has received your application and will review it shortly. If shortlisted, we will reach out within a few business days.',
      '',
      'Best regards,',
      'IGO Groups HR Team',
      'hr.admin@igogroups.com',
      'www.igogroups.com'
    ].join('\n')
  });

  return jsonResponse({ok: true});
}

// ── Health check (GET) ─────────────────────────────────────────────────────
function doGet() {
  return ContentService.createTextOutput('IGO Groups email service is active.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ── Helper ─────────────────────────────────────────────────────────────────
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
