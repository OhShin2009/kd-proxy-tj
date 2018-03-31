const dgram = require('dgram')
const PORT = 6000
const HOST = '47.95.127.204'

module.exports = {
  send (message, cb) {
    const client = dgram.createSocket('udp4')
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
      if (err) {
        if (cb) {
          cb(err)
        }
      } else {
        console.log(`send message: ${message}`)
        if (cb) {
          cb(null)
        }
      }
      client.close()
    })
  }
}
