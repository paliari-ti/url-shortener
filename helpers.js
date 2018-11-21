const { firestore } = require('./firestore')

const INCREMENT_TYPES = { gets: 'gets', posts: 'posts' }

const getClient = async client_id => {
  const doc = await firestore
    .collection('clients')
    .doc(client_id)
    .get()

  if (!doc.exists) return null
  return doc.data()
}

const isAuthenticated = async (client, token) => {
  if (!client) return false
  return client.token === token
}

const incrementClient = (type, client_id) => {
  firestore
    .runTransaction(async transaction => {
      const clientRef = firestore.collection('clients').doc(client_id)
      const data = await transaction.get(clientRef)
      const value = data.get(type) || 0
      transaction.update(clientRef, { [type]: value + 1 })
    })
    .catch(() => incrementClient(type, client_id))
}

const incrementUrl = id => {
  firestore
    .runTransaction(async transaction => {
      const linkRef = firestore.collection('links').doc(id)
      const data = await transaction.get(linkRef)
      const value = data.get('gets') || 0
      transaction.update(linkRef, { gets: value + 1 })
    })
    .catch(() => incrementUrl(id))
}

const getIdFromUrl = async (client_id, url) => {
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

exports.INCREMENT_TYPES = INCREMENT_TYPES
exports.getClient = getClient
exports.isAuthenticated = isAuthenticated
exports.incrementClient = incrementClient
exports.incrementUrl = incrementUrl
exports.getIdFromUrl = getIdFromUrl
