import firebase from 'firebase';

var config = {
    
};

firebase.initializeApp(config);
export var database = firebase.database();

export default firebase;