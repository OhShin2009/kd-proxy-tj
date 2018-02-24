/**
 * Created by frank on 2017/4/26.
 */
const Redis = require('ioredis')
const redis = new Redis({
  host: '127.0.0.1',
  port: 6379
})
redis.on('connect', function () {
  console.log('redis 连接成功')
})

redis.on('error', function (err) {
  console.error(err)
})

module.exports = redis
