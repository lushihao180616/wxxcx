Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  backToPage: function(e) {
    wx.navigateBack({
      delta: 1
    })
  }
})