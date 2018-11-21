var lastTime = 0
const lastRandChars = []
const CHARS = '-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz'

exports.newId = () => {
  var now = Date.now()
  var duplicateTime = now === lastTime
  lastTime = now
  var id = now.toString(36)
  const randomLen = 2
  var i

  if (duplicateTime) {
    for (i = randomLen - 1; i >= 0 && lastRandChars[i] === 63; i--) {
      lastRandChars[i] = 0
    }
    lastRandChars[i]++
  } else {
    for (i = 0; i < randomLen; i++) {
      lastRandChars[i] = Math.floor(Math.random() * 64)
    }
  }
  for (i = 0; i < randomLen; i++) {
    id += CHARS.charAt(lastRandChars[i])
  }

  return id
}
