// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  // 发送任务
  send_purchase: function () {
    wx.navigateTo({
      url: 'sendpurchase/sendpurchase'
    })
  },

  // 接受任务
  get_purchase: function () {
    wx.navigateTo({
      url: 'getpurchase/getpurchase'
    })
  },

  // 出手宝贝
  sell_goods: function () {
    wx.navigateTo({
      url: 'sellgoods/sellgoods'
    })
  },

  // 入手宝贝
  buy_goods: function () {
    wx.navigateTo({
      url: 'buygoods/buygoods'
    })
  }
})