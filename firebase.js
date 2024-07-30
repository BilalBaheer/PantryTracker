import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const db = getFirestore(app);
export { db };
