// Express
const app = require('express')()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Firebase
var admin = require('firebase-admin')
var serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT)
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL
})
const collectionRef = admin.firestore().collection('links')

const newId = () => {
  return Date.now().toString(36) + Math.floor(Math.random() * 999).toString(36)
}

app.get('/', (req, res) => {
  res.send(`Usage: ${process.env.API_ENDPOINT}/:id`)
})

app.get('/:id', (req, res) => {
  const id = req.params['id']
  collectionRef
    .doc(id)
    .get()
    .then(doc => {
      const data = doc.data()
      res.redirect(data.url)
    })
    .catch(() => {
      res.send('Url not found')
    })
})

app.post('/', (req, res) => {
  const t1 = Date.now()
  if (req.body.token != process.env.API_TOKEN) {
    res.status(401).send('Unauthorized')
    return
  }
  const id = newId()
  collectionRef
    .doc(id)
    .set({ url: req.body.url })
    .then(() => {
      const t2 = Date.now()
      res
        .type('application/json')
        .send({ id, url: `${process.env.API_ENDPOINT}/${id}`, time: t2 - t1 })
    })
    .catch(e => {
      response.send('Ops, something went wrong')
    })
})

app.listen(3000, () => console.log('Server running'))
