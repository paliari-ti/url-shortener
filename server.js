// Express
const app = require('express')()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Firestore
const { firestore } = require('./firestore')
const {
  getClient,
  isAuthenticated,
  getIdFromUrl,
  incrementUrl,
  incrementClient,
  INCREMENT_TYPES
} = require('./helpers')
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
      incrementClient(INCREMENT_TYPES.gets, data.client_id)
      incrementUrl(id)
      res.redirect(data.url)
    })
    .catch(() => {
      res.send('Url not found')
    })
})

app.post('/:client_id', async (req, res) => {
  try {
    const client_id = req.params['client_id']
    const url = req.body.url
    const client = await getClient(client_id)
    if (!(await isAuthenticated(client, req.body.token))) {
      res.status(401).send('Unauthorized')
      return
    }
    incrementClient(INCREMENT_TYPES.posts, client_id)

    let id = null
    if (client.unique_url) id = await getIdFromUrl(client_id, url)
    if (!id) {
      id = newId()
      await collectionRef.doc(id).set({ url, client_id })
    }
    res
      .type('application/json')
      .send({ id, url: `${process.env.API_ENDPOINT}/${id}` })
  } catch (error) {
    res.send('Ops, something went wrong ' + error.message)
  }
})

app.listen(3000, () => console.log('Server running'))
