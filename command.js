const {exec} = require('child_process')
const fs = require('fs')
const fse = require('fs-extra')
const randomString = require('random-string')
const redis = require('./redis')

const EXP = /(\d+)\sup,\s(\d+)\sconnecting/
const SECRET_PATH = '/usr/local/etc/ipsec.secrets'
const DEFAULT_SECRET_PATH = '/usr/local/etc/ipsec.secrets.default'

module.exports = {

  register (username, ex, callback) {
    redis.get(username).then(res => {
      if (res) return callback(null, res)
      let password = randomString({length: 8})
      let secret = `${username} %any : EAP "${password}"`
      fs.appendFile(SECRET_PATH, secret, (err) => {
        if (err) return callback(err)
        exec('ipsec rereadsecrets', function (err) {
          if (err) {
            console.error(err)
          }
        })
        redis.set(username, password).then(function (res) {
          if (res === 'OK') {
            callback(null)
          } else {
            callback(new Error('save key failed'))
          }
        }).error(callback)
      })
    })
  },

  clean () {
    try {
      fse.copySync(DEFAULT_SECRET_PATH, SECRET_PATH)
      redis.flushdb()
    } catch (err) {
      console.error(err)
    }
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
        callback(error)
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
  }
}

