//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: null,
    purchase_array: [],

    color_array: [{ color: "#999" }, { color: "none" }],

    statusId: 2
  },

  //页面加载
  onShow: function () {
    this.setData({
      openId: app.globalData.userInfo.openId
    })
    var that = this;
    wx.request({
      url: getApp().globalData.host_port_project + "purchase/getGetPurchase",
      data: {
        getUserOpenId: that.data.openId,
        statusId: that.data.statusId
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

  changeColor: function (e) {
    this.setData({
      purchase_array: []
    })
    var value = e.currentTarget.dataset['index']
    for (var i = 0; i < this.data.color_array.length; i++) {
      this.data.color_array[i].color = "none"
    }
    this.data.color_array[value].color = "#999"
    this.setData({
      color_array: this.data.color_array,
      statusId: parseInt(value) + 2
    })
    this.onShow()
  },

  // 跳转到任务详情页
  toPurchaseDetailPage: function (e) {
    var purchase = this.data.purchase_array[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '../../../publicpages/purchasedetail/purchasedetail?purchase=' + JSON.stringify(purchase)
    })
  },

  callGetUser: function (e) {
    var purchase = this.data.purchase_array[e.currentTarget.dataset.index];
    var phone = purchase.sendUserInfo.phoneNumber;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {
      },
      fail: function () {
      }
    })
  },

  canclePurchase: function (e) {
    var purchase = this.data.purchase_array[e.currentTarget.dataset.index];
    var that = this;

    wx.showModal({
      content: '发任务用户申请取消了哦，您同意取消该任务吗？点击同意将终止该任务的执行！',
      confirmText: '同意',
      cancelText: '不同意',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.host_port_project + "purchase/getCanclePurchase",
            data: {
              purchaseId: purchase.id
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              var responsedata = res.data;
              if(responsedata.ifSuccess){
                that.onShow();
              }
            }
          })
        }
      }
    })
  },

  completePurchase: function (e) {
    var purchase = this.data.purchase_array[e.currentTarget.dataset.index];
    var that = this;
    var nowGetUserComplete = !purchase.getUserComplete;

    var nowCantent;
    var nowConfirmText;
    var nowCancelText;
    if (purchase.getUserComplete) {
      nowCantent = '您将撤销任务的完成申请';
      nowConfirmText = '我要撤销';
      nowCancelText = '不要撤销';
    } else {
      nowCantent = '您确定已经完成该任务，将目标物品交付给发送任务用户了吗';
      nowConfirmText = '确定';
      nowCancelText = '取消';
    }
    wx.showModal({
      content: nowCantent,
      confirmText: nowConfirmText,
      cancelText: nowCancelText,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.host_port_project + "purchase/getCompletePurchase",
            data: {
              purchaseId: purchase.id,
              getUserComplete: nowGetUserComplete
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              var responsedata = res.data;
              if (responsedata.ifSuccess) {
                purchase.getUserComplete = nowGetUserComplete
                that.onShow()
              }
              that.setData({
                purchase_array: that.data.purchase_array
              })
            }
          })
        }
      }
    })
  }
})