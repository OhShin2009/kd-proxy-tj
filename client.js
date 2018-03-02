const dgram = require('dgram')
const PORT = 6000
const HOST = '47.92.181.56'

module.exports = {
  send (message, cb) {
    const client = dgram.createSocket('udp4')
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
      if (err) {
        cb(err)
      } else {
        cb(null)
      }
      client.close()
    })
  }
}
