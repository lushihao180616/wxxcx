var util = require('../../../../utils/util.js');
Page({

  data: {
    openId: null,
    record_lastid: 0,
    record_list: [],
    ifContinueRequest: true
  },

  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'openId',
      success: function (res) {
        that.setData({
          openId: res.data
        })
        that.showRecord()
      }
    })
  },

  onShow: function () {
    this.showRecord()
  },

  onReachBottom: function () {
    this.showRecord()
  },

  showRecord: function () {
    var that = this
    if (!that.data.ifContinueRequest) {
      return
    }
    var openId = that.data.openId
    var record_lastid = that.data.record_lastid
    if (openId == null) {
      return
    }
    util.showLoading("加载中");
    wx.request({
      url: getApp().globalData.host_port_project + "point/getPointRecords",
      data: {
        openId: openId,
        record_lastId: record_lastid
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.data.ifSuccess) {
          if (res.data.bean.record_list.length > 0) {
            that.setData({
              record_list: that.data.record_list.concat(res.data.bean.record_list),
              record_lastid: that.data.record_list.length + res.data.bean.record_list.length
            })
          } else {
            that.setData({
              ifContinueRequest: false
            })
          }
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
  }
})