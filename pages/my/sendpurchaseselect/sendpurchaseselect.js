//获取应用实例
const app = getApp()
var util = require('../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openId: null,
    purchase_array: [],

    color_array: [{ color: "#999" }, {color: "none" }, {color: "none" }, {color:"none"}],

    statusId: 1
  },

  onLoad: function() {
    var that = this
    wx.getStorage({
      key: 'openId',
      success: function (res) {
        that.setData({
          openId: res.data
        })
        that.onShow();
      },
    })
  },

  //页面加载
  onShow: function () {
    var that = this;
    wx.request({
      url: getApp().globalData.host_port_project + "purchase/getSendPurchase",
      data: {
        sendUserOpenId: that.data.openId,
        statusId: that.data.statusId
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data)
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
    for(var i=0;i < this.data.color_array.length;i ++){
      this.data.color_array[i].color = "none"
    }
    this.data.color_array[value].color = "#999"
    this.setData({
      color_array: this.data.color_array,
      statusId: parseInt(value) + 1
    })
    this.onShow()
  },

  // 跳转到任务详情页
  toPurchaseDetailPage: function (e) {
    var purchase = this.data.purchase_array[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '../../../publicpages/purchasedetail/purchasedetail?purchase=' + JSON.stringify(purchase) + '&showButton=0'
    })
  },

  editPurchase: function (e) {
    var purchase = this.data.purchase_array[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '../../home/sendpurchase/sendpurchase?purchase=' + JSON.stringify(purchase)
    })
  },

  removePurchase: function(e) {
    var purchase = this.data.purchase_array[e.currentTarget.dataset.index];
    var that = this;
    wx.showModal({
      content: '主人，您确定要kill掉此任务吗？',
      confirmText: '斩首示众',
      cancelText: '饶他一命',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.host_port_project + "purchase/removePurchase",
            data: {
              purchaseId: purchase.id
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              var responsedata = res.data;
              if (responsedata.ifSuccess){
                that.data.purchase_array.splice(e.currentTarget.dataset.index, 1)
                that.setData({
                  purchase_array: that.data.purchase_array
                })
              }else{
                var param = [];
                param.content = "删除数据失败，请稍后再试";
                param.confirmText = "好的";
                util.requestFile(param);
              }
            },
            fail: function (res) {
              var param = [];
              param.content = "删除数据失败，请稍后再试";
              param.confirmText = "好的";
              util.requestFile(param);
            }
          })
        }
      }
    })
  },

  callGetUser: function(e) {
    var purchase = this.data.purchase_array[e.currentTarget.dataset.index];
    var phone = purchase.getUserInfo.phoneNumber;
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
    var nowSendUserCancle = !purchase.sendUserCancle;

    var nowCantent;
    var nowConfirmText;
    var nowCancelText;
    var ifCancle;
    if (purchase.sendUserCancle) {
      nowCantent = '您将撤销任务的取消申请';
      nowConfirmText = '我要撤销';
      nowCancelText = '不要撤销';
      ifCancle = true;
    } else {
      nowCantent = '主人，请先确认已与接单人协商成功哦，否则接单人有权继续该任务';
      nowConfirmText = '联系好了';
      nowCancelText = '先去联系';
      ifCancle = false;
    }
    wx.showModal({
      content: nowCantent,
      confirmText: nowConfirmText,
      cancelText: nowCancelText,
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.host_port_project + "purchase/sendCanclePurchase",
            data: {
              purchaseId: purchase.id,
              sendUserCancle: nowSendUserCancle
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              var responsedata = res.data;
              if (responsedata.ifSuccess) {
                purchase.sendUserCancle = nowSendUserCancle
                that.onShow()
              }
              that.setData({
                purchase_array: that.data.purchase_array
              })
            }
          })
        } else if (res.cancel) {
          if (!ifCancle) {
            that.callGetUser(e);
          }
        }
      }
    })
  },

  modifyAndSendPurchase: function(e) {
    var purchase = this.data.purchase_array[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '../../../publicpages/purchasedetail/purchasedetail?purchase=' + JSON.stringify(purchase) + '&modifyAndSend=true'
    })
  },

  completePurchase: function (e) {
    var purchase = this.data.purchase_array[e.currentTarget.dataset.index];
    var that = this;
    wx.showModal({
      content: '确认该任务已完成吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.host_port_project + "purchase/sendCompletePurchase",
            data: {
              purchaseId: purchase.id
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              var responsedata = res.data;
              if (responsedata.ifSuccess) {
                that.onShow();
              }
            }
          })
        }
      }
    })
  }
})