
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyAnR51QVSQAC49cjyzT2KfWWmEZzos4Iiw",
authDomain: "ugel-andahuaylas-aa606.firebaseapp.com",
projectId: "ugel-andahuaylas-aa606",
storageBucket: "ugel-andahuaylas-aa606.appspot.com",
messagingSenderId: "976368481546",
appId: "1:976368481546:web:6966740f636440a6eff6f3",
measurementId: "G-P5J4SLDP2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


