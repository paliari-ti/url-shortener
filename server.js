// Express
const app = require('express')()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Firestore
const { firestore } = require('./firestore')
const { isAuthenticated, increment, INCREMENT_TYPES } = require('./helpers')
const { newId } = require('./idGenerator')

const collectionRef = firestore.collection('links')

app.get('/', (req, res) => {
  res.send(
    `Usage: GET ${process.env.API_ENDPOINT}/:id | POST ${
      process.env.API_ENDPOINT
    }/:client_id with url and token in the body`
  )
})

app.get('/:id', (req, res) => {
  const id = req.params['id']
  collectionRef
    .doc(id)
    .get()
    .then(doc => {
      const data = doc.data()
      increment(INCREMENT_TYPES.gets, data.client_id)
      res.redirect(data.url)
    })
    .catch(() => {
      res.send('Url not found')
    })
})

app.post('/:client_id', async (req, res) => {
  const client_id = req.params['client_id']
  if (!(await isAuthenticated(client_id, req.body.token))) {
    res.status(401).send('Unauthorized')
    return
  }
  increment(INCREMENT_TYPES.posts, client_id)
  const id = newId()
  collectionRef
    .doc(id)
    .set({ url: req.body.url, client_id })
    .then(() => {
      res
        .type('application/json')
        .send({ id, url: `${process.env.API_ENDPOINT}/${id}` })
    })
    .catch(e => {
      res.send('Ops, something went wrong')
    })
})

app.listen(3000, () => console.log('Server running'))
