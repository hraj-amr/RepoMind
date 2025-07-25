// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqMR5gK-oZELx92iudzHb1K05yM8YATxo",
  authDomain: "repomind-35619.firebaseapp.com",
  projectId: "repomind-35619",
  storageBucket: "repomind-35619.firebasestorage.app",
  messagingSenderId: "1069544578423",
  appId: "1:1069544578423:web:fc524c7228a8923b641572"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);


export async function uploadFile(file: File, setProgress?: (progress: number) => void){
    return new Promise((resolve, reject) => {
        try {
            const storageRef = ref(storage, file.name)
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', snapshot => {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
                if (setProgress) setProgress(progress)
                    switch(snapshot.state){
                        case 'paused':
                            console.log('Upload is paused'); break;
                        case 'running':
                            console.log('Upload is running'); break;
                    }
            }, error => {
                reject(error)
            }, () => {
                getDownloadURL(uploadTask.snapshot.ref).then(downloadUrl => {
                    resolve(downloadUrl as string)
                })
            })
        } catch (error) {
            console.error(error)
            reject(error)
        }
    })
}