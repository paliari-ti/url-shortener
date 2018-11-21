const { firestore } = require('./firestore')

const INCREMENT_TYPES = { gets: 'gets', posts: 'posts' }
exports.INCREMENT_TYPES = INCREMENT_TYPES

exports.isAuthenticated = async (client_id, token) => {
  const doc = await firestore
    .collection('clients')
    .doc(client_id)
    .get()

  if (!doc.exists) return false
  return doc.get('token') === token
}

exports.incrementClient = (type, client_id) => {
  firestore.runTransaction(async transaction => {
    const clientRef = firestore.collection('clients').doc(client_id)
    const data = await transaction.get(clientRef)
    const value = data.get(type) || 0
    transaction.update(clientRef, { [type]: value + 1 })
  })
}

exports.incrementUrl = id => {
  firestore.runTransaction(async transaction => {
    const linkRef = firestore.collection('links').doc(id)
    const data = await transaction.get(linkRef)
    const value = data.get('gets') || 0
    transaction.update(linkRef, { gets: value + 1 })
  })
}
