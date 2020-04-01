
window.User_List = {}
window.USER_ID = null

cc.Class({
  extends: cc.Component,

  properties: {
    Thing: cc.Node,
    character: cc.Prefab,
  },
  onLoad () {

    // 绑定键盘事件
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);


    window.Worm_ws = new WebSocket("ws://180c7829.nat123.cc:44338");
    //申请一个WebSocket对象，参数是服务端地址，同http协议使用http://开头一样，WebSocket协议的url使用ws://开头，另外安全的WebSocket协议使用wss://开头
    window.Worm_ws.onopen = function () {
      //当WebSocket创建成功时，触发onopen事件
      console.log("open");
      window.Worm_ws.send(JSON.stringify({ code: 0 })); //将消息发送到服务端
    }
    // window.Worm_ws.onmessage = function (e) {
    //   //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
    //   console.log(e.data);
    // }
    // window.Worm_ws.onclose = function (e) {
    //   //当客户端收到服务端发送的关闭连接请求时，触发onclose事件
    //   console.log("close");
    // }
    window.Worm_ws.onerror = function (error) {
      //如果出现连接、处理、接收、发送数据失败的时候触发onerror事件
      console.log(error);
    }

    window.Worm_ws.addEventListener('message', (e) => {
      //当客户端收到服务端发来的消息时，触发onmessage事件，参数e.data包含server传递过来的数据
      var rel = JSON.parse(e.data)
      switch (rel.code) {
        case 0:
          var data = rel.data
          for (var i = 0; i < data.length; i++) {
            switch (data[i].v) {
              // 创建自己
              case 0:
                window.User_List[data[i].data.id] = data[i].data
                this.createCharacters(data[i].data)
                break;
              // 移除自身
              case 1:
                this.removeCharacters(data[i].data)
                break;
              // 键盘事件
              case 2:
                if (!window.User_List[data[i].data.id].key) window.User_List[data[i].data.id].key = {}
                for (var b in data[i].data.cont) window.User_List[data[i].data.id].key[b] = data[i].data.cont[b]
                break;
            }
          }
          break;
        // 创建其他人
        case 1000:
          window.USER_ID = rel.data.id
          for (var i in rel.data.userList) {
            window.User_List[rel.data.userList[i].id] = rel.data.userList[i]
            this.createCharacters(rel.data.userList[i])
          }
      }

    })
  },
  start () {

  },
  onKeyDown (event) {
    if (event.keyCode == cc.macro.KEY.a || event.keyCode == cc.macro.KEY.d || event.keyCode == cc.macro.KEY.w || event.keyCode == cc.macro.KEY.s) {
      window.Worm_ws.send(JSON.stringify({ code: 2, data: { ["k" + event.keyCode]: true } }))
    }
  },
  onKeyUp (event) {
    if (event.keyCode == cc.macro.KEY.a || event.keyCode == cc.macro.KEY.d || event.keyCode == cc.macro.KEY.w || event.keyCode == cc.macro.KEY.s) {
      window.Worm_ws.send(JSON.stringify({ code: 2, data: { ["k" + event.keyCode]: false } }))
    }
  },
  update (dt) {
    for (var i in window.User_List) {
      if (window.User_List[i] && window.User_List[i].key) {
        if (window.User_List[i].key['k' + cc.macro.KEY.a]) {
          window.User_List[i].x -= window.User_List[i].speed * dt
        }
        if (window.User_List[i].key['k' + cc.macro.KEY.d]) {
          window.User_List[i].x += window.User_List[i].speed * dt
        }
        if (window.User_List[i].key['k' + cc.macro.KEY.w]) {
          window.User_List[i].y -= window.User_List[i].speed * dt
        }
        if (window.User_List[i].key['k' + cc.macro.KEY.s]) {
          window.User_List[i].y += window.User_List[i].speed * dt
        }
        window.User_List[i].node.x = window.User_List[i].x
        window.User_List[i].node.y = window.User_List[i].y * -1
      }
    }
  },
  createCharacters (data) {
    var node = cc.instantiate(this.character)
    this.Thing.addChild(node)
    node.setPosition(data.x, data.y * -1)
    window.User_List[data.id].node = node
    console.log(window.User_List[data.id]);

  },
  removeCharacters (data) {
    window.User_List[data].node.destroy()
    delete window.User_List[data]
  }

});

//   createCharacters (data) {
//     Worm_UserInfo.User_List = data
//     for (var i in data) {
//       var node = cc.instantiate(this.character)
//       this.Thing.addChild(node);
//       node.setPosition(data[i].x, data[i].y * -1);
//       Worm_UserInfo.User_List[i].node = node
//     }
//   },
//   updateCharacters (data) {
//     for (var i in data) {

//       if (!Worm_UserInfo.User_List[i]) {
//         var node = cc.instantiate(this.character)
//         Worm_UserInfo.User_List[i] = {}
//         Worm_UserInfo.User_List[i].node = node
//         this.Thing.addChild(node);
//       }
//       for (var p in data[i]) { Worm_UserInfo.User_List[i][p] = data[i][p] }
//       Worm_UserInfo.User_List[i].node.setPosition(data[i].x, data[i].y * -1);
//     }
//   },
//   removeCharacters (data) {
//     Worm_UserInfo.User_List[data].node.destroy()
//   }

// });
