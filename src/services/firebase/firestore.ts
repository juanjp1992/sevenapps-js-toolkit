import {
    Firestore,
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    onSnapshot
  } from "firebase/firestore";
  
  export const firestoreMethods = (db: Firestore) => ({
    async getDocument(collectionName: string, docId: string) {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? docSnap.data() : null;
    },
    async getAllDocuments(collectionName: string) {
      const colRef = collection(db, collectionName);
      const snap = await getDocs(colRef);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    async createOrUpdateDocument(collectionName: string, docId: string, data: any) {
      const docRef = doc(db, collectionName, docId);
      await setDoc(docRef, data, { merge: true });
    },
    async updateDocument(collectionName: string, docId: string, data: any) {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, data);
    },
    async deleteDocument(collectionName: string, docId: string) {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
    },
    onDocumentSnapshot(collectionName: string, docId: string, callback: (data: any) => void) {
      const docRef = doc(db, collectionName, docId);
      return onSnapshot(docRef, (docSnap) => {
        callback(docSnap.exists() ? docSnap.data() : null);
      });
    }
  });
  