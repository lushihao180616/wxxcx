var util = require('../../utils/util.js');
Page({

  data: {
    openId: null,
    userInfo: null,
    type_array: [],

    nowExpress: null,
    showButton: true, //本页面是否展示按钮
    nowExpressIndex: -1, //当前任务是接收任务列表的第几项
    type1num: 0,
    type2num: 0,
    type3num: 0,
    type4num: 0
  },

  onLoad: function (e) {
    var that = this
    that.setData({
      nowExpress: JSON.parse(e.express),
      showButton: Boolean(parseInt(e.showButton)),
      nowExpressIndex: parseInt(e.index)
    })
    wx.getStorage({
      key: 'openId',
      success: function (res) {
        that.setData({
          openId: res.data
        })
      },
    })
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data
        })
      },
    })
  },

  getExpress: function (e) {
    var that = this
    var id = this.data.nowExpress.id
    var getUserOpenId = this.data.openId
    var getTime = util.formatTime(new Date())

    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2] //上一个页面

    wx.showModal({
      content: '是否确定接收此快递任务？',
      confirmText: '接收',
      cancelText: '再想想',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.host_port_project + "express/getExpress",
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
              if (res.data.ifSuccess) {
                if (that.data.showButton) {
                  prevPage.setData({ //告诉接任务列表需要删除那个任务
                    selectExpressIndex: that.data.nowExpressIndex
                  })
                }
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
        if (res.cancel) {
          return
        }
      }
    })
  }

})