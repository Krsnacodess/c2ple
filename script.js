console.log("🔥 C2ple script.js loaded!");
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";

import {
  getMessaging,
  getToken
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-messaging.js";

import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyCZ2DeodRJdACy0UNwzQJVBE2aX1nGS3VE",
  authDomain: "emocouple-5e479.firebaseapp.com",
  projectId: "emocouple-5e479",
  storageBucket: "emocouple-5e479.firebasestorage.app",
  messagingSenderId: "882192100921",
  appId: "1:882192100921:web:109da207f183de34f067e8"
};


// ===============================
// FIREBASE INITIALIZATION
// ===============================

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

const auth = getAuth(app);


// ===============================
// ANONYMOUS AUTHENTICATION
// ===============================

signInAnonymously(auth)
  .then(() => {
    console.log("✅ Anonymous authentication started.");
  })
  .catch((error) => {
    console.error("❌ Anonymous authentication failed:", error);
  });


// Watch authentication state
onAuthStateChanged(auth, (user) => {

  if (user) {

    console.log("✅ User authenticated!");
    console.log("Firebase UID:", user.uid);

  } else {

    console.log("❌ No authenticated user.");

  }

});


// ===============================
// NOTIFICATION ELEMENTS
// ===============================

const button = document.getElementById("enableNotifications");
const status = document.getElementById("status");


// ===============================
// NOTIFICATION SETUP
// ===============================

button.addEventListener("click", async () => {

  try {

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {

      status.textContent =
        "🔕 Notification permission denied.";

      return;
    }


    const registration =
      await navigator.serviceWorker.register(
        "./firebase-messaging-sw.js"
      );


    const token = await getToken(messaging, {

      vapidKey:
        "BM5-24JpOOP60Ss-ZVeX805zi_87A5PvCcdesAVounHz0qwPzAvT7UnXztWd-3ksD9VSCzXEm_4i4bDV3wHJVSU",

      serviceWorkerRegistration:
        registration

    });


    if (token) {

      console.log("FCM TOKEN:", token);

      alert(
        "FCM TOKEN:\n\n" + token
      );

      status.textContent =
        "✅ Notifications enabled!";

    } else {

      status.textContent =
        "❌ Couldn't get notification token.";

    }

  } catch (error) {

    console.error(error);

    status.textContent =
      "❌ Notification setup failed. Check console.";

  }

});
