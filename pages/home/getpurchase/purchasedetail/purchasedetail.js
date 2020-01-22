//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowPurchase: null
  },

  onLoad: function (e) {
    this.setData({
      nowPurchase: JSON.parse(e.purchase),
    })
  },

  backToPage: function(e) {
    var id = this.data.nowPurchase.id;
    var getUserOpenId = app.globalData.userInfo.openId;
    var getTime_real = new Date();
    var getTime = getTime_real.getFullYear() + "-" + (getTime_real.getMonth() + 1) + "-" + getTime_real.getDate() + " " +
      getTime_real.getHours() + ":" + getTime_real.getMinutes() + ":" + getTime_real.getSeconds();
    wx.request({
      url: "http://192.168.18.3/wx/purchase/dopurchase",
      data: {
        id: id,
        getUserOpenId: getUserOpenId,
        getTime: getTime
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
        wx.navigateBack({
          delta: 1
        })
      }
    })
  }
})