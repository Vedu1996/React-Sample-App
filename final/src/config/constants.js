import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyDVmQVbFSWKXH6syH4l_vAg893TTbdaNio",
    authDomain: "login-822af.firebaseapp.com",
    databaseURL: "https://login-822af.firebaseio.com",
    projectId: "login-822af",
    storageBucket: "login-822af.appspot.com",
    messagingSenderId: "939411139627"
}


firebase.initializeApp(config)
var getDB = function(){
    return firebase.database();
}
export function getStorageRef(){
    return firebase.storage();
}

export default getDB;
export const firebaseAuth = firebase.auth
