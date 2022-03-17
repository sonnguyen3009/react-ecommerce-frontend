// Import the functions you need from the SDKs you need
// import { initializeApp } from 'firebase/app'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// import firebase from 'firebase/app'
import firebase from 'firebase/compat/app'
// import 'firebase/auth'
import 'firebase/compat/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAOg2pe5A6U7rGXk9Flels_MlsqXSX-qfg',
  authDomain: 'ecommerce-324b3.firebaseapp.com',
  projectId: 'ecommerce-324b3',
  storageBucket: 'ecommerce-324b3.appspot.com',
  messagingSenderId: '837564787718',
  appId: '1:837564787718:web:401ef28579fb8d340ea787',
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}
// export
// export default firebase;
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
