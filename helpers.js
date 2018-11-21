const { firestore } = require('./firestore')

const INCREMENT_TYPES = { gets: 'gets', posts: 'posts' }
exports.INCREMENT_TYPES = INCREMENT_TYPES

exports.getClient = async client_id => {
  const doc = await firestore
    .collection('clients')
    .doc(client_id)
    .get()

  if (!doc.exists) return null
  return doc.data()
}

exports.isAuthenticated = async (client, token) => {
  if (!client) return false
  return client.token === token
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

exports.getIdFromUrl = async (client_id, url) => {
  const linksRef = firestore.collection('links')

  const query = linksRef
    .limit(1)
    .where('client_id', '==', client_id)
    .where('url', '==', url)
  const data = await query.get()
  if (data.size > 0) {
    return data.docs[0].id
  }
  return null
}
