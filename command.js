const {exec} = require('child_process')
const fs = require('fs-extra')
const redis = require('./redis')
const SECRET_FILE = '/usr/local/etc/ipsec.secrets'
const DEFAULT_SECRET_FILE = '/usr/local/etc/ipsec.secrets.default'
const EXP = /(\d+)\sup,\s(\d+)\sconnecting/

module.exports = {

  append (username, callback) {
    let cacheKey = `pair:${username}`
    redis.get(cacheKey).then(function (data) {
      if (data) return callback(null, data)
      let password = new Date().getTime().toString()
      let pair = `${username} %any : EAP "${password}"`
      fs.appendFile(SECRET_FILE, pair + '\n', (err) => {
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

  executeScript (file, callback) {
    let cmdFile = `/home/kd-scripts/${file}.sh`
    exec(`sh ${cmdFile}`, callback)
  },

  getConn (callback) {
    exec('ipsec status | grep up', function (error, stdout, stderr) {
      if (error) {
        console.error(error)
      } else {
        let res = EXP.exec(stdout)
        if (res === null) {
          callback(new Error('invalid stdout'))
        } else {
          let up = res[1]
          let connecting = res[2]
          callback(null, {up, connecting})
        }
      }
    })
  },

  clean (callback) {
    try {
      fs.copySync(DEFAULT_SECRET_FILE, SECRET_FILE)
      exec('ipsec restart', (err) => {
        if (err) return callback(err)
        redis.flushdb().then((res) => callback(null))
      })
    } catch (err) {
      callback(err)
    }
  }
}
