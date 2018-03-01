const dgram = require('dgram')
const PORT = 6000
const HOST = '47.92.181.56'

module.exports = {
  send (message) {
    const client = dgram.createSocket('udp4')
    client.send(message, 0, message.length, PORT, HOST, function (err, bytes) {
      if (err) throw err
      console.log('UDP message sent to ' + HOST + ':' + PORT)
      client.close()
    })
  }
}
