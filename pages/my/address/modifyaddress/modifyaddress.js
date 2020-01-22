var util = require('../../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    buttonClicked: false,
    openId: null,

    building_array: [],
    building_index: 0,

    nowAddress: null
  },

  onLoad: function(e) {
    var address = JSON.parse(e.address);
    var that = this;
    that.setData({
      nowAddress: address
    })
    wx.getStorage({
      key: 'openId',
      success: function(res) {
        that.setData({
          openId: res.data
        })
      },
    })
    wx.getStorage({
      key: 'building_array',
      success: function(res) {
        that.setData({
          building_array: res.data,
          building_index: util.getListIndex(res.data, address.building_id)
        })
      },
    })
  },

  buildingChange: function (e) {
    var click = util.buttonClicked(this);
    if (!click) {
      return
    }
    this.setData({
      building_index: e.detail.value
    })
  },

  modifyAddress: function (e) {
    var click = util.buttonClicked(this);
    if (!click) {
      return
    }
    var thisPageData = this.data;
    var checkBack = this.checkData(thisPageData.nowAddress.id, thisPageData.building_array[thisPageData.building_index], e.detail.value.roomcode, e.detail.value.name, e.detail.value.phoneNumber, thisPageData.openId);

    if (checkBack != '') {
      wx.showModal({
        content: checkBack,
        showCancel: false,
        confirmText: '朕知道了'
      })
      return
    }
    var id = thisPageData.nowAddress.id;
    var building_id = thisPageData.building_array[thisPageData.building_index].id;
    var roomcode = e.detail.value.roomcode;
    var name = e.detail.value.name;
    var phoneNumber = e.detail.value.phoneNumber;
    var openId = thisPageData.openId;

    wx.request({
      url: getApp().globalData.host_port_project + "address/modifyAddress",
      data: {
        id: id,
        building_id: building_id,
        roomcode: roomcode,
        name: name,
        phoneNumber: phoneNumber,
        openId: openId
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        var responsedata = res.data;
        if (responsedata.ifSuccess) {
          wx.setStorage({ key: "address_array", data: res.data.address_list })
          wx.navigateBack({
            delta: 1
          })
        } else {
          var param = [];
          param.content = "修改地址失败，请稍后再试";
          param.confirmText = "好的";
          util.requestFile(param);
        }
      },
      fail: function(res) {
        var param = [];
        param.content = "修改地址失败，请稍后再试";
        param.confirmText = "好的";
        util.requestFile(param);
      }
    })
  },

  checkData: function (id, building, roomcode, name, phoneNumber, openId) {
    var backStr = ''
    if (openId == null || openId == '' || id == null || id == '') {
      backStr += '发生未知错误'
      return backStr;
    }
    backStr += '('
    if (building == null) {
      backStr += ' 建筑物 '
    }
    if (roomcode == null || roomcode == '' || roomcode.trim() == '') {
      backStr += ' 房间号 '
    }
    if (name == null || name == '' || name.trim() == '') {
      backStr += ' 姓名 '
    }
    if (phoneNumber == null || phoneNumber == '' || phoneNumber.trim() == '') {
      backStr += ' 手机号 '
    }
    backStr += ')'

    if (backStr == '()') {
      return ''
    }
    return backStr + ' 必须填写';
  },

  deleteAddress: function () {
    var click = util.buttonClicked(this);
    if (!click) {
      return
    }
    var thisPageData = this.data;
    var id = thisPageData.nowAddress.id;
    var openId = thisPageData.openId;
    var that = this;
    wx.request({
      url: getApp().globalData.host_port_project + "address/deleteAddress",
      data: {
        id: id,
        openId: openId
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        var responsedata = res.data;
        if (responsedata.ifSuccess) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          var param = [];
          param.content = "删除地址失败，请稍后再试";
          param.confirmText = "好的";
          util.requestFile(param);
        }
      },
      fail: function(res) {
        var param = [];
        param.content = "删除地址失败，请稍后再试";
        param.confirmText = "好的";
        util.requestFile(param);
      }
    })
  }
})