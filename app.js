//app.js
App({
  onLaunch: function () {
    var that=this;
    wx.request({
      url: that.globalData.host_port_project + "purchasetype/getpurchasetypes",
      data: {},
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        var responsedata = res.data;
        that.globalData.type_array = responsedata;
      }
    })
  },

  globalData: {//当前微信小程序的全局变量
    type_array: [],
    host_port_project: "http://192.168.18.3:9090/sharewe/"
  }
})