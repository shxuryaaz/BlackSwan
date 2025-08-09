const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  console.log('Received email request:', { 
    to: req.body.to, 
    subject: req.body.subject, 
    from: req.body.from,
    hasApiKey: !!req.body.apiKey 
  });
  
  try {
    const { to, subject, content, from, apiKey } = req.body;

    // Validate required fields
    if (!to || !subject || !content || !apiKey) {
      console.log('Missing fields:', { to: !!to, subject: !!subject, content: !!content, apiKey: !!apiKey });
      return res.status(400).json({ 
        error: 'Missing required fields: to, subject, content, apiKey' 
      });
    }

    console.log('Sending email to Resend API...');
    
    // Send email via Resend API
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        from: from || 'onboarding@resend.dev',
        to: [to],
        subject: subject,
        html: content
      })
    });

    console.log('Resend API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Resend API error:', errorData);
      return res.status(response.status).json({ 
        error: `Failed to send email: ${errorData.message || response.statusText}` 
      });
    }

    const data = await response.json();
    console.log('Email sent successfully:', data.id);
    res.json({ success: true, messageId: data.id });

  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ 
      error: `Internal server error: ${error.message}` 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  console.log('Health check requested');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  console.log('Test endpoint hit');
  res.json({ message: 'Backend server is running!' });
});

app.listen(PORT, () => {
  console.log(`Email server running on port ${PORT}`);
}); 