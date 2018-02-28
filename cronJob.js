const http = require('http')
const CronJob = require('cron').CronJob
const utils = require('./utils')
const command = require('./command')

const job = new CronJob({
  cronTime: '10 * * * * *',
  onTick: function () {
    let ip = utils.getIp()
    command.getConn(function (err, res) {
      console.log(err, res)
    })
  },
  start: false,
})
job.start()
module.exports = job
