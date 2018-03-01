const CronJob = require('cron').CronJob
const command = require('./command')
const client = require('./client')

const job = new CronJob({
  cronTime: '*/30 * * * * *',
  onTick: function () {
    command.getConn(function (err, res) {
      if (err) {
        console.error(err)
        return
      }
      let {up, connecting} = res
      let message = `hb:up:${up}:conn:${connecting}`
      client.send(message)
    })
  },
  start: false,
})
job.start()
module.exports = job
