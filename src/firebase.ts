import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCV_g0o6RcXAlM8aDZ25UQ89MeAjjm_LB4",
  authDomain: "gen-lang-client-0958303804.firebaseapp.com",
  projectId: "gen-lang-client-0958303804",
  storageBucket: "gen-lang-client-0958303804.firebasestorage.app",
  messagingSenderId: "998627175913",
  appId: "1:998627175913:web:98d09e38ab0379c6a8ef78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with custom database ID
export const db = getFirestore(app, "ai-studio-raceboy-4fec02b3-b19e-45d3-bd29-40f2dbb70fbd");
