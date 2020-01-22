const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeMdHm = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeyMd = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('/')
}

const formatStringToDate = str => {
  str = str.toString()
  const arr = str.split(" ")
  const year = parseInt(arr[0].split("/")[0])
  const month = parseInt(arr[0].split("/")[1])
  const day = parseInt(arr[0].split("/")[2])

  const hour = parseInt(arr[1].split(":")[0])
  const minute = parseInt(arr[1].split(":")[1])
  const second = parseInt(arr[1].split(":")[2])

  var date = new Date()
  date.setFullYear(year)
  date.setMonth(month - 1)
  date.setDate(day)
  date.setHours(hour)
  date.setMinutes(minute)
  date.setSeconds(second)

  return date
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const getListIndex = (list, id) => {
  for (var index in list) {
    if (list[index].id == id) {
      return parseInt(index)
    }
  }
  return 0
}

const requestFile = param => {
  wx.showModal({
    content: param.content,
    showCancel: false,
    confirmText: param.confirmText,
    success: function(res) {}
  })
}

const getDeadTimeData = n => {
  const date = new Date();

  const monthDay = [];
  const hours = [];
  const minute = [];

  // 月-日   第一列
  for (var i = 0; i <= 4; i++) {
    const date1 = new Date(date);
    date1.setDate(date.getDate() + i);
    const ymd = formatTimeyMd(date1);
    monthDay.push(ymd);
  }

  // 时   第二列
  for (var i = 0; i < 24; i++) {
    hours.push(formatNumber(i));
  }

  // 分   第三列
  for (var i = 0; i < 60; i += 10) {
    minute.push(formatNumber(i));
  }

  const multiArray = [];
  multiArray[0] = monthDay;
  multiArray[1] = hours;
  multiArray[2] = minute;

  return multiArray;
}

function buttonClicked(self) {
  if(self.data.buttonClicked){
    return false
  }
  self.setData({
    buttonClicked: true
  })
  setTimeout(function () {
    self.setData({
      buttonClicked: false
    })
  }, 1500)
  return true
}

function showLoading(message) {
  if (wx.showLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.showLoading({
      title: message,
      mask: true
    });
  } else {
    // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
    wx.showToast({
      title: message,
      icon: 'loading',
      mask: true,
      duration: 20000
    });
  }
}

function hideLoading() {
  if (wx.hideLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.hideLoading();
  } else {
    wx.hideToast();
  }
}

module.exports = {
  formatTime: formatTime,
  formatTimeMdHm: formatTimeMdHm,
  formatTimeyMd: formatTimeyMd,
  formatStringToDate: formatStringToDate,
  formatNumber: formatNumber,

  requestFile: requestFile,
  getDeadTimeData: getDeadTimeData,
  getListIndex: getListIndex,

  //方法
  buttonClicked: buttonClicked,
  showLoading: showLoading,
  hideLoading: hideLoading
}