

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAjQ7ezeCAE9v19wcY4ma3cHeAIE3uoNq4",
  authDomain: "simulado-proderj.firebaseapp.com",
  projectId: "simulado-proderj",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
