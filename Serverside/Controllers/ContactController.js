// controllers/ContactController.js
const Contact =require("../Models/Contact");

exports.createContact = async (req, res) => {
  try {
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json({ message: "Contact message saved successfully." });
  } catch (error) {
    console.error("Contact submission failed:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

 exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find(); // Fetch all contacts
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};
