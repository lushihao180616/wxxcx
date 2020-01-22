var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: null,
    userInfo: null,

    nowPurchase: null,
    showButton: true, //本页面是否展示按钮
    nowPurchaseIndex: -1 //当前任务是接收任务列表的第几项
  },

  onLoad: function (e) {
    var that = this
    that.setData({
      nowPurchase: JSON.parse(e.purchase),
      showButton: Boolean(parseInt(e.showButton)),
      nowPurchaseIndex: parseInt(e.index)
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

  getPurchase: function (e) {
    var that = this
    var id = this.data.nowPurchase.id
    var getUserOpenId = this.data.openId
    var getTime = util.formatTime(new Date())
    var guarantee = this.data.nowPurchase.guarantee

    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2] //上一个页面

    var needpoint = parseFloat(this.data.nowPurchase.guarantee)
    if (needpoint > that.data.userInfo.point) {
      wx.showModal({
        content: '您拥有的捎点不足以支付保证金啦',
        showCancel: false,
        confirmText: '朕知道了'
      })
      return
    }

    wx.showModal({
      content: '是否确定支付' + this.data.nowPurchase.guarantee + '捎点作为保证金？(保证金将在任务完成时返还到您的账户)',
      confirmText: '支付',
      cancelText: '再想想',
      success: function (res) {
        if(res.confirm){
          wx.request({
            url: getApp().globalData.host_port_project + "purchase/getPurchase",
            data: {
              id: id,
              getUserOpenId: getUserOpenId,
              getTime: getTime,
              guarantee: guarantee
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              if (res.data.ifSuccess) {
                if (that.data.showButton) {
                  prevPage.setData({ //告诉接任务列表需要删除那个任务
                    selectPurchaseIndex: that.data.nowPurchaseIndex
                  })
                }
                wx.setStorage({
                  key: "userInfo",
                  data: res.data.bean.userinfo
                })
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