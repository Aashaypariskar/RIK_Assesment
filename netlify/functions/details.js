export const handler = async (event, context) => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    // Extract submitted fields directly WITHOUT any validation
    const name = data.name !== undefined && data.name !== null ? String(data.name) : '';
    const mobile = data.mobile !== undefined && data.mobile !== null ? String(data.mobile) : '';
    const age = data.age !== undefined && data.age !== null ? String(data.age) : '';

    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_EMAIL;

    if (!apiKey) {
      console.error('Missing RESEND_API_KEY environment variable.');
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Server configuration error: RESEND_API_KEY missing.' })
      };
    }

    if (!recipient) {
      console.error('Missing CONTACT_EMAIL environment variable.');
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Server configuration error: CONTACT_EMAIL missing.' })
      };
    }

    const emailContent = `New form submission:\n\nName: ${name}\nMobile Number: ${mobile}\nAge: ${age}`;

    // Call Resend API to dispatch email
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Form Details <onboarding@resend.dev>',
        to: [recipient],
        subject: 'New Details Submission',
        text: emailContent
      })
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error('Resend API returned error:', resendData);
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: resendData.message || 'Failed to send email via Resend API.'
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Details submitted successfully.'
      })
    };
  } catch (err) {
    console.error('Server function error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
