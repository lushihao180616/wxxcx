//index.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false,
    openId: null,
    pointExchangeList: []
  },

  onLoad: function () {
    var that = this;
    wx.getStorage({
      key: 'openId',
      success: function (res) {
        that.setData({
          openId: res.data
        })
      },
    })
    wx.request({
      url: getApp().globalData.host_port_project + "point/pointExchangeList",
      data: {},
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        var responsedata = res.data;
        if (responsedata.ifSuccess) {
          that.setData({
            pointExchangeList: responsedata.pointExchange_list
          })
        }
      }
    })
  },

  toExchange: function (e) {
    var click = util.buttonClicked(this);
    if (!click) {
      return
    }
    var pointExchangeId = e.currentTarget.dataset.id
    var openId = this.data.openId
    var verificationCode = null
    var ifUsed = false
    var that = this;
    wx.request({
      url: getApp().globalData.host_port_project + "point/setPointExchangeRecord",
      data: {
        pointExchangeId: pointExchangeId,
        openId: openId,
        verificationCode: verificationCode,
        ifUsed: ifUsed
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        var responsedata = res.data;
        if (responsedata.ifSuccess) {}
      }
    })
  }
})