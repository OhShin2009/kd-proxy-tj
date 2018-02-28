const CronJob = require('cron').CronJob
const command = require('./command')
const client = require('./client')

const job = new CronJob({
  cronTime: '*/30 * * * * *',
  onTick: function () {
    command.getConn(function (err, res) {
      if (!err) {
        let {up, connecting} = res
        let message = `up:${up}:conn:${connecting}`
        client.send(message)
      }
    })
  },
  start: false,
})
job.start()
module.exports = job
