const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbFilePath = path.join(__dirname, 'db.json');

// Endpoint to get all notes
router.get('/api/notes', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// Endpoint to save a new note
router.post('/api/notes', (req, res) => {
  const newNote = req.body;

  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }

    const notes = JSON.parse(data);
    newNote.id = Date.now().toString();
    notes.push(newNote);

    fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
      }

      res.json(newNote);
    });
  });
});

// Endpoint to delete a note by ID
router.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server Error' });
    }

    let notes = JSON.parse(data);
    notes = notes.filter((note) => note.id !== noteId);

    fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Server Error' });
      }

      res.json({ message: 'Note deleted successfully' });
    });
  });
});

module.exports = router;
