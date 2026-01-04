import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
// TODO: Replace with your actual config or use environment variables
const firebaseConfig = {
    apiKey: "AIzaSyBK5Z0xgg-A9hJlzl-plnjx6uEvcePxL08",
    authDomain: "studio-7837572904-e54a4.firebaseapp.com",
    projectId: "studio-7837572904-e54a4",
    storageBucket: "studio-7837572904-e54a4.firebasestorage.app",
    messagingSenderId: "165057136660",
    appId: "1:165057136660:web:4ed0c013d5e23c17bd3f01"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
