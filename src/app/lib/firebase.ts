import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCuQxiBc8yc0zqkzTTG5ZV52PbIF5TDeKA",
  authDomain: "app-server-eb64d.firebaseapp.com",
  databaseURL: "https://app-server-eb64d-default-rtdb.firebaseio.com",
  projectId: "app-server-eb64d",
  storageBucket: "app-server-eb64d.appspot.com",
  messagingSenderId: "311789081160",
  appId: "1:311789081160:web:a615f64b226342f8c77e7d",
  measurementId: "G-941MTLETPW"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };

