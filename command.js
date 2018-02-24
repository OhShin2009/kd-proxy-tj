const {exec} = require('child_process')
const fs = require('fs-extra')
const redis = require('./redis')
const SECRET_FILE = '/usr/local/etc/ipsec.secrets'
const DEFAULT_SECRET_FILE = '/usr/local/etc/ipsec.secrets.default'
module.exports = {

  append (username, callback) {
    redis.get(username).then(function (data) {
      if (data) return callback(null, data)
      let password = new Date().getTime().toString()
      let pair = `${username} %any : EAP \\"${password}\\"`
      let cacheKey = `pair:${username}`
      fs.appendFile(SECRET_FILE, pair, (err) => {
        if (err) return callback(err)
        redis.set(cacheKey, password).then(() => {callback(null, password)}).error(callback)
      })
    }).error(callback)
  },

  reload (callback) {
    exec('ipsec rereadsecrets', callback)
  },

  restart (callback) {
    exec('ipsec restart', callback)
  },

  clean (callback) {
    try {
      fs.copySync(DEFAULT_SECRET_FILE, SECRET_FILE)
      exec('ipsec restart', callback)
      console.log('clean success!')
    } catch (err) {
      console.error(err)
      callback(err)
    }
  }
}
