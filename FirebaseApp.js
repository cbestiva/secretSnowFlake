import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyCfXZYBcT-uEs5rXjVDQPdwIGQUDhXAdKU",
    authDomain: "jamesresistance-5740e.firebaseapp.com",
    databaseURL: "https://jamesresistance-5740e.firebaseio.com",
    projectId: "jamesresistance-5740e",
    storageBucket: "jamesresistance-5740e.appspot.com",
}

const firebaseApp = firebase.initializeApp(firebaseConfig);

export default firebaseApp;