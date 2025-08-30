// Firebase Admin SDK for Node.js backend
const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGfSHPIG57haXlEPtrktt4l2n_iu0i_Ss",
  authDomain: "achieveit-deb9a.firebaseapp.com",
  databaseURL: "https://achieveit-deb9a-default-rtdb.firebaseio.com", // Add your Realtime Database URL here
  projectId: "achieveit-deb9a",
  storageBucket: "achieveit-deb9a.firebasestorage.app",
  messagingSenderId: "818265844402",
  appId: "1:818265844402:web:20d55a10af77ab91b937ab",
  measurementId: "G-RKRGW63GV2"
};

// Initialize Firebase Admin SDK
const app = initializeApp({
  credential: applicationDefault(),
  databaseURL: firebaseConfig.databaseURL,
  ...firebaseConfig
});

const db = getDatabase();

module.exports = { app, db }; 