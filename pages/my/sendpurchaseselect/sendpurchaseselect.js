Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  // 跳转到任务详情页
  toPurchaseDetailPage: function (e) {
    wx.navigateTo({
      url: '../../purchasedetail/purchasedetail'
    })
  }
})