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

    const resendApiKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL || 'aashaypariskar1605@gmail.com';

    const emailContent = `New form submission:\n\nName: ${name}\nMobile Number: ${mobile}\nAge: ${age}`;

    console.log('Received submission:', { name, mobile, age });

    // If Resend API key is configured, send the actual email via Resend API
    if (resendApiKey) {
      const resendResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'Form Details <onboarding@resend.dev>',
          to: [contactEmail],
          subject: 'New Details Submission',
          text: emailContent
        })
      });

      const resendData = await resendResponse.json();

      if (!resendResponse.ok) {
        console.error('Resend API error:', resendData);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: 'Failed to send email via Resend API' })
        };
      }
    } else {
      console.warn('RESEND_API_KEY is not set. Logged submission locally.');
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
