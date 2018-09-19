import {Api} from '../../utils/api.js';
var api = new Api();
const app = getApp();


Page({
  data: {
    isShow:false,
    submitData:{
      passage1:'',
      passage2:'',
      passage3:'',
      passage4:'',
      codeOne:''
    },
    code:'',
   
    
  },
  //事件处理函数
 
  onLoad(options) {
    const self = this;
    self.getartData();
    getApp().globalData.address_id = '';
    if(options.passage1){
      self.data.submitData.passage1 = options.passage1
    };
    self.setData({
      web_submitData:self.data.submitData,
    });
    self.createCode()
  },


  onShow(){
    const self = this;
    self.data.searchItem = {};
    if(getApp().globalData.address_id){
      self.data.searchItem.id = getApp().globalData.address_id;
    }else{
      self.data.searchItem.isdefault = 1;
    };
    self.getAddressData();
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
          title:['=',['提货规则']],
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

  getAddressData(){
    const self = this;
    const postData = {}
    postData.token = wx.getStorageSync('token');
    postData.searchItem = api.cloneForm(self.data.searchItem);
    const callback = (res)=>{
      self.data.addressData = res;
      self.setData({
        web_addressData:self.data.addressData,
      });
    };
    api.addressGet(postData,callback);
  },

  orderUpdate(e){
    const self = this;
    const postData = {};
    postData.token = wx.getStorageSync('token');
    postData.data = {
      passage1:self.data.submitData.passage1,
      passage2:self.data.submitData.passage2,
      passage3:self.data.submitData.passage3,
      passage4:self.data.submitData.passage4,
      snap_address:self.data.addressData.info.data[0]
    }
    const callback  = res=>{
      if(res.solely_code==100000){
        self.data.submitData={
            passage1:'',
            passage2:'',
            passage3:'',
            passage4:'',
            codeOne:''
          };
        self.setData({
          web_submitData:self.data.submitData,
        });
        self.confirm();
      }else{
        api.showToast('网络故障','none')
      };    
    };
    api.orderUpdate(postData,callback);
  },


  submit(){
    const self = this;
    var phone = self.data.submitData.phone;
    const pass = api.checkComplete(self.data.submitData);
    if(pass){
      if(phone.trim().length != 11 || !/^1[3|4|5|6|7|8|9]\d{9}$/.test(phone)){
        api.showToast('手机格式不正确','none')
      }else{    
          wx.showLoading();
          const callback = (user,res) =>{
            self.orderUpdate(); 
          };
          api.getAuthSetting(callback);      
      }
    }else{
      api.showToast('请补全信息','none');
    };
  },

  changeBind(e){
    const self = this;
    api.fillChange(e,self,'submitData');
    console.log(self.data.submitData);
    self.setData({
      web_submitData:self.data.submitData,
    }); 
  

    if(api.getDataSet(e,'key')=='passage2'&&self.data.submitData.passage1&&self.data.submitData.passage2){
        self.orderGet()
    };

    if(api.getDataSet(e,'key')=='codeOne'&&self.data.submitData.codeOne){
      var codeOne = self.data.submitData.codeOne.toUpperCase();
      console.log(codeOne)
      if(codeOne!=self.data.code){
        api.showToast('验证码输入错误','none');
        self.data.submitData.codeOne = '',
        self.setData({
          web_submitData:self.data.submitData,
        });
        self.createCode()
      }
    };
   
  },


  orderGet(){
    const self = this;
    const postData = {
      searchItem:{
        passage1:self.data.submitData.passage2,
        passage2:self.data.submitData.passage3,
        user_no:wx.getStorageSync('info').user_no
      },

      token:wx.getStorageSync('token')
    };
    const callback = (res)=>{
      if(res.info.data.length==0){
        api.showToast('卡号填写错误','none');
        self.data.submitData.passage1='';
        self.data.submitData.passage2='';
        self.setData({
          web_submitData:self.data.submitData,
        });
      }
    };
    api.orderGet(postData,callback);
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

  show(){
    const self = this;
    self.setData({
      isShow:false,
    })
  },

  confirm(){
    const self = self;
    this.setData({
      isShow:true,
    })
  },

  createCode() {
    const self = this;
    var code = '';
    var codeLength = 4;
    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z');
    for (var i = 0; i < codeLength; i++) {
      var index = Math.floor(Math.random() * 36);
      code += random[index];
    };
    self.data.code = code;
    self.setData({
      web_code:self.data.code,
    });
  },

 
})

  