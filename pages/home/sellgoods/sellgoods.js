//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type_array: null,
    type_index: 0,

    address_array: null,
    address_index: 0,
  },

  onLoad: function () {
    this.setData({
      type_array: app.globalData.type_array,
      address_array: app.globalData.address_array
    })
  },

  typeChange: function (e) {
    this.setData({
      type_index: e.detail.value
    })
  },

  addressChange: function (e) {
    this.setData({
      address_index: e.detail.value
    })
  }
})