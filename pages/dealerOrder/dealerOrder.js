import {Api} from '../../utils/api.js';
var api = new Api();
var app = getApp()


Page({
  data: {
    num:0,
    mainData:[],
    searchItem:{
      thirdapp_id:'2',
      pay_status : '0',
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

    if(wx.getStorageSync('info').behavior==0&&!wx.getStorageSync('threeToken')){
      self.data.title = '普通用户',
      self.data.token = wx.getStorageSync('token')
    }else if(wx.getStorageSync('info').behavior==1&&!wx.getStorageSync('threeToken')){
      self.data.title = '代理商',
      self.data.token = wx.getStorageSync('token')
    }else if(wx.getStorageSync('threeToken')){
      self.data.title = '经销商',
      self.data.token = wx.getStorageSync('threeToken')
    };
    self.getMainData()
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
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      }else{
        self.data.isLoadAll = true;
        api.showToast('没有更多了','none');
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
    postData.token = self.data.token;
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
    postData.token = self.data.token;
    postData.data ={
      transport_status:3,
      order_step:2
    }
    postData.searchItem = {};
    postData.searchItem.id = api.getDataSet(e,'id');
    const callback  = res=>{
      api.showToast('已确认收货','none');
      self.getMainData(true);
    };
    api.orderUpdate(postData,callback);
  },






  menuClick: function (e) {
    const self = this;
    self.setData({
      buttonClicked:true,
    })
    const num = e.currentTarget.dataset.num;
    self.changeSearch(num);
  },

  pay(e){
    const self = this;
    var id = api.getDataSet(e,'id');
    var price = api.getDataSet(e,'price')
    const postData = {
      token:self.data.token,
      searchItem:{
        id:id
      },
      wxPay:price,
      wxPayStatus:0
    };
    if(self.data.token==wx.getStorageSync('threeToken')){
      postData.openid = wx.getStorageSync('info').openid
    };
    const callback = (res)=>{
      wx.hideLoading();
      if(res.solely_code==100000){
      const payCallback=(payData)=>{
        if(payData==1){
         self.getMainData(true)
        };   
      };
        api.realPay(res.info,payCallback);  
      }else{
        api.showToast('发起微信支付失败','none')
      };
    };
    api.pay(postData,callback);
  },

  changeSearch(num){
    const self = this;
    this.setData({
      num: num
    });
    self.data.searchItem = {};
    if(num=='0'){
      self.data.searchItem.pay_status = '0';
    }else if(num=='1'){
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
