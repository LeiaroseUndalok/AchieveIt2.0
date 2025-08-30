// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGfSHPIG57haXlEPtrktt4l2n_iu0i_Ss",
  authDomain: "achieveit-deb9a.firebaseapp.com",
  projectId: "achieveit-deb9a",
  storageBucket: "achieveit-deb9a.firebasestorage.app",
  messagingSenderId: "818265844402",
  appId: "1:818265844402:web:20d55a10af77ab91b937ab",
  measurementId: "G-RKRGW63GV2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };