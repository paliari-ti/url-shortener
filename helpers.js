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

exports.increment = (type, client_id) => {
  firestore.runTransaction(async transaction => {
    const clientRef = firestore.collection('clients').doc(client_id)
    const data = await transaction.get(clientRef)
    const value = data.get(type)
    transaction.update(clientRef, { [type]: value + 1 })
  })
}
