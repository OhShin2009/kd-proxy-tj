const net = require('net')
const command = require('./command')
const client = require('./client')
const PORT = 56789

console.info('Server is running on port ' + PORT)
const server = net.createServer()

//监听连接事件
server.on('connection', function (socket) {

  client.send('event:start')
  //监听数据接收事件
  socket.on('data', function (data) {
    let arr = data.toString().split(':')
    let [flag, cmd] = arr

    if (flag !== 'cmd') {
      socket.end(`invalid cmd`)
      return
    }

    if (cmd === 'register') {
      let name = arr[2]
      let exp = arr[3]
      command.register(name, exp, function (err) {
        if (err) {
          console.error(err)
          socket.end('fail')
        } else {
          socket.end('ok')
        }
      })
      return
    }

    if (cmd === 'ping') {
      socket.end('ok')
      return
    }

    if (cmd === 'restart') {
      command.restart(function (err) {
        if (err) {
          console.error(err)
          socket.end('fail')
        } else {
          socket.end('ok')
        }
      })
      return
    }

    if (cmd === 'script') {
      let file = arr[2]
      command.executeScript(file, function (err) {
        if (err) {
          socket.end('fail')
        } else {
          socket.end('ok')
        }
      })
    }
  })

  //监听连接断开事件
  socket.on('end', function () {
    console.log('Client disconnected.')
  })

  socket.on('close', function () {
    console.log('close ... ')
  })
})

//TCP服务器开始监听特定端口
server.listen(PORT)

// 统计重启次数
process.on('SIGINT', function () {
  client.send('event:restart', function () {
    process.exit(0)
  })
})

process.on('message', function (msg) {
  console.log('msg is ', msg)
})

require('./cronJob')
