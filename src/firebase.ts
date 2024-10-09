import { initializeApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage} from "firebase/storage";


interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  databaseURL: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
}


const firebaseConfig: FirebaseConfig = {
  apiKey: 'AIzaSyBmeKnq-D6Lr19zHLO3hO43jfYNHqNaSHA',
  authDomain: 'chat-app-react-dcf35.firebaseapp.com',
  databaseURL: 'https://chat-app-react-dcf35.firebaseio.com',
  projectId: 'chat-app-react-dcf35',
  storageBucket: 'chat-app-react-dcf35.appspot.com',
  messagingSenderId: '347001194094',
  appId: '1:347001194094:web:76ee0ddf5104e939b3c87f',
};

const app: FirebaseApp = initializeApp(firebaseConfig);

const auth: Auth = getAuth(app);
const db: Firestore = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
