//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    school_array: null,
    school_index: 0,

    building_array: null,
    building_index: 0,
  },

  onLoad: function () {
    this.setData({
      building_array: app.globalData.building_array,
      school_array: app.globalData.school_array
    })
  },

  schoolChange: function (e) {
    this.setData({
      school_index: e.detail.value
    })
  },

  buildingChange: function (e) {
    this.setData({
      building_index: e.detail.value
    })
  },

  toAddressPage: function (e) {
    wx.navigateBack({
      delta:1
    })
  },
})