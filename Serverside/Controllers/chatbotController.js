const OpenAI = require('openai');
const ChatHistory = require('../Models/chatHistoryModel');

// Add logging
console.log('OpenAI API Key available:', !!process.env.OPENAI_API_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30000
});

const doctorMapping = {
  "skin": "Dr. Mehta ",
  "fever": "Dr. Singh ",
  "throat": "Dr. Sharma ",
  "depression": "Dr. Rao ",
  "chest": "Dr. Banerjee "
};

exports.chatWithBot = async (req, res) => {
  const { message, userId } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key is not configured');
    return res.status(500).json({ error: 'OpenAI API key is not configured' });
  }

  try {
    console.log('Processing message:', message);
    const prompt = `A patient says: "${message}". Identify possible conditions and suggest the appropriate type of doctor (just the specialty keyword like skin, throat, etc.).`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a healthcare assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    const botReply = response.choices[0].message.content;
    console.log('OpenAI response:', botReply);

    let suggestedDoctor = "Dr. Singh ";
    for (const keyword in doctorMapping) {
      if (message.toLowerCase().includes(keyword)) {
        suggestedDoctor = doctorMapping[keyword];
        break;
      }
    }

    const chat = await ChatHistory.findOne({ userId });
    const messageObj = [
      { sender: "user", text: message },
      { sender: "bot", text: botReply }
    ];

    if (chat) {
      chat.messages.push(...messageObj);
      await chat.save();
    } else {
      await ChatHistory.create({ userId, messages: messageObj });
    }

    res.json({ reply: botReply, suggestedDoctor });
  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      error: 'Chatbot failed', 
      details: error.message,
      type: error.type || 'unknown'
    });
  }
};
