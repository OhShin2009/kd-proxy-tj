const {exec} = require('child_process')
const redis = require('./redis')

const EXP = /(\d+)\sup,\s(\d+)\sconnecting/

module.exports = {

  register (username, ex, callback) {
    redis.set(username, 1, 'EX', ex).then(function (res) {
      if (res === 'OK') {
        callback(null)
      } else {
        callback(new Error('save key failed'))
      }
    }).error(callback)
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
  }
}
