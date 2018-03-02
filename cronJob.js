const CronJob = require('cron').CronJob
const command = require('./command')
const client = require('./client')

const job = new CronJob({
  cronTime: '*/15 * * * * *',
  onTick: function () {
    command.getConn(function (err, res) {
      if (err) {
        let message = `hb:error`
        client.send(message, function (err) {
        })
        return
      }
      let {up, connecting} = res
      let message = `hb:up:${up}:conn:${connecting}`
      client.send(message, function (err) {

      })
    })
  },
  start: false,
})
job.start()
module.exports = job
