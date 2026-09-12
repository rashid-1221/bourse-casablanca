// firebase-config.js — Config du projet Firebase dédié "Bourse de Casablanca"
// Valeurs à récupérer sur https://console.firebase.google.com
// → Project settings → General → Your apps → Web app (icône </>)
// Ces valeurs ne sont pas secrètes : la sécurité est assurée par les règles Firestore (firestore.rules).

const firebaseConfig = {
  apiKey: "AIzaSyDVws1wsaRr0OW2fs15zEKvjMon2akZYGk",
  authDomain: "bourse-de-casablanca-75495.firebaseapp.com",
  projectId: "bourse-de-casablanca-75495",
  storageBucket: "bourse-de-casablanca-75495.firebasestorage.app",
  messagingSenderId: "889659467522",
  appId: "1:889659467522:web:a5eba669f6e288f1e3c41b",
  measurementId: "G-WGTLEYNWQ3",
};

firebase.initializeApp(firebaseConfig);
