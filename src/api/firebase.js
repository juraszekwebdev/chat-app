import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAgLYz6YY-IM9K0nusrM4sDLjHWKuxDEtQ',
  authDomain: 'chat-cf614.firebaseapp.com',
  databaseURL: 'https://chat-cf614.firebaseio.com',
  projectId: 'chat-cf614',
  storageBucket: 'chat-cf614.appspot.com',
  messagingSenderId: '176478899686',
  appId: '1:176478899686:web:5c4906a3f538e8ea969a27'
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

export {
  auth,
  db
}
