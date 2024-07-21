import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD3TXxNO4XFyoLdpGv0rbElRYAFeY2eX0g",
  authDomain: "loop-chat-2430d.firebaseapp.com",
  projectId: "loop-chat-2430d",
  storageBucket: "loop-chat-2430d.appspot.com",
  messagingSenderId: "898230256679",
  appId: "1:898230256679:web:10fb974be5694a76a33a02",
  measurementId: "G-YXSB5VMVD3",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
