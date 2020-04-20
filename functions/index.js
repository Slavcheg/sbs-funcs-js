const functions = require('firebase-functions');
const admin = require('firebase-admin');
// const serviceAccount = require("../../SBS_creds/sbs1-8b65b-firebase-adminsdk-9tvt9-87d8d10285.json");
admin.initializeApp({
    // credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://sbs1-8b65b.firebaseio.com",
});
const firebase = require('firebase');
firebase.initializeApp({
    apiKey: "AIzaSyD81efen88ud3JiW-tcyzTanP6qOZYJMP4",
    // authDomain: "sbs1-8b65b.firebaseapp.com",
    // databaseURL: "https://sbs1-8b65b.firebaseio.com",
    projectId: "sbs1-8b65b",
    // storageBucket: "sbs1-8b65b.appspot.com",
    // messagingSenderId: "1077690630800",
    // appId: "1:1077690630800:web:9f34d61f5110087af98e15",
    // measurementId: "G-GPDQDPVQKP"

});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const user = {
    email: '',
    password: '',
    first: ' ',
    last: ' ',
    role: 'client'
}

exports.Ping = functions.https.onRequest((equest, response) => {
    return response.send('ok!');
});

// ToDo
// needs user validation
// anything to ensure all actions will be done or none
exports.CreateUser = functions.https.onRequest((request, response) => {
    let u = user;
    
    u.email = request.body.email;
    u.password = request.body.password;
    u.first = request.body.firstName? request.body.firstName: ' ';
    u.last = request.body.lastName? request.body.lastName: ' ';
    
    if(request.method === "POST") {
        firebase.auth().createUserWithEmailAndPassword(u.email, u.password)
        .then( (res) => {
            // console.log(JSON.stringify(user))
            // console.log(u)
            try{
                firebase.firestore().collection('users').doc(u.email).set({
                    email: u.email,
                    uuID: res.user.uid,
                    first: u.first,
                    last: u.last,
                    role: u.role
                })
            }catch(e){
                console.log(e)
                return response.send({message: 'error!', error: e});                
            }
            
            return response.send(
                {
                    message: 'ok!',
                    user: res.user
                });
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
                return response.send(
                    {
                        'message': 'ok!',
                        'user': user
                    });
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
    // let password = request.body.password;
    let isValidPassword = true   

    if(request.method === "POST" && isValidEmail && isValidPassword) {
        firebase.auth().sendPasswordResetEmail(email)
            .then( (user) => {
                return response.send(
                    {
                        'message': 'ok!',
                        'user': user
                    });
            })
            .catch((err) => {
                response.send(err);
            })   
    } else {
        response.send({ "message": 'Wrongfull call method! Please use POST and pass email and password to register a user'})
    }   
});

exports.fbAddItem = functions.https.onRequest((request, response) => {
    const { collection, item } = request.body
    
    admin.firestore()
    .collection(collection)
    .add(Object.assign({}, item))
    .then( t => {
        return response.send(
            {
                message: 'ok!'
            });
    })
    .catch(e => {
        console.log(e);
        return response.send(
            {
                message: 'error!'
            })
    });
})

exports.fbGetItems = functions.https.onRequest((request, response) => {
    const { collection } = request.body
    admin.firestore()
        .collection(collection)
        .get()
        .then(snapshot => {
            let data = [];
            snapshot.forEach(doc => {
                data.push(
                    {
                        "id": doc.id, 
                        "item": doc.data()
                    }
                );
              });
            return response.send({
                message: 'ok!',
                data: data
            });
        })
        .catch(e => {
            console.log(e);
            return response.send(
                {
                    message: 'error!'
                })
        })
})

exports.fbGetConditionalItems = functions.https.onRequest((request, response) => {
    const {collection, field, condition, value} = request.body
    
    admin.firestore()
        .collection(collection)
        .where(field, condition, value)
        .get()
        .then(snapshot => {
            let data = [];
            snapshot.forEach(doc => {
                data.push(
                    {
                        "id": doc.id, 
                        "item": doc.data()
                    }
                );
              });
            return response.send({
                message: 'ok!',
                data: data
            });
        })
        .catch(e => {
            console.log(e);
            return response.send(
                {
                    message: 'error!'
                })
        })
})

exports.fbDeleteItem = functions.https.onRequest((request, response) => {
    const { collection, itemId } = request.body
    
    admin.firestore()
    .collection(collection)
    .doc(itemId)
    .delete()
    .then(t => {
        return response.send(
            {
                message: 'ok!'
            });
    })
    .catch(e => {
        return response.send(
            {
                message: 'error!'
            })
    });
})

exports.fbUpdateItem = functions.https.onRequest((request, response) => {
    const { collection, itemId, item } = request.body
    
    admin.firestore()
    .collection(collection)
    .doc(itemId)
    .update(item)
    .then(t => {
        return response.send(
            {
                message: 'ok!'
            });
    })
    .catch(e => {
        return response.send(
            {
                message: 'error!'
            })
    });
})

// exports.CreateUserOnFireStore = functions.auth.user().onCreate(user => {
//     return admin.firestore().collection('users').doc(user.email).set({
//         email: user.email,
//         uuID: user.uid,
//         role: 'client'
//     })
// });

exports.DeleteUserOnFireStore = functions.auth.user().onDelete(user => {
    const doc = admin.firestore().collection('users').doc(user.email);
    return doc.delete();
});

