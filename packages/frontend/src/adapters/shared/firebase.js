import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDJxeQB1HiwzaCzK0tisViKbbz0aM4dJnc",
  authDomain: "resto-covid.firebaseapp.com",
  databaseURL: "https://resto-covid.firebaseio.com",
  projectId: "resto-covid",
  storageBucket: "resto-covid.appspot.com",
  messagingSenderId: "904967994003",
  appId: "1:904967994003:web:f7ef610a4788e53729eb66",
  measurementId: "G-ZNYGJ25QBB",
};

firebase.initializeApp(firebaseConfig);

let analytics;
export const getAnalytics = () => {
  if (analytics) return analytics;
  analytics = firebase.analytics();
  return analytics;
};
export const db = firebase.firestore();
export const auth = firebase.auth();
