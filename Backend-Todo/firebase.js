import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = ({

  apiKey:"AIzaSyBJ7x5LCZ-eu_mZk3bACnYQSoi8sLz1Bc8",
 authDomain: "backend-todo-7e8a7.firebaseapp.com",
projectId:"backend-todo-7e8a7",
storageBucket:"backend-todo-7e8a7.firebasestorage.app",
messagingSenderId:"922923329048",
appId: "1:922923329048:web:ba159bf36ec9a3f053c56d",

});
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);