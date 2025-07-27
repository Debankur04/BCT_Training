const express = require('express');
const {
  addContact,
  updateContact,
  readContacts,
  deleteContact
} = require('../controllers/Contacts.controller');

const router = express.Router();

router.post('/add', addContact);
router.put('/update', updateContact);
router.get('/all', readContacts);
router.delete('/delete', deleteContact);

module.exports = router;
