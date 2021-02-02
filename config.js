import firebase from 'firebase';
require('@firebase/firestore')

var firebaseConfig = {
  apiKey: "AIzaSyA4rQAGwzULQjiHdwZ7FFE23rjcAoTXK4s",
  authDomain: "book-santa-7914e.firebaseapp.com",
  databaseURL: "https://book-santa-7914e.firebaseio.com",
  projectId: "book-santa-7914e",
  storageBucket: "book-santa-7914e.appspot.com",
  messagingSenderId: "942699393940",
  appId: "1:942699393940:web:75e282870d9648128f5581"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase.firestore();
