var util = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: [],

    // 这里直接定义的性别数组
    sex_array: ["女", "男"],
    sex_index: 0,

    province_array: [],
    province_index: 0,

    school_array: [],
    school_index: 0,

    dormitory_array: [],
    dormitory_index: 0
  },

  // 生命周期函数--监听页面加载
  onLoad: function(e) {
    var that = this
    wx.getStorage({
      key: 'editInfo',
      success: function(res) {
        var editInfo = res.data
        // 传过来的参数
        that.setData({
          userinfo: editInfo.userinfo,
          province_array: editInfo.province_array,
          province_index: editInfo.province_index,
          school_array: editInfo.school_array,
          school_index: editInfo.school_index,
          dormitory_array: editInfo.dormitory_array,
          dormitory_index: editInfo.dormitory_index,
          sex_index: parseInt(editInfo.userinfo.gender)
        })
      },
    })
  },

  // 性别选择
  sexChange: function(e) {
    this.setData({
      sex_index: e.detail.value
    })
  },

  // 省份选择
  provinceChange: function(e) {
    // 学校和宿舍楼清空
    this.setData({
      province_index: e.detail.value,
      school_array: [],
      school_index: 0,
      dormitory_array: [],
      dormitory_index: 0
    })
    var that = this;
    var nowIndex = e.detail.value;
    var provinceId = this.data.province_array[nowIndex].id;
    wx.request({
      url: getApp().globalData.host_port_project + "school/getByProvince",
      data: {
        provinceId: provinceId
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        var responsedata = res.data.bean;
        if (res.data.ifSuccess) {
          that.setData({
            school_array: responsedata.school_list,
            dormitory_array: responsedata.dormitory_list
          })
        } else {
          var param = [];
          param.content = "获取学校信息失败，请稍后再试";
          param.confirmText = "朕知道了";
          util.requestFile(param);
        }
      },
      fail: function(res) {
        var param = [];
        param.content = "获取学校信息失败，请稍后再试";
        param.confirmText = "朕知道了";
        util.requestFile(param);
      }
    })
  },

  // 学校选择
  schoolChange: function(e) {
    this.setData({
      school_index: e.detail.value,
      dormitory_array: [],
      dormitory_index: 0
    })
    var that = this;
    var nowIndex = e.detail.value;
    var schoolId = this.data.school_array[nowIndex].id;
    wx.request({
      url: getApp().globalData.host_port_project + "building/getDormitory",
      data: {
        schoolId: schoolId
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        var responsedata = res.data.bean;
        console.log(res)
        if (res.data.ifSuccess) {
          that.setData({
            dormitory_array: responsedata.dormitory_list
          })
        } else {
          var param = [];
          param.content = "获取宿舍信息失败，请稍后再试";
          param.confirmText = "朕知道了";
          util.requestFile(param);
        }
      },
      fail: function(res) {
        var param = [];
        param.content = "获取宿舍信息失败，请稍后再试";
        param.confirmText = "朕知道了";
        util.requestFile(param);
      }
    })
  },

  // 宿舍选择
  dormitoryChange: function(e) {
    this.setData({
      dormitory_index: e.detail.value
    })
  },

  // 保存数据
  saveInfo: function(e) {
    var thisPageData = this.data;
    // 对数据校验
    var checkBack = this.checkData(thisPageData.userinfo, e.detail.value.nickName, thisPageData.province_array[thisPageData.province_index], thisPageData.school_array[thisPageData.school_index], thisPageData.dormitory_array[thisPageData.dormitory_index], e.detail.value.phoneNumber);

    if (checkBack != '') {
      wx.showModal({
        content: checkBack,
        showCancel: false,
        confirmText: '朕知道了'
      })
      return
    }
    var openId = thisPageData.userinfo.openId;
    var nickName = e.detail.value.nickName;
    var gender = thisPageData.sex_index;
    var province_id = thisPageData.province_array[thisPageData.province_index].id;
    var school_id = thisPageData.school_array[thisPageData.school_index].id;
    var building_id = thisPageData.dormitory_array[thisPageData.dormitory_index].id;
    var phoneNumber = e.detail.value.phoneNumber;
    var avatarUrl = thisPageData.userinfo.avatarUrl;
    var that = this;

    wx.request({
      url: getApp().globalData.host_port_project + "user/modifyUserInfo",
      data: {
        openId: openId,
        nickName: nickName,
        gender: gender,
        province_id: province_id,
        school_id: school_id,
        building_id: building_id,
        phoneNumber: phoneNumber,
        avatarUrl: avatarUrl
      },
      method: "POST",
      header: {
        'content-type': 'application/json',
      },
      success: function(res) {
        that.handleResponse(res);
      },
      fail: function(res) {
        var param = [];
        param.content = "更新用户信息数据失败，请稍后再试";
        param.confirmText = "好的";
        util.requestFile(param);
      }
    })
  },

  checkData: function(userinfo, nickName, province, school, building, phoneNumber) {
    console.log(userinfo + "   " + nickName + "   " + province + "   " + school + "   " + building + "   " + phoneNumber)
    var backStr = ''
    if (userinfo == null || userinfo.openId == null || userinfo.openId == '') {
      backStr += '发生未知错误'
      return backStr;
    }
    backStr += '('
    if (nickName == null || nickName == '' || nickName.trim() == '') {
      backStr += ' 昵称 '
    }
    if (province == null) {
      backStr += ' 省份 '
    }
    if (school == null) {
      backStr += ' 学校 '
    }
    if (building == null) {
      backStr += ' 宿舍楼 '
    }
    if (phoneNumber == null || phoneNumber == '') {
      backStr += ' 手机号 '
    }
    backStr += ')'

    if (backStr == '()') {
      return ''
    }
    return backStr + ' 必须填写';
  },

  handleResponse: function(res) {
    var that = this;
    var responsedata = res.data.bean;
    if (res.data.ifSuccess) {
      wx.setStorage({
        key: "userInfo",
        data: responsedata.userinfo
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
      editInfo.dormitory_index = util.getListIndex(responsedata.dormitory_list, responsedata.userinfo.building_id)
      wx.setStorage({
        key: "editInfo",
        data: editInfo
      })
      wx.navigateBack({
        delta: 1
      })
    } else {
      var param = [];
      param.content = "更新用户信息数据失败，请稍后再试";
      param.confirmText = "好的";
      util.requestFile(param);
    }
  },
})