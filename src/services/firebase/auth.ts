import {
    Auth,
    signInWithEmailAndPassword,
    signOut,
    createUserWithEmailAndPassword,
    onAuthStateChanged
  } from "firebase/auth";
  
  export const authMethods = (auth: Auth) => ({
    async login(email: string, password: string) {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    },
    async register(email: string, password: string) {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    },
    async logout() {
      await signOut(auth);
    },
    onAuthStateChanged(callback: (user: any) => void) {
      onAuthStateChanged(auth, callback);
    }
  });
  