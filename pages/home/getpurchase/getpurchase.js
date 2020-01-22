//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    building_image: "../../../utils/image/building.png",
    type_image: "../../../utils/image/type.png",
    price_image: "../../../utils/image/price.png",

    building_array: [{
      id: 0,
      name: "全部"
    }],
    building_index: 0,

    type_array: [{
      id: 0,
      name: "全部"
    }],
    type_index: 0,

    price_array: [{
      id: 0,
      name: "无过滤"
    }, {
      id: 1,
      name: "由高到低"
    }],
    price_index: 0,

    purchase_array: [],

    num: 20,
    page: 1
  },

  onLoad: function () {
    var that = this
    wx.getStorage({
      key: 'building_array',
      success: function (res) {
        console.log(res.data)
        that.setData({
          building_array: that.data.building_array.concat(res.data)
        })
      },
    })
    that.setData({
      type_array: that.data.type_array.concat(app.globalData.type_array)
    })
    wx.getStorage({
      key: 'address_array',
      success: function (res) {
        that.setData({
          address_array: res.data
        })
        if (res.data.length == 0) {
          wx.showModal({
            content: '请您登录并至少填写一个收货地址',
            showCancel: false,
            confirmText: '登录',
            success: function (res) {
              wx.switchTab({
                url: '../../my/my',
              })
            }
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          content: '请您登录并至少填写一个收货地址',
          showCancel: false,
          confirmText: '登录',
          success: function (res) {
            wx.switchTab({
              url: '../../my/my',
            })
          }
        })
      }
    })
  },

  onShow: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.host_port_project + "purchase/getPurchases",
      data: {
        num: that.data.num,
        page: that.data.page
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.data.ifSuccess) {
          that.setData({
            purchase_array: res.data.purchase_list
          })
        } else {
          that.setData({
            purchase_array: []
          })
        }
      }
    })
  },

  // 建筑物过滤条件
  buildingChange: function (e) {
    this.setData({
      building_index: e.detail.value
    })
    if (this.data.building_index != 0) {
      this.setData({
        building_image: "../../../utils/image/building_select.png"
      })
    } else {
      this.setData({
        building_image: "../../../utils/image/building.png"
      })
    }
    this.toSelect()
  },

  // 类型过滤条件
  typeChange: function (e) {
    this.setData({
      type_index: e.detail.value
    })
    if (this.data.type_index != 0) {
      this.setData({
        type_image: "../../../utils/image/type_select.png"
      })
    } else {
      this.setData({
        type_image: "../../../utils/image/type.png"
      })
    }
    this.toSelect()
  },

  toSelect: function (e) {
    var thisPageData = this.data;
    var buildingId = 0;
    var typeId = 0;
    if (thisPageData.building_index != 0) {
      buildingId = thisPageData.building_array[thisPageData.building_index].id
    }
    if (thisPageData.type_index != 0) {
      typeId = thisPageData.type_array[thisPageData.type_index].id
    }
    var that = this;
    wx.request({
      url: getApp().globalData.host_port_project + "purchase/filterPurchases",
      data: {
        num: that.data.num,
        page: that.data.page,
        buildingId: buildingId,
        typeId: typeId
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.data.ifSuccess) {
          that.setData({
            purchase_array: res.data.purchase_list
          })
        } else {
          that.setData({
            purchase_array: []
          })
        }
      }
    })
  },

  // 跳转到任务详情页
  toPurchaseDetailPage: function (e) {
    var purchase = this.data.purchase_array[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '../../../publicpages/purchasedetail/purchasedetail?purchase=' + JSON.stringify(purchase) + '&showButton=1'
    })
  }
})