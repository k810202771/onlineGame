module.exports = {
  code: {
    Create: 0, // 创建角色
    Remove: 1, // 移除角色
    Cmd: 2, // 键盘事件

    // 1000+ 单体事件
    self_Create: 1000, // 创建角色组
  },
  getGroupSend (users, code, data, additional) {
    for (var i in users) {
      // 数据写入全部客户进程中
      users[i].sendText(JSON.stringify({ code: code, data: data, additional: additional }));
    }
  },
  getSend (user, code, data, additional) {
    // 数据写入全部客户进程中
    user.sendText(JSON.stringify({ code: code, data: data, additional: additional }));
  }
}