const MongoClient = require('mongodb').MongoClient
// const assert = require('assert');

// Connection URL
const url = 'mongodb://root:root@mongo:27017'

// Database Name
const dbName = 'url_shortener'

// Create a new MongoClient
const client = new MongoClient(url)

module.exports = new Promise((resolve, reject) => {
  client.connect((err, client) => {
    if (err) reject(err)
    console.log('Connected correctly to mongo server')
    resolve(client.db(dbName))
  })
})
