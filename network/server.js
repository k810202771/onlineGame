// 1 引入模块
const worm = require('./worm');
// const net = require('net');
const ws = require('nodejs-websocket')
const Config = require('./config')

// 用户组
let clientArr = {};
// 用户坐标
let userInfo = {};
// 帧数据
var FrameData = []

setInterval(function () {
  if (FrameData.length > 0) {
    Config.getGroupSend(clientArr, 0, FrameData)
    FrameData = []
  }
}, 1000 / 15)

// 2 创建服务器
const server = ws.createServer(connection => {
  // 记录链接的进程
  connection.id = 'W' + worm.md5(connection.socket.remoteAddress + connection.socket.remotePort);
  // 是否握手
  clientArr[connection.id] = connection;

  console.log(connection.id, '还有' + Object.keys(clientArr).length + '位玩家');
  connection.on('text', function (result) {
    var data = JSON.parse(result)

    switch (data.code) {
      // 创建角色
      case Config.code.Create:
        // 发送之前的所有角色
        Config.getSend(connection, Config.code.self_Create, { id: connection.id, userList: userInfo })
        // 创建自己
        userInfo[connection.id] = {
          id: connection.id,
          x: parseInt(Math.random() * 30 * 32),
          y: parseInt(Math.random() * 15 * 32),
          speed: parseInt(Math.random() * 50) + 60
        };
        FrameData.push({
          v: data.code,
          data: userInfo[connection.id]
        })
        break;
      case Config.code.Cmd:
        FrameData.push({
          v: data.code,
          data: {
            id: connection.id,
            cont: data.data
          }
        })
        break;

    }
    // console.log('发送消息', result)
  })

  connection.once('close', (code) => {
    delete clientArr[connection.id]
    delete userInfo[connection.id]
    // 删除退出的玩家
    FrameData.push({
      v: Config.code.Remove,
      data: connection.id
    })
  })
  connection.once('error', (code) => {
    delete clientArr[connection.id]
    delete userInfo[connection.id]
    // console.log('异常关闭', code)
  })
}).listen(800);