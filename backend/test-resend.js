const fetch = require('node-fetch');

async function testResendAPI() {
  const apiKey = 're_je49z9Kb_GmUk85djyoy7GVPtGDC19g8q';
  
  console.log('Testing Resend API key...');
  
  try {
    // First, let's test if we can get domains
    const domainsResponse = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    console.log('Domains response status:', domainsResponse.status);
    
    if (domainsResponse.ok) {
      const domains = await domainsResponse.json();
      console.log('Available domains:', domains);
    } else {
      const error = await domainsResponse.json();
      console.log('Domains error:', error);
    }
    
    // Now test sending an email
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: 'onboarding@resend.dev', // Use Resend's default domain
        to: ['test@example.com'],
        subject: 'Test Email',
        html: '<p>This is a test email</p>'
      })
    });
    
    console.log('Email response status:', emailResponse.status);
    
    if (emailResponse.ok) {
      const data = await emailResponse.json();
      console.log('Email sent successfully:', data);
    } else {
      const error = await emailResponse.json();
      console.log('Email error:', error);
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testResendAPI(); 