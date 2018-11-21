var admin = require('firebase-admin')
var serviceAccount = require('./serviceAccount.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})

exports.firestore = admin.firestore()
