export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { orgName, contactName, email, message } = req.body || {};

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dangerRe = /<|>|javascript:|data:/i;

  if (!orgName || typeof orgName !== 'string' || orgName.trim().length === 0 || orgName.trim().length > 120 || dangerRe.test(orgName)) {
    return res.status(400).json({ error: 'Invalid organization name.' });
  }
  if (!contactName || typeof contactName !== 'string' || contactName.trim().length === 0 || contactName.trim().length > 80 || dangerRe.test(contactName)) {
    return res.status(400).json({ error: 'Invalid contact name.' });
  }
  if (!email || !emailRe.test(String(email).trim())) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }
  if (message && String(message).length > 1200) {
    return res.status(400).json({ error: 'Message too long.' });
  }

  const cleanOrg     = orgName.trim().slice(0, 120);
  const cleanContact = contactName.trim().slice(0, 80);
  const cleanEmail   = String(email).trim().slice(0, 254);
  const cleanMessage = message ? String(message).trim().slice(0, 1200) : '(no message)';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'WHE Fest <noreply@whefest.org>',
        to: process.env.CONTACT_EMAIL || 'info@whefest.org',
        subject: 'New Sponsor Inquiry — WHE Fest 2026',
        html: `
          <h2>New Sponsor Inquiry</h2>
          <p><strong>Organization:</strong> ${cleanOrg}</p>
          <p><strong>Contact:</strong> ${cleanContact}</p>
          <p><strong>Email:</strong> ${cleanEmail}</p>
          <p><strong>Message:</strong><br>${cleanMessage.replace(/\n/g, '<br>')}</p>
          <p><em>Submitted via whefest.org sponsor inquiry form.</em></p>
        `,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Resend error:', body);
      return res.status(500).json({ error: 'Failed to send inquiry.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Inquiry handler error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}
