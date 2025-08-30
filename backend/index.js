require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // For Firestore DB URL, add databaseURL: process.env.FIREBASE_DATABASE_URL if needed
  });
}
const db = admin.firestore();

// Sample health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running!' });
});

// TODO: Add more endpoints for tasks, notes, calendar, etc.

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 