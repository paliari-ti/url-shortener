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
  res.type('json').send({
    get: `${process.env.API_ENDPOINT}/:id`,
    post: `${
      process.env.API_ENDPOINT
    }/:client_id with url and token in the body`
  })
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
      res
        .status(404)
        .type('json')
        .send({ error: 'Url not found' })
    })
})

app.post('/:client_id', async (req, res) => {
  try {
    const client_id = req.params['client_id']
    const url = req.body.url
    const client = await getClient(client_id)
    if (!(await isAuthenticated(client, req.body.token))) {
      res
        .status(401)
        .type('json')
        .send({ error: 'Unauthorized' })
      return
    }
    incrementClient(INCREMENT_TYPES.posts, client_id)

    let id = null
    if (client.unique_url) id = await getIdFromUrl(client_id, url)
    if (!id) {
      id = newId()
      await collectionRef.doc(id).set({ url, client_id })
    }
    res.type('json').send({ id, url: `${process.env.API_ENDPOINT}/${id}` })
  } catch (error) {
    res
      .status(500)
      .type('json')
      .send({ error: 'Ops, something went wrong' })
  }
})

app.listen(3000, () => console.log('Server running'))
