//logs.js
import {Api} from '../../utils/api.js';
const api = new Api();
const app = getApp()

Page({
  data: {

    mainData:[],
    userData:[],
    searchItem:{
      type:2,
      count:['<','0']
    },
  },

  
  onLoad(){
    const self = this;
    self.setData({
     fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData();
    self.getUserInfoData()
  },

  onShow(){
    const self = this;
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




  getUserInfoData(){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('threeToken');
    const callback = (res)=>{
      self.data.userData = res;
      self.setData({
        web_userData:self.data.userData,
      });
     
      wx.hideLoading();
    };
    api.userInfoGet(postData,callback);   
  },

  

  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);  
    };
    const postData = {};
    postData.paginate = api.cloneForm(self.data.paginate);
    postData.token = wx.getStorageSync('threeToken');
    postData.searchItem = api.cloneForm(self.data.searchItem)
    postData.order = {
      create_time:'desc',
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      self.setData({
        web_mainData:self.data.mainData,
      });
      wx.hideLoading();
    };
    api.flowLogGet(postData,callback);
  },


  onReachBottom() {
    const self = this;
    if(!self.data.isLoadAll){
      self.data.paginate.currentPage++;
      self.getMainData();
    };
  },

  intoPath(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'nav');
  },


 


})
