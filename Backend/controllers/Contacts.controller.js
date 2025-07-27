const ContactsModel = require('../models/Contacts.model');

// Add a contact
const addContact = async (req, res) => {
  try {
    const { Username, Email, Phone_Number } = req.body;

    if (!Username || !Email || !Phone_Number) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const newContact = new ContactsModel({ Username, Email, Phone_Number });
    const saved = await newContact.save();

    res.json({
      success: true,
      contact: {
        Username: saved.Username,
        Email: saved.Email,
        Phone_Number: saved.Phone_Number,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update a contact by Email
const updateContact = async (req, res) => {
  try {
    const { Username, Email, Phone_Number } = req.body;

    if (!Username || !Email || !Phone_Number) {
      return res.json({ success: false, message: "Missing Details" });
    }

    const updated = await ContactsModel.findOneAndUpdate(
      { Email },
      { $set: { Username, Phone_Number } },
      { new: true }
    );

    if (!updated) {
      return res.json({ success: false, message: "Contact not found" });
    }

    res.json({
      success: true,
      contact: {
        Username: updated.Username,
        Email: updated.Email,
        Phone_Number: updated.Phone_Number,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Read all contacts
const readContacts = async (req, res) => {
  try {
    const contacts = await ContactsModel.find();
    res.json({ success: true, contacts });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete a contact by Email
const deleteContact = async (req, res) => {
  try {
    const { Email } = req.body;

    if (!Email) {
      return res.json({ success: false, message: "Missing Email" });
    }

    const deleted = await ContactsModel.findOneAndDelete({ Email });

    if (!deleted) {
      return res.json({ success: false, message: "Contact not found" });
    }

    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

module.exports = {
  addContact,
  updateContact,
  readContacts,
  deleteContact,
};
