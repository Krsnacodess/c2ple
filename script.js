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

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================

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

const db = getFirestore(app);


// ===============================
// ANONYMOUS AUTHENTICATION
// ===============================

signInAnonymously(auth)
  .then(() => {

    console.log("✅ Anonymous authentication started.");

  })
  .catch((error) => {

    console.error(
      "❌ Anonymous authentication failed:",
      error
    );

  });


// ===============================
// AUTH STATE
// ===============================

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    console.log("❌ No authenticated user.");

    return;

  }

  console.log("✅ User authenticated!");

  console.log(
    "Firebase UID:",
    user.uid
  );


  // Save user to Firestore

  try {

    await setDoc(
      doc(db, "users", user.uid),
      {
        uid: user.uid,
        createdAt: new Date().toISOString()
      },
      {
        merge: true
      }
    );

    console.log(
      "✅ User saved to Firestore!"
    );

  } catch (error) {

    console.error(
      "❌ Failed to save user to Firestore:",
      error
    );

  }

});


// ===============================
// NOTIFICATION ELEMENTS
// ===============================

const button =
  document.getElementById("enableNotifications");

const status =
  document.getElementById("status");


// Check that the HTML elements exist

if (!button) {

  console.error(
    "❌ Could not find #enableNotifications button."
  );

}

if (!status) {

  console.error(
    "❌ Could not find #status element."
  );

}


// ===============================
// NOTIFICATION SETUP
// ===============================

if (button) {

  button.addEventListener(
    "click",
    async () => {

      try {

        const permission =
          await Notification.requestPermission();


        if (permission !== "granted") {

          if (status) {

            status.textContent =
              "🔕 Notification permission denied.";

          }

          return;

        }


        const registration =
          await navigator.serviceWorker.register(
            "./firebase-messaging-sw.js"
          );


        console.log(
          "✅ Service worker registered."
        );


        const token =
          await getToken(
            messaging,
            {

              vapidKey:
                "BM5-24JpOOP60Ss-ZVeX805zi_87A5PvCcdesAVounHz0qwPzAvT7UnXztWd-3ksD9VSCzXEm_4i4bDV3wHJVSU",

              serviceWorkerRegistration:
                registration

            }
          );


        if (token) {

          console.log(
            "FCM TOKEN:",
            token
          );

          alert(
            "FCM TOKEN:\n\n" +
            token
          );


          if (status) {

            status.textContent =
              "✅ Notifications enabled!";

          }

        } else {

          if (status) {

            status.textContent =
              "❌ Couldn't get notification token.";

          }

        }

      } catch (error) {

        console.error(
          "❌ Notification setup failed:",
          error
        );


        if (status) {

          status.textContent =
            "❌ Notification setup failed. Check console.";

        }

      }

    }
  );

}
