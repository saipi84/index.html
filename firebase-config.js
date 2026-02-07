const firebaseConfig = {
  apiKey: "AIzaSyBXToxoncJIm7gRHYem4584EpoW_6bfwRU",
  authDomain: "zsva-plan.firebaseapp.com",
  databaseURL: "https://zsva-plan-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "zsva-plan",
  storageBucket: "zsva-plan.firebasestorage.app",
  messagingSenderId: "426759116582",
  appId: "1:426759116582:web:9ac7dfdaa434b05cef53e7",
  measurementId: "G-YGFT1B9M3R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
