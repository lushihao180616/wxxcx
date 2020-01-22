Page({

  /**
   * 页面的初始数据
   */
  data: {
    record_list: []
  },

  onLoad: function(e) {
    var that = this
    wx.getStorage({
      key: 'openId',
      success: function(res) {
        var openId = res.data;
        wx.request({
          url: getApp().globalData.host_port_project + "point/getPointExchangeRecord",
          data: {
            openId: openId
          },
          method: "POST",
          header: {
            'content-type': 'application/json',
          },
          success: function(res) {
            var responsedata = res.data;
            if (responsedata.ifSuccess) {
              that.setData({
                record_list: responsedata.record_list
              })
            }
          },
          fail: function(res) {
            var param = [];
            param.content = "获取数据失败";
            param.confirmText = "好的";
            util.requestFile(param);
            wx.hideLoading();
          }
        })
      },
    })
  },
})