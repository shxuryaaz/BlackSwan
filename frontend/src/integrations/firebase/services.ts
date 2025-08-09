import { getApiSettings } from './database';

// OpenAI Service for AI-powered messages
export const generateAIMessage = async (userId: string, customerData: any, tone: string = 'professional') => {
  const settings = await getApiSettings(userId);
  if (!settings?.openai_api_key) {
    throw new Error('OpenAI API key not configured');
  }

  const prompt = `Generate a ${tone} payment reminder message for a customer named ${customerData.name} who owes $${customerData.amount_due} due on ${customerData.due_date}. Keep it professional but ${tone}.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.openai_api_key}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a professional financial assistant helping with payment reminders.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    throw new Error('Failed to generate AI message');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Resend Service for Email
export const sendEmail = async (userId: string, to: string, subject: string, content: string) => {
  const settings = await getApiSettings(userId);
  if (!settings?.resend_api_key) {
    throw new Error('Resend API key not configured');
  }

  // Use backend server to avoid CORS issues
  const apiUrl = 'http://localhost:3002/api/send-email';
  const requestBody = {
    to: to,
    subject: subject,
    content: content,
    from: settings.from_email || 'onboarding@resend.dev',
    apiKey: settings.resend_api_key
  };
  const headers = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to send email: ${errorData.error || errorData.message || response.statusText}`);
  }

  const data = await response.json();
  return { success: true, messageId: data.messageId || data.id };
};

// Twilio Service for WhatsApp and Voice
export const sendWhatsApp = async (userId: string, to: string, message: string) => {
  const settings = await getApiSettings(userId);
  if (!settings?.twilio_account_sid || !settings?.twilio_auth_token || !settings?.twilio_phone_number) {
    throw new Error('Twilio credentials not configured');
  }

  const auth = btoa(`${settings.twilio_account_sid}:${settings.twilio_auth_token}`);
  
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${settings.twilio_account_sid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`
    },
    body: new URLSearchParams({
      From: `whatsapp:${settings.twilio_phone_number}`,
      To: `whatsapp:${to}`,
      Body: message
    })
  });

  if (!response.ok) {
    throw new Error('Failed to send WhatsApp message');
  }

  const data = await response.json();
  return { success: true, messageId: data.sid };
};

export const makeVoiceCall = async (userId: string, to: string, message: string) => {
  const settings = await getApiSettings(userId);
  if (!settings?.twilio_account_sid || !settings?.twilio_auth_token || !settings?.twilio_phone_number) {
    throw new Error('Twilio credentials not configured');
  }

  const auth = btoa(`${settings.twilio_account_sid}:${settings.twilio_auth_token}`);
  
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${settings.twilio_account_sid}/Calls.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`
    },
    body: new URLSearchParams({
      From: settings.twilio_phone_number,
      To: to,
      Twiml: `<Response><Say>${message}</Say></Response>`
    })
  });

  if (!response.ok) {
    throw new Error('Failed to make voice call');
  }

  const data = await response.json();
  return { success: true, callId: data.sid };
};

// Send reminder through multiple channels
export const sendReminder = async (userId: string, customer: any, channels: string[], tone: string = 'professional') => {
  const results = [];
  
  // Generate AI message
  const aiMessage = await generateAIMessage(userId, customer, tone);
  
  for (const channel of channels) {
    try {
      switch (channel) {
        case 'email':
          const emailResult = await sendEmail(
            userId,
            customer.email,
            `Payment Reminder - ${customer.name}`,
            aiMessage
          );
          results.push({ channel: 'email', success: true, result: emailResult });
          break;
          
        case 'whatsapp':
          const whatsappResult = await sendWhatsApp(userId, customer.phone, aiMessage);
          results.push({ channel: 'whatsapp', success: true, result: whatsappResult });
          break;
          
        case 'voice':
          const voiceResult = await makeVoiceCall(userId, customer.phone, aiMessage);
          results.push({ channel: 'voice', success: true, result: voiceResult });
          break;
          
        default:
          results.push({ channel, success: false, error: 'Unsupported channel' });
      }
    } catch (error) {
      results.push({ channel, success: false, error: error.message });
    }
  }
  
  return results;
}; 