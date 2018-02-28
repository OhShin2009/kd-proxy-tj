const net = require('net')
const command = require('./command')
const PORT = 56789

console.info('Server is running on port ' + PORT)
const server = net.createServer()
let isReload = true

setInterval(function () {
  if (isReload) {
    command.reload(function (err) {
      if (err === null) {
        isReload = false
      } else {
        console.error('reload failed ', err)
      }
    })
  }
}, 100)

//监听连接事件
server.on('connection', function (socket) {
  //监听数据接收事件
  socket.on('data', function (data) {
    let arr = data.toString().split(':')
    let [flag, cmd] = arr
    if (flag !== 'cmd') {
      socket.destroy(new Error(`invalid cmd : ${cmd}`))
      return
    }
    if (cmd === 'register') {
      let username = arr[2]
      command.append(username, function (err, data) {
        if (err) {
          socket.destroy(err)
        } else {
          isReload = true
          socket.end(`cmd:register:${data}`)
        }
      })
    } else if (cmd === 'clean') {
      command.clean(function (err) {
        if (err) {
          socket.destroy(err)
        } else {
          socket.end('cmd:clean:ok')
        }
      })
    } else if (cmd === 'restart') {
      command.restart(function (err) {
        if (err) {
          socket.destroy(err)
        } else {
          socket.end('cmd:restart:ok')
        }
      })
    } else if (cmd === 'script') {
      let file = arr[2]
      command.executeScript(file, function (err) {
        if (err) {
          socket.destroy(err)
        } else {
          socket.end('cmd:script:ok')
        }
      })
    } else {
      socket.end('ok')
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
require('./cronJob')
