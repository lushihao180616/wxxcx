var util = require('../../utils/util.js');
Page({
  data: {
    openId: null,
    userInfo: null,
    editInfo: null,
    buttonClicked: false
  },

  // 用于修改用户信息后实时刷新
  onShow: function () {
    var that = this
    wx.getStorage({
      key: 'openId',
      success: function (res) {
        that.setData({
          openId: res.data
        })
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
    wx.getStorage({
      key: 'editInfo',
      success: function (res) {
        that.setData({
          editInfo: res.data
        })
      },
    })
  },

  //按钮点击
  buttonClick: function (param) {
    var click = util.buttonClicked(this);
    if (!click) {
      return
    }
    var that = this
    if (that.data.userInfo != null && that.data.userInfo.building_id != null) {
      wx.navigateTo({
        url: param.currentTarget.dataset.url
      })
    } else {
      wx.showModal({
        content: '主人，请先登录并完善资料哦~',
        showCancel: false,
        confirmText: '朕知道了'
      })
    }
  },

  // 修改资料
  moreInfo: function (e) {
    var click = util.buttonClicked(this);
    if (!click) {
      return
    }
    wx.navigateTo({
      url: 'editinfo/editinfo'
    })
  },

  // 登录方法
  userLogin: function (e) {
    var encryptedData = null;
    var iv = null;
    var code = null;
    var that = this;
    util.showLoading("登录中");
    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          code = res.code;
          console.log(code)
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码并保存userInfo
              wx.setStorage({
                key: "userInfo",
                data: res.userInfo
              })
              encryptedData = res.encryptedData
              iv = res.iv
              wx.request({
                url: getApp().globalData.host_port_project + "user/saveUserInfo",
                data: {
                  code: code,
                  encryptedData: encryptedData,
                  iv: iv
                },
                method: "POST",
                header: {
                  'content-type': 'application/json',
                },
                success: function (res) {
                  console.log(res)
                  that.handleResponse(res);
                },
                fail: function (res) {
                  var param = [];
                  param.content = "登录失败，请稍后再试";
                  param.confirmText = "好的";
                  util.requestFile(param);
                  util.hideLoading();
                }
              })
            },
            fail: res => {
              var param = [];
              param.content = "获取数据失败，请稍后再试";
              param.confirmText = "好的";
              util.requestFile(param);
              util.hideLoading();
            }
          })
        }
      },
      fail: res => {
        var param = [];
        param.content = "获取数据失败，请稍后再试";
        param.confirmText = "好的";
        util.requestFile(param);
        util.hideLoading();
      }
    })
  },

  handleResponse: function (res) {
    var that = this;
    var responsedata = res.data.bean;
    if (res.data.ifSuccess) {
      wx.setStorage({
        key: "openId",
        data: responsedata.userinfo.openId
      })
      wx.setStorage({
        key: "userInfo",
        data: responsedata.userinfo
      })
      wx.setStorage({
        key: "address_array",
        data: responsedata.address_list
      })
      wx.setStorage({
        key: "building_array",
        data: responsedata.building_list
      })
      var editInfo = {};
      editInfo.userinfo = responsedata.userinfo;
      editInfo.province_array = responsedata.province_list;
      editInfo.school_array = responsedata.school_list;
      editInfo.dormitory_array = responsedata.dormitory_list;
      editInfo.province_index = util.getListIndex(responsedata.province_list, responsedata.userinfo.province_id)
      editInfo.school_index = util.getListIndex(responsedata.school_list, responsedata.userinfo.school_id)
      editInfo.dormitory_index = util.getListIndex(responsedata.dormitory_list, responsedata.userinfo.dormitory_id)
      wx.setStorage({
        key: "editInfo",
        data: editInfo
      })
      that.setData({
        userInfo: responsedata.userinfo
      })
    } else {
      var param = [];
      param.content = "登录失败，请稍后再试";
      param.confirmText = "好的";
      util.requestFile(param);
    }
    util.hideLoading();
  }
})