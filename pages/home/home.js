Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img3.imgtn.bdimg.com/it/u=3077861072,6095005&fm=26&gp=0.jpg',
    ]
  },

  // 发送任务
  send_purchase: function() {
    wx.navigateTo({
      url: 'sendpurchase/sendpurchase'
    })
  },

  // 接受任务
  get_purchase: function() {
    wx.navigateTo({
      url: 'getpurchase/getpurchase'
    })
  },

  // 发快递
  send_express: function () {
    wx.navigateTo({
      url: 'sendexpress/sendexpress'
    })
  },

  // 取快递
  get_express: function () {
    wx.navigateTo({
      url: 'getexpress/getexpress'
    })
  },

  // 告白墙
  confession: function () {
    wx.navigateTo({
      url: 'confession/confession',
    })
  }
})