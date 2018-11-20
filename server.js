// Express
const app = require('express')()
const bodyParser = require('body-parser')
app.use(bodyParser.json())

// Redis
const redis = require('redis')
const redisClient = redis.createClient({ host: 'redis', port: 6379 })

const newId = () => {
  return Date.now().toString(36) + Math.floor(Math.random() * 999).toString(36)
}

app.get('/', (req, res) => {
  res.send(`Usage: ${process.env.API_ENDPOINT}/:id`)
})

app.get('/:id', (req, res) => {
  const id = req.params['id']
  redisClient.get(id, (error, url) => {
    if (url) {
      res.redirect(url)
    } else {
      res.send('Url not found')
    }
  })
})

app.post('/', (req, res) => {
  if (req.body.token != process.env.API_TOKEN) {
    res.status(401).send('Unauthorized')
    return
  }
  const id = newId()
  redisClient.set(id, req.body.url, redis.print)
  res
    .type('application/json')
    .send({ id, url: `${process.env.API_ENDPOINT}/${id}` })
})

app.listen(3000, () => console.log('Server running'))
