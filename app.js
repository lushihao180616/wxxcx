//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: "http://localhost/wx/user/login",
            data: {
              code: res.code
            },
            
            method: "POST",
            header: {
              'content-type': 'application/json',
            },
            success: function (res) {
              var responsedata = res.data;
              console.log(res.data);
              console.log(res.data.password);
              console.log(res.data.userid);
              console.log(res.data.username);
            },
            fail: function (error) {
              console.log(error);
            }
          })
        } else {
          console.log("error code " + res.errMsg);
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {//当前微信小程序的全局变量
    userInfo: null,
    type_array: ['美食', '生活', '学习', '运动', '美妆', '服饰', '其他'],
    address_array: ['地址1', '地址2'],
    school_array: ['西安工业大学'],
    building_array: ['一号宿舍楼', '二号宿舍楼', '三号宿舍楼', '四号宿舍楼', '一号教学楼', '图书馆', '一号工科楼'],
  }
})