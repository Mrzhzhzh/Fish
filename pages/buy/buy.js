import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();
import {Token} from '../../utils/token.js';
const token = new Token();

Page({
  data: {
   
    searchItem:{
       thirdapp_id:getApp().globalData.thirdapp_id
    },
    mainData:[],
    buttonClicked: false,
    submitData:{
      passage4:'',
      passage1:[]

    },
    id:'',
    cardNum:[1],
    chooseIndex:0
    
  },
  //事件处理函数


  onLoad(){
    const self = this;
    self.data.paginate = api.cloneForm(getApp().globalData.paginate);
    self.getartData();
    self.setData({
      web_cardNum:self.data.cardNum,
      web_chooseIndex: self.data.chooseIndex,
    });

  },

  onPullDownRefresh:function(){
    const self = this;
    wx.showNavigationBarLoading(); 
    self.data.cardNum = [1]
    self.data.submitData.passage1={
      passage1:[1]
    }
    self.setData({
      web_cardNum:[1],
    });
    console.log(self.data.submitData);
    self.getMainData(true)
  },

  onShow(){
    const self = this;
    if(wx.getStorageSync('info').behavior==0){
      self.data.title = '普通用户',
      self.data.token = wx.getStorageSync('token')
    }else if(wx.getStorageSync('info').behavior==1){
      self.data.title = '代理商',
      self.data.token = wx.getStorageSync('token')
    }else if(wx.getStorageSync('threeToken')){
      self.data.title = '经销商',
      self.data.token = wx.getStorageSync('threeToken')
    };
    self.getMainData();
  },


  addCardNum(){
    const self = this;
    var newCard = self.data.cardNum[self.data.cardNum.length-1] + 1;
    self.data.cardNum.push(newCard);
    self.setData({
      web_cardNum:self.data.cardNum
    });
    console.log(self.data.cardNum)
  },


  getMainData(isNew){
    const self = this;
    if(isNew){
      api.clearPageIndex(self);
    }
    const postData = {};
    postData.searchItem = api.cloneForm(self.data.searchItem);
    postData.getBefore = {
      label:{
        tableName:'label',
        searchItem:{
          title:['=',[self.data.title]],
        },
        fixSearchItem:{
          thirdapp_id:getApp().globalData.thirdapp_id
        },
        middleKey:'category_id',
        key:'id',
        condition:'in'
      },
    };
    const callback = (res)=>{
      if(res.info.data.length>0){
        self.data.mainData.push.apply(self.data.mainData,res.info.data);
      };
      wx.hideLoading();
      setTimeout(function()
      {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },300);
      self.setData({
        web_mainData:self.data.mainData,
      });     
      console.log(self.data.mainData)
    };
    api.productGet(postData,callback);
  },

  changeBind(e){
    const self = this;
    var key = api.getDataSet(e,'key');
    var index = api.getDataSet(e,'index');
    console.log('index',index);
    if(key=='passage1'){
      self.data.submitData.passage1[index]  = e.detail.value;
    }else{
      api.fillChange(e,self,'submitData');
    };
    
    console.log(self.data.submitData);
    
    self.setData({
      web_submitData:self.data.submitData,
    });  
  },



  bindPickerChange: function(e) {
    const self = this;
    console.log(e)
    self.data.chooseIndex = e.detail.value;
    self.setData({
      web_chooseIndex: self.data.chooseIndex,
    })

  },


  getartData(){
    const self = this;
    const postData = {};
    postData.searchItem = {
      thirdapp_id:getApp().globalData.thirdapp_id
    };
    postData.getBefore = {
      article:{
        tableName:'label',
        searchItem:{
          title:['=',['购买规则']],
          thirdapp_id:['=',[getApp().globalData.thirdapp_id]],
        },
        middleKey:'menu_id',
        key:'id',
        condition:'in',
      },
    };
    const callback = (res)=>{
      self.data.artData = {};
      if(res.info.data.length>0){
        self.data.artData = res.info.data[0];
        self.data.artData.content = api.wxParseReturn(res.info.data[0].content).nodes;
      };
      console.log(self.data.artData);
      wx.hideLoading();
      self.setData({
        web_artData:self.data.artData,
      });  
    };
    api.articleGet(postData,callback);
  },

  addOrder(){
    const self = this;
    if(wx.getStorageSync('info')&&wx.getStorageSync('info').thirdApp.custom_rule.firstClass){
      if(!self.data.order_id){
        self.buttonClicked = true;
        self.setData({
          buttonClicked: true
        });
        const postData = [];
        if(self.data.submitData.passage1.length>0){
          for(var i=0;i<self.data.submitData.passage1.length;i++){
            if(self.data.submitData.passage1[i]){
              postData.push(
                {
                  token:self.data.token,
                  product:[
                    {id:self.data.mainData[self.data.chooseIndex].id,count:1}
                  ],
                  pay:{wxPay:self.data.mainData[self.data.chooseIndex].price},
                  type:1,
                  data:{
                    passage1:self.data.submitData.passage1[i],
                    passage4:self.data.submitData.passage4 
                  }
                }
              );
            };
          };

        }else{
          postData.push(
            {
              token:self.data.token,
              product:[
                {id:self.data.mainData[self.data.chooseIndex].id,count:1}
              ],
              pay:{wxPay:self.data.mainData[self.data.chooseIndex].price},
              type:1,
              data:{
                passage1:'',
                passage4:self.data.submitData.passage4 
              }
            }
          );
        };
        var reward = (wx.getStorageSync('info').thirdApp.custom_rule.firstClass*self.data.mainData[self.data.chooseIndex].price)/100;
        if(wx.getStorageSync('info').behavior==1&&wx.getStorageSync('info').parent_no!=''){
          for(var i=0;i<postData.length;i++){
            postData[i].payAfter = [
              {
                tableName:'FlowLog',
                FuncName:'add',
                data:{
                  count:reward,
                  trade_info:'代理消费奖励',
                  user_no:wx.getStorageSync('info').parent_no,
                  type:2,
                  thirdapp_id:getApp().globalData.thirdapp_id
                }
              }
            ];
          };
        };
        
        console.log('postData',postData);
        const callback = (res)=>{
          if(res&&res.solely_code==100000){
            setTimeout(function(){
              self.setData({
                buttonClicked: false
              })
              self.buttonClicked = false;
            }, 1000);
            self.data.order_id = '';
            for(var i=0;i<res.info.id.length;i++){
              if(i>0){
                self.data.order_id += '-';
              };
              self.data.order_id += res.info.id[i];
            };
            self.pay(self.data.order_id);         
          }else{
            api.showToast('网络故障','none')
             self.setData({
                buttonClicked: false
              })
            self.buttonClicked = false;
          } 
        };
        api.orderAddMulti(postData,callback);
      }else{
        self.pay(self.data.order_id);
          self.setData({
            buttonClicked: false
          })
        self.buttonClicked = false;
      };
    }else{
      var token = new Token();
      const callback = (res)=>{
        self.addOrder(res)
        self.setData({
          buttonClicked: false
        })
        self.buttonClicked = false;
      };
      token.getUserInfo({},callback);
    }
  },

  pay(order_id){
    const self = this;
    var order_id = self.data.order_id;
    const postData = {
      token:self.data.token,
      orderId:order_id,
    };
    if(self.data.submitData.passage1.length>0){
      postData.price = self.data.mainData[self.data.chooseIndex].price*self.data.submitData.passage1.length;
    }else{
      postData.price = self.data.mainData[self.data.chooseIndex].price;
    };
    
    const callback = (res)=>{
      wx.hideLoading();
      if(res.solely_code==100000){
        const payCallback=(payData)=>{
          if(payData==1){
            setTimeout(function(){
              api.pathTo('/pages/userOrder/userOrder','redi');
            },800)  
          };   
        };
        api.realPay(res.info,payCallback);  
      }else{
        api.showToast('发起微信支付失败','fail')
      };
    };
    api.directPay(postData,callback);
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

  