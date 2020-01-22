
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: null,
    express_array: [],

    color_array: [{
      color: "#999"
    }, {
      color: "none"
    }, {
      color: "none"
    }],

    statusId: 2
  },

  onLoad: function () {
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
    if(that.data.openId == null){
      return
    }
    wx.request({
      url: getApp().globalData.host_port_project + "express/getGetExpress",
      data: {
        getUserOpenId: that.data.openId,
        statusId: that.data.statusId
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        console.log(res.data.bean)
        if (res.data.ifSuccess) {
          that.setData({
            express_array: res.data.bean.express_list
          })
        } else {
          that.setData({
            express_array: []
          })
        }
      }
    })
  },

  changeColor: function (e) {
    this.setData({
      express_array: []
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

  // 跳转到快递详情页
  toExpressDetailPage: function (e) {
    var express = this.data.express_array[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '../../../publicpages/expressdetail/expressdetail?express=' + JSON.stringify(express)
    })
  },

  callGetUser: function (e) {
    var express = this.data.express_array[e.currentTarget.dataset.index];
    var phone = express.sendUserInfo.userinfo.phoneNumber;
    wx.makePhoneCall({
      phoneNumber: phone,
      success: function () {},
      fail: function () {}
    })
  },

  cancleExpress: function (e) {
    var express = this.data.express_array[e.currentTarget.dataset.index];
    var that = this;

    wx.showModal({
      content: '发快递用户申请取消了哦，您同意取消该快递吗？点击同意将终止该快递的执行！',
      confirmText: '同意',
      cancelText: '不同意',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.host_port_project + "express/getCancleExpress",
            data: {
              expressId: express.id,
              getUserOpenId: express.getUserInfo.userinfo.openId,
              guarantee: express.guarantee
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              if (res.data.ifSuccess) {
                wx.setStorage({
                  key: "userInfo",
                  data: res.data.bean.userinfo
                })
                that.onShow();
              }
            }
          })
        }
      }
    })
  },

  sendExpressReward: function (e) {
    var express = this.data.express_array[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '../../../publicpages/expresstype/expresstype?express=' + JSON.stringify(express)
    })
  },

  completeExpress: function (e) {
    var express = this.data.express_array[e.currentTarget.dataset.index];
    var that = this;
    var nowGetUserComplete = !express.getUserComplete;

    var nowCantent;
    var nowConfirmText;
    var nowCancelText;
    if (express.getUserComplete) {
      nowCantent = '您将撤销快递的完成申请';
      nowConfirmText = '我要撤销';
      nowCancelText = '不要撤销';
    } else {
      nowCantent = '您确定已经完成该快递，将目标快递交付给发送快递用户了吗';
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
            url: getApp().globalData.host_port_project + "express/getCompleteExpress",
            data: {
              expressId: express.id,
              getUserComplete: nowGetUserComplete
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              var responsedata = res.data;
              if (responsedata.ifSuccess) {
                express.getUserComplete = nowGetUserComplete
                that.onShow()
              }
              that.setData({
                express_array: that.data.express_array
              })
            }
          })
        }
      }
    })
  }
})