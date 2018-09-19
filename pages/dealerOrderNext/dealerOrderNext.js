import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()


Page({
  data: {
   num:1,
   mainData:[],
   searchItem:{
      thirdapp_id:'2',
      user_type:0,
      pay_status : '1',
      transport_status : '0',
      order_step : '0',  
    },
    buttonClicked:false,
  },


  onLoad(options){
    const self = this;
    if(options.num){
      self.changeSearch(options.num)
    }
    this.setData({
   	  fonts:app.globalData.font
    });
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getMainData()
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
      create_time:'desc'
    }
    postData.getAfter={
      user:{
        tableName:'user',
        middleKey:'user_no',
        key:'user_no',
        searchItem:{
          parent_no:['=',wx.getStorageSync('threeInfo').user_no]
        },
        condition:'='
      } 
    }
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','fail');
      };
      self.setData({
        buttonClicked:false,
      })
      wx.hideLoading();
      self.setData({
        web_mainData:self.data.mainData,
      });  
    };
    api.orderGet(postData,callback);
  },

  deleteOrder(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('threeToken');
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id');
    const callback  = res=>{
      api.dealRes(res);
      self.getMainData(true);
    };
    api.orderDelete(postData,callback);
  },

  orderUpdate(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('threeToken');
    postData.data ={
      transport_status:2,
      order_step:3
    }
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id');
    const callback  = res=>{
      api.showToast('已确认收货','fail');
      self.getMainData(true);
    };
    api.orderUpdate(postData,callback);
  },



  pay(e){
    const self = this;
    var id = api.getDataSet(e,'id');
    var score = api.getDataSet(e,'score')
    const postData = {
      token:wx.getStorageSync('threeToken'),
      searchItem:{
        id:id
      },
      score:score
    };
    const callback = (res)=>{
      wx.hideLoading();
      self.getMainData(true)   
    };
    api.pay(postData,callback);
  },


  menuClick: function (e) {
    const self = this;
    self.setData({
      buttonClicked:true,
    })
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },

  changeSearch(num){
    const self = this;
    this.setData({
      num: num
    });
    if(num=='1'){
      self.data.searchItem.pay_status = '1';
      self.data.searchItem.transport_status = '0';
      self.data.searchItem.order_step = '0';
    }else if(num=='2'){
      self.data.searchItem.pay_status = '1';
      self.data.searchItem.order_step = '0';
      self.data.searchItem.transport_status = '1';
    }else if(num=='3'){
      self.data.searchItem.pay_status = '1';
      self.data.searchItem.order_step = '0';
      self.data.searchItem.transport_status = '2';
    }else if(num=='4'){
      self.data.searchItem.pay_status = '1';
      self.data.searchItem.order_step = '0';
      self.data.searchItem.transport_status = '3';
    }
    self.setData({
      web_mainData:[],
    });
    self.getMainData(true);
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

  intoPathRedi(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'redi');
  },

  intoPathRela(e){
    const self = this;
    api.pathTo(api.getDataSet(e,'path'),'rela');
  },


})
