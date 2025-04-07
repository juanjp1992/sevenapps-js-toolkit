import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    listAll,
    FirebaseStorage
  } from "firebase/storage";
  
  export const storageMethods = (storage: FirebaseStorage) => ({
    async uploadFile(folder: string, fileName: string, file: Blob | Uint8Array | ArrayBuffer) {
      const fileRef = ref(storage, `${folder}/${fileName}`);
      await uploadBytes(fileRef, file);
      return await getDownloadURL(fileRef);
    },
    async getFileURL(folder: string, fileName: string) {
      const fileRef = ref(storage, `${folder}/${fileName}`);
      return await getDownloadURL(fileRef);
    },
    async deleteFile(folder: string, fileName: string) {
      const fileRef = ref(storage, `${folder}/${fileName}`);
      await deleteObject(fileRef);
    },
    async listFiles(folder: string) {
      const folderRef = ref(storage, folder);
      const result = await listAll(folderRef);
      return result.items.map((itemRef) => itemRef.fullPath);
    }
  });
  