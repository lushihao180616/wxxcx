var util = require('../../../utils/util.js');
Page({
  
  data: {
    openId: null,
    userInfo: null,
    express_array: [],

    color_array: [{ color: "#999" }, {color: "none" }, {color: "none" }, {color:"none"}, {color:"none"}],

    statusId: 1
  },

  //页面加载
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
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        that.setData({
          userInfo: res.data
        })
      },
    })
  },

  //页面展示
  onShow: function () {
    var that = this;
    if(that.data.openId == null){
      return
    }
    wx.request({
      url: getApp().globalData.host_port_project + "express/getSendExpress",
      data: {
        sendUserOpenId: that.data.openId,
        statusId: that.data.statusId
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        var responseData = res.data.bean
        if (res.data.ifSuccess) {
          that.setData({
            express_array: responseData.express_list
          })
        } else {
          that.setData({
            express_array: []
          })
        }
      }
    })
  },

  //修改颜色
  changeColor: function (e) {
    this.setData({
      express_array: []
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

  // 跳转到快递详情页
  toExpressDetailPage: function (e) {
    var express = this.data.express_array[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '../../../publicpages/expressdetail/expressdetail?express=' + JSON.stringify(express)
    })
  },

  // 修改快递
  editExpress: function (e) {
    var express = this.data.express_array[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '../../home/sendexpress/sendexpress?express=' + JSON.stringify(express) + '&flag=' + e.currentTarget.dataset.flag
    })
  },

  // 删除快递
  removeExpress: function(e) {
    var express = this.data.express_array[e.currentTarget.dataset.index];
    var that = this;
    wx.showModal({
      content: '主人，您确定要删除此快递吗？',
      confirmText: '删除',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.host_port_project + "express/removeExpress",
            data: {
              expressId: express.id
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              var responsedata = res.data;
              if (responsedata.ifSuccess){
                that.data.express_array.splice(e.currentTarget.dataset.index, 1)
                that.setData({
                  express_array: that.data.express_array
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
    var express = this.data.express_array[e.currentTarget.dataset.index];
    var phone = express.getUserInfo.userinfo.phoneNumber;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  cancleExpress: function (e) {
    var express = this.data.express_array[e.currentTarget.dataset.index];
    var that = this;
    var nowSendUserCancle = !express.sendUserCancle;

    var nowCantent;
    var nowConfirmText;
    var nowCancelText;
    var ifCancle;
    if (express.sendUserCancle) {
      nowCantent = '您将撤销快递的取消申请';
      nowConfirmText = '我要撤销';
      nowCancelText = '不要撤销';
      ifCancle = true;
    } else {
      nowCantent = '主人，请先确认已与接单人协商成功哦，否则接单人有权继续该快递';
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
            url: getApp().globalData.host_port_project + "express/sendCancleExpress",
            data: {
              expressId: express.id,
              sendUserCancle: nowSendUserCancle
            },
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              var responsedata = res.data;
              if (responsedata.ifSuccess) {
                express.sendUserCancle = nowSendUserCancle
                that.onShow()
              }
              that.setData({
                express_array: that.data.express_array
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

  modifyAndSendExpress: function(e) {
    var express = this.data.express_array[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: '../../../publicpages/expressdetail/expressdetail?express=' + JSON.stringify(express) + '&modifyAndSend=true'
    })
  },

  completeExpress: function (e) {
    var express = this.data.express_array[e.currentTarget.dataset.index];
    var that = this;
    wx.showModal({
      content: '确认该快递已完成吗？',
      confirmText: '确定',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: getApp().globalData.host_port_project + "express/sendCompleteExpress",
            data: {
              expressId: express.id,
              sendUserOpenId: express.sendUserInfo.userinfo.openId,
              getUserOpenId: express.getUserInfo.userinfo.openId,
              addressId: express.address.id
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
  }
})