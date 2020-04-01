const crypto = require('crypto');

// MD5加密字符串
function md5 (data) { return crypto.createHash('md5').update(data).digest('hex') }
// sha1加密字符串

function sha1 (data, dig) {
  dig = dig || 'hex'
  return crypto.createHash('sha1').update(data).digest(dig)
}
// base64编码解码
base64 = {
  encode: function (data) {
    return Buffer.from(data).toString('base64')
  },
  decode: function (data) {
    return Buffer.from(data, 'base64').toString('ascii')
  }
}
// 字符串请求头转对象
function headerStrToObj (str) {
  var nodes = str.split(/\r\n/)
  var obj = {}
  if (nodes[0].indexOf('GET') != -1) {
    for (var i = 1; i < nodes.length; i++) {
      var t = nodes[i].split(": ");
      obj[t[0]] = t[1]
    }
  }
  return obj;
}

module.exports = { md5, sha1, base64, headerStrToObj };