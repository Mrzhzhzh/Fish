import {Api} from '../../utils/api.js';
var api = new Api();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    web_show:false,
  
  },
    


  onLoad(){
    const self = this;
     wx.showShareMenu({
      withShareTicket: true
    });
  },

  onShow(){
    const self = this;
    self.userInfoGet();
    if(wx.getStorageSync('threeInfo')&&wx.getStorageSync('threeToken')){
      self.setData({
        web_show:true
      })
    }else{
      wx.redirectTo({
        url: '/pages/login/login'
      })
    };
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  userInfoGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('threeToken');
    const callback = (res)=>{
      console.log(res)
      self.data.mainData = res;
      self.setData({
        web_mainData:self.data.mainData
      });
      wx.hideLoading();
    };
    api.userGet(postData,callback);
  },

 

  removeStorageSync(){
    api.logOff();
  },

  onShareAppMessage(res){
    const self = this;
    return {
      title: '直销商城',
      path: 'pages/index/index?parentNo='+wx.getStorageSync('ThreeInfo').user_no,
      success: function (res){
        console.log(res);
      }
    }
  }


})
  