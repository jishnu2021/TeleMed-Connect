const OpenAI = require('openai');
const ChatHistory = require('../models/chatHistoryModel');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const doctorMapping = {
  "skin": "Dr. Mehta (Dermatologist)",
  "fever": "Dr. Singh (General Physician)",
  "throat": "Dr. Sharma (ENT Specialist)",
  "depression": "Dr. Rao (Psychiatrist)",
  "chest": "Dr. Banerjee (Cardiologist)"
};

exports.chatWithBot = async (req, res) => {
  const { message, userId } = req.body;

  try {
    const prompt = `A patient says: "${message}". Identify possible conditions and suggest the appropriate type of doctor (just the specialty keyword like skin, throat, etc.).`;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a healthcare assistant." },
        { role: "user", content: prompt }
      ]
    });

    const botReply = response.choices[0].message.content;

    let suggestedDoctor = "Dr. Singh (General Physician)";
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
    res.status(500).json({ error: 'Chatbot failed', details: error.message });
  }
};
