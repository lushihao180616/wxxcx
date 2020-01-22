var util = require('../../utils/util.js');
Page({

  data: {
    merchant_list: []
  },

  onShow: function () {
    var that = this
    util.showLoading("加载中");
    wx.request({
      url: getApp().globalData.host_port_project + "merchant/getMerchants",
      data: {},
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.data.ifSuccess) {
          that.setData({
            merchant_list: res.data.bean.merchant_list
          })
        }
        util.hideLoading();
      },
      fail: function (res) {
        var param = [];
        param.content = "登录失败，请稍后再试";
        param.confirmText = "好的";
        util.requestFile(param);
        util.hideLoading();
      }
    })
  },

  //按钮点击
  buttonClick: function (param) {
    var click = util.buttonClicked(this);
    if (!click) {
      return
    }
    var merchant = this.data.merchant_list[param.currentTarget.dataset.index]
    console.log(JSON.stringify(merchant))
    wx.navigateTo({
      url: param.currentTarget.dataset.url + "?code=" + JSON.stringify(merchant.code)
    })
  },
})