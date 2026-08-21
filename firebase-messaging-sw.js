importScripts("https://www.gstatic.com/firebasejs/12.18.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCZ2DeodRJdACy0UNwzQJVBE2aX1nGS3VE",
  authDomain: "emocouple-5e479.firebaseapp.com",
  projectId: "emocouple-5e479",
  storageBucket: "emocouple-5e479.firebasestorage.app",
  messagingSenderId: "882192100921",
  appId: "1:882192100921:web:109da207f183de34f067e8"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle =
    payload.notification?.title || "Couple Signals 💗";

  const notificationOptions = {
    body: payload.notification?.body || "You received a message 💌",
    icon: "/icon.png"
  };

  self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});