const mongoose = require('mongoose');

const ContactsSchema = new mongoose.Schema({
  Username: {
    type: String,
    required: true
  },
  Phone_Number: {
    type: Number,
  },
  Email: {
    type: String
  }
});





const ContactsModel = mongoose.model('Contacts', ContactsSchema);
module.exports = ContactsModel;