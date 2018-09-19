import {Api} from '../../utils/api.js';
var api = new Api();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
   mainData:[]
  
  },
    


  onLoad(){
    const self = this;
  },

  onShow(){
    const self = this;
    self.userInfoGet()
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


  userInfoGet(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData = res.info.data[0];
      }   
      self.setData({
        web_mainData:self.data.mainData
      });
      console.log(self.data.mainData)
      wx.hideLoading();
    };
    api.userGet(postData,callback);
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

  intoPathRela(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'rela');
  },

 

  removeStorageSync(){
    const self = this;
    api.logOff();
  },


 
})

  