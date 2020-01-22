var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false,
    point: 0
  },

  onLoad: function (e) {
    this.setData({
      point: parseFloat(e.point)
    })
  },

  //按钮点击
  buttonClick: function (param) {
    var click = util.buttonClicked(this);
    if (!click) {
      return
    }
    var that = this
    wx.navigateTo({
      url: param.currentTarget.dataset.url
    })
  },
})