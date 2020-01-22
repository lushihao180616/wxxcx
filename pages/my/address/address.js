//获取应用实例
const app = getApp()
var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false,
    address_array: []
  },

  // 展示的时候赋值
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'address_array',
      success: function (res) {
        that.setData({
          address_array: res.data
        })
      },
    })
  },

  // 按钮点击
  buttonClick: function (param) {
    var click = util.buttonClicked(this);
    if (!click) {
      return
    }
    wx.navigateTo({
      url: param.currentTarget.dataset.url
    })
  },

  // 修改地址
  editAddress: function (e) {
    var click = util.buttonClicked(this);
    if (!click) {
      return
    }
    var address = this.data.address_array[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: 'modifyaddress/modifyaddress?address=' + JSON.stringify(address)
    })
  }
})