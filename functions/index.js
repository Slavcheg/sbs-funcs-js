const functions = require('firebase-functions');
const admin = require('firebase-admin');
var firebase = require('firebase');
var app = firebase.initializeApp({
    apiKey: "AIzaSyD81efen88ud3JiW-tcyzTanP6qOZYJMP4",
    authDomain: "sbs1-8b65b.firebaseapp.com",
    databaseURL: "https://sbs1-8b65b.firebaseio.com",
    projectId: "sbs1-8b65b",
    storageBucket: "sbs1-8b65b.appspot.com",
    messagingSenderId: "1077690630800",
    appId: "1:1077690630800:web:9f34d61f5110087af98e15",
    measurementId: "G-GPDQDPVQKP"
});
admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.Ping = functions.https.onRequest((equest, response) => {
    return response.send('ok!');
});

exports.CreateUser = functions.https.onRequest((request, response) => {
    let email = request.body.email;
    let isValidEmail = true
    let password = request.body.password;
    let isValidPassword = true   
    
    if(request.method === "POST" && isValidEmail && isValidPassword) {
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then( (user) => {
            // console.log(`user: ${user.additionalUserInfo.username} registered!`)
            return response.send(user);
        })
        .catch((err) => {
            response.send(err);
        })  
    } else {
        return response.send({ "message": 'Wrongfull call method! Please use POST and pass email and password to register a user'})
    }  
    return null;
});

exports.SignInUser = functions.https.onRequest((request, response) => {
    let email = request.body.email;
    let isValidEmail = true
    let password = request.body.password;
    let isValidPassword = true   

    if(request.method === "POST" && isValidEmail && isValidPassword) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then( (user) => {
                // console.log(`user: ${user.additionalUserInfo.username} registered!`)
                return response.send(app);
            })
            .catch((err) => {
                response.send(err);
            })   
    } else {
        response.send({ "message": 'Wrongfull call method! Please use POST and pass email and password to register a user'})
    }   
});

exports.SendResetPasswordEmail = functions.https.onRequest((request, response) => {
    let email = request.body.email;
    let isValidEmail = true
    let password = request.body.password;
    let isValidPassword = true   

    if(request.method === "POST" && isValidEmail && isValidPassword) {
        firebase.auth().sendPasswordResetEmail(email)
            .then( (user) => {
                return response.send("Password email sent!");
            })
            .catch((err) => {
                response.send(err);
            })   
    } else {
        response.send({ "message": 'Wrongfull call method! Please use POST and pass email and password to register a user'})
    }   
});

exports.StoreUserOnFireStore = functions.auth.user().onCreate(user => {
    return admin.firestore().collection('users').doc(user.email).set({
        email: user.email,
        uuID: user.uid
    })
});

