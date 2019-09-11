//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {}
  },
  toSendPurchaseSelectPage: function () {
    wx.navigateTo({
      url: 'sendpurchaseselect/sendpurchaseselect'
    })
  },
  toGetPurchaseSelectPage: function () {
    wx.navigateTo({
      url: 'getpurchaseselect/getpurchaseselect'
    })
  },
  toSellGoodsSelectPage: function () {
    wx.navigateTo({
      url: 'sellgoodsselect/sellgoodsselect'
    })
  },
  toBuyGoodsSelectPage: function () {
    wx.navigateTo({
      url: 'buygoodsselect/buygoodsselect'
    })
  },
  toAddressPage: function () {
    wx.navigateTo({
      url: 'address/address'
    })
  },
  toGiftPage: function () {
    wx.navigateTo({
      url: 'gift/gift'
    })
  },
  toServicePage: function () {
    wx.navigateTo({
      url: 'service/service'
    })
  },
  toRulePage: function () {
    wx.navigateTo({
      url: 'rule/rule'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }
  }
})
