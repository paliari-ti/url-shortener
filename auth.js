const { firestore } = require('./firestore')

exports.isAuthenticated = async (client_id, token) => {
  const doc = await firestore
    .collection('clients')
    .doc(client_id)
    .get()

  if (!doc.exists) return false
  return doc.get('token') === token
}
