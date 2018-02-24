const {exec} = require('child_process')
const PATH = '/usr/local/etc/ipsec.secrets'
const fs = require('fs')
module.exports = {

  append (username, callback) {
    let password = new Date().getTime().toString()
    let pair = `${username} %any : EAP \\"${password}\\"`
    fs.appendFile(PATH, pair, function (err) {
      if (err) return callback(err)
      return callback(null, password)
    })
  },

  reload (callback) {
    exec('ipsec rereadsecrets', callback)
  },

  restart (callback) {
    exec('ipsec restart', callback)
  },

  clean (callback) {
    exec('cp /usr/local/etc/ipsec.secrets.empty /usr/local/etc/ipsec.secrets', function (err) {
      if (err) return callback(err)
      exec('ipsec restart', callback)
    })
  }
}
