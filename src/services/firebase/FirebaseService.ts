import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAuth, Auth } from "firebase/auth";
import { firestoreMethods } from "./firestore";
import { storageMethods } from "./storage";
import { authMethods } from "./auth";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

export class FirebaseService {
  private app: FirebaseApp;
  private db?: Firestore;
  private storage?: FirebaseStorage;
  private auth?: Auth;

  firestore?: ReturnType<typeof firestoreMethods>;
  storageAPI?: ReturnType<typeof storageMethods>;
  authAPI?: ReturnType<typeof authMethods>;

  constructor(config: FirebaseConfig, useFirestore = true, useStorage = true, useAuth = true) {
    this.app = initializeApp(config);
    if (useFirestore) {
      this.db = getFirestore(this.app);
      this.firestore = firestoreMethods(this.db);
    }
    if (useStorage) {
      this.storage = getStorage(this.app);
      this.storageAPI = storageMethods(this.storage);
    }
    if (useAuth) {
      this.auth = getAuth(this.app);
      this.authAPI = authMethods(this.auth);
    }
  }
}
