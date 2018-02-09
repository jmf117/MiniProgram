// friends.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    icon_male:"../images/friends/male-48.png",
    icon_female:"../images/friends/female-48.png",
    friends_num:0,
    haveRequested:false,
    mayor_available:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var now_timestamp = Date.parse(new Date());
    var before_timestamp = 0;
    before_timestamp = app.globalData.discoverLastTime;
    if (before_timestamp == undefined) { 
      //之前没有按过发现，保持false
    }else{
      //之前按过发现，计算时间差，大于5min则重置haveRequested为false
      var difference = (now_timestamp - before_timestamp) / 1000;
      if ((difference / 60) >= 5){
        this.setData({
          haveRequested:false
        });
      }
    }
    if(!this.data.haveRequested){
      this.requestForFriends();
    }
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  /**
   * 向服务器发送请求信息, 收到请求信息并设置页面data
   */
  requestForFriends:function (){
    var that = this;
    wx.request({
      url: 'https://40525433.fudan-mini-program.com/cgi-bin/Discover',
      method: 'POST',
      data: {
        openid: app.globalData.openid,
        sessionid: app.globalData.sessionid,
        latitude: app.globalData.latitude,
        longitude: app.globalData.longitude
      },
      success: function (res) {
        console.log("[Friends] response:");
        console.log(res.data);
        if (res.data.status == "OK") {
          var friends_num = res.data.user_num;
          var friends_infos = res.data.users;
          var noFriends = (friends_num == 0);
          var mayor_available = false;
          if(!noFriends){
            var first_mayor_count = friends_infos[0].mayor_count;
            mayor_available = (first_mayor_count>=0);
          }

          console.log("[Friends] mayor_count available: "+mayor_available);

          if(mayor_available){
            for(var user in friends_infos){
              var calling_name = "TA";
              if(user.gender==1){
                calling_name = "他";
              }else if(user.gender==2){
                calling_name = "她";
              }
              if(user.mayor_count==0){
                user.king_words = calling_name +"现在不是任何地方的地主";
              }else{
                user.king_words = calling_name + "是 "+user.mayor_count+" 个地方的地主~";
              }
            }
          }

          that.setData({
            friends_num: friends_num,
            friends_infos:friends_infos,
            noFriends:noFriends,
            haveRequested:true,
            mayor_available:mayor_available
          });
        } else {
          wx.showModal({
            title: '提示',
            content: '获取信息失败',
            showCancel: false
          });
        }
      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: '获取信息失败',
          showCancel: false
        });
      }
    });
   
  }
})