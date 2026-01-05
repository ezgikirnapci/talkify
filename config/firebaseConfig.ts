import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
// You can get this from the Firebase Console: Project Settings -> General -> Your apps -> SDK setup and configuration
const firebaseConfig = {
    apiKey: "AIzaSyDF7YkJ3BKF2DQI9TA1QRHIJilw6rVPDvs",
    authDomain: "talkify-6e1cf.firebaseapp.com",
    projectId: "talkify-6e1cf",
    storageBucket: "talkify-6e1cf.firebasestorage.app",
    messagingSenderId: "182994874050",
    appId: "1:182994874050:web:c354061cca04338c28d55b",
    measurementId: "G-CES1WSE4M8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

export const db = getFirestore(app);

export { auth };

