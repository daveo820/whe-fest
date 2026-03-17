export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body || {};

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRe.test(String(email).trim())) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  const cleanEmail = String(email).trim().slice(0, 254);

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
        subject: 'New Interest Sign-Up — WHE Fest 2026',
        html: `
          <h2>New Email Sign-Up</h2>
          <p><strong>Email:</strong> ${cleanEmail}</p>
          <p><em>Submitted via whefest.org interest form.</em></p>
        `,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('Resend error:', body);
      return res.status(500).json({ error: 'Failed to send notification.' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Newsletter handler error:', err);
    return res.status(500).json({ error: 'Server error.' });
  }
}
