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
  // ===============================
// COUPLE PAIRING - CREATE COUPLE
// ===============================

const createCoupleButton =
  document.getElementById("createCouple");

const pairCodeBox =
  document.getElementById("pairCodeBox");

const pairCodeDisplay =
  document.getElementById("pairCode");

const coupleStatus =
  document.getElementById("coupleStatus");


// Cute characters for pairing codes
// Avoids confusing characters like O/0 and I/1

const cuteCharacters =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


// Generate a random 6-character code

function generateCoupleCode() {

  let code = "";

  for (let i = 0; i < 6; i++) {

    const randomIndex =
      Math.floor(
        Math.random() * cuteCharacters.length
      );

    code += cuteCharacters[randomIndex];

  }

  return code;
}


// Create Couple button

if (createCoupleButton) {

  createCoupleButton.addEventListener(
    "click",
    async () => {

      try {

        // Make sure the user is authenticated

        const user = auth.currentUser;

        if (!user) {

          coupleStatus.textContent =
            "❌ Please wait for C2ple to finish connecting.";

          return;

        }


        createCoupleButton.disabled = true;

        createCoupleButton.textContent =
          "Creating your couple... 💕";


        let code = generateCoupleCode();


        // Create a Firestore document using the code

        await setDoc(
          doc(db, "couples", code),
          {
            code: code,
            partner1: user.uid,
            partner2: null,
            status: "waiting",
            createdAt: new Date().toISOString()
          }
        );


        // Show the code

        pairCodeDisplay.textContent =
          code;

        pairCodeBox.style.display =
          "block";


        coupleStatus.textContent =
          "❤️ Your couple code is ready! Share it with your partner.";


        createCoupleButton.textContent =
          "Couple Created ❤️";


      } catch (error) {

        console.error(
          "❌ Create Couple failed:",
          error
        );


        coupleStatus.textContent =
          "❌ Couldn't create your couple. Check the console.";

        createCoupleButton.disabled =
          false;

        createCoupleButton.textContent =
          "Create Couple 💕";

      }

    }
  );

}


// ===============================
// COUPLE PAIRING - JOIN COUPLE
// ===============================

const joinCoupleButton =
  document.getElementById("joinCouple");

const joinCodeInput =
  document.getElementById("joinCode");


// Join Couple button

if (joinCoupleButton) {

  joinCoupleButton.addEventListener(
    "click",
    async () => {

      try {

        const user = auth.currentUser;

        if (!user) {

          coupleStatus.textContent =
            "❌ Please wait for C2ple to connect.";

          return;

        }


        const code =
          joinCodeInput.value
            .trim()
            .toUpperCase();


        // Check code length

        if (code.length !== 6) {

          coupleStatus.textContent =
            "❌ Please enter the 6-character couple code.";

          return;

        }


        joinCoupleButton.disabled = true;

        joinCoupleButton.textContent =
          "Connecting... 💕";


        // Get the existing couple

        const coupleRef =
          doc(db, "couples", code);


        const coupleSnapshot =
          await getDoc(coupleRef);


        if (!coupleSnapshot.exists()) {

          coupleStatus.textContent =
            "❌ That couple code doesn't exist.";

          joinCoupleButton.disabled = false;

          joinCoupleButton.textContent =
            "Join Couple 💗";

          return;

        }


        const coupleData =
          coupleSnapshot.data();


        // Check if already full

        if (coupleData.partner2) {

          coupleStatus.textContent =
            "❌ This couple is already connected.";

          joinCoupleButton.disabled = false;

          joinCoupleButton.textContent =
            "Join Couple 💗";

          return;

        }


        // Don't allow someone to join their own couple

        if (coupleData.partner1 === user.uid) {

          coupleStatus.textContent =
            "❌ You can't join your own couple.";

          joinCoupleButton.disabled = false;

          joinCoupleButton.textContent =
            "Join Couple 💗";

          return;

        }


        // Add second partner

        await updateDoc(
          coupleRef,
          {
            partner2: user.uid,
            status: "connected"
          }
        );


        coupleStatus.textContent =
          "❤️ You're connected! Your couple is now together.";

        joinCoupleButton.textContent =
          "Connected ❤️";


        console.log(
          "✅ Couple connected!",
          code
        );


      } catch (error) {

        console.error(
          "❌ Join Couple failed:",
          error
        );


        coupleStatus.textContent =
          "❌ Couldn't join the couple. Check the console.";

        joinCoupleButton.disabled =
          false;

        joinCoupleButton.textContent =
          "Join Couple 💗";

      }

    }
  );

}
