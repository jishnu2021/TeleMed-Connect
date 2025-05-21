const OpenAI = require('openai');
const ChatHistory = require('../Models/chatHistoryModel');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
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
    res.status(500).json({ error: 'Chatbot failed', details: error.message });
  }
};
