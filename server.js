// Express
const app = require('express')()
const bodyParser = require('body-parser')
app.use(bodyParser.json())
const { newId } = require('./idGenerator')

const mongo = require('./mongo')

app.get('/', (req, res) => {
  res.type('json').send({
    get: `${process.env.API_ENDPOINT}/:id`,
    post: `${process.env.API_ENDPOINT}/ with url and token in the body`
  })
})

app.get('/:id', async (req, res) => {
  const id = req.params['id']
  const db = await mongo

  db.collection('links')
    .findOne({ id })
    .then(data => {
      res.redirect(data.url)
    })
    .catch(e => res.json(e.message))
})

app.post('/', async (req, res) => {
  const url = req.body.url
  const id = newId()
  const db = await mongo

  db.collection('links')
    .insertOne({ id, url })
    .then(() => {
      res.json({ id, url: `${process.env.API_ENDPOINT}/${id}` })
    })
    .catch(e => res.json(e.message))
})

app.listen(3000, () => console.log('Server running'))
