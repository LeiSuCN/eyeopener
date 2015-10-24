angular.module('eyeopener.controllers')
/*
 * 全局Controller
 */
.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout, $ionicLoading, $ionicPopup
  , EOUser, EOShare) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // 登录数据
  $scope.loginData = {usr:'', pwd:''};

  // 第三方客户端对象
  $scope.clients = {
    qq: 'UNKNOW',
    message: ''
  }

  $scope.me = EOUser.me();
  if( !$scope.me ){
    var me = {};
    me.cname = '未登录';
    me.upic = 'img/def.png';
    $scope.me = me;
  }

  if( !$scope.me.cname ){
    $scope.me.cname = '点击登录';
  }

  if( !$scope.me.upic ){
    $scope.me.upic = 'img/def.png';
  }

  // 登录Modal
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // 设置Modal
  $ionicModal.fromTemplateUrl('templates/setting.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.settingModal = modal;
  });

  // 显示警告信息
  function showWarnMessage(msg, title){
    $ionicPopup.alert({
      title: title ? title : '',
      template: msg
    }).then(function(res) {});
  }

  // 显示加载
  function showLoading(){
    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" class="eo-spinner"></ion-spinner>',
      hideOnStageChange: true
    });
  }

  // 隐藏加载
  function hideLoading(){
    $ionicLoading.hide();
  }

  // 第三方认证成功后
  function afterThirdAuthSucc(params){

    $ionicLoading.show({ template: '正在处理请稍后...' });

    // 开始注册
    EOUser.login(params
      // 注册成功
    , function(){
      $scope.me = EOUser.me();
      $ionicLoading.hide();
      $scope.closeLogin();
    }
      // 注册失败
    , function(){
      $ionicLoading.hide();
      $scope.closeLogin();
    });
  }
  // 第三方登录：WX
  $scope.registerWithWX = function(){

    if( !window.Wechat ){
      showWarnMessage('未检测到微信插件');
      return;
    }

    Wechat.isInstalled(function(installed){
      if( installed ){
        Wechat.auth("snsapi_userinfo", function (response) {
          var params = {};
          params.connectType = 'wx';
          params.openid = response.code;
          params.accessToken = '';
          afterThirdAuthSucc(params);
        }, function (reason) {
          showWarnMessage(reason,'登录失败');
        });
      } else{
        showWarnMessage('请先安装微信客户端');
      }

    });
  }

  // 第三方登录：QQ
  $scope.registerWithQQ = function(){

    if( !window.YCQQ ){
      showWarnMessage('未检测到QQ插件');

      window.YCQQ = {
        checkClientInstalled: function(sc,fc){sc()},
        ssoLogin: function(sc, fc){sc({ userid:'F687C5E2C23D282A0A91A9992B085530', access_token:'EDAC1FFAC3C597A7E41AA791542B980C'})}
      }
    }

    YCQQ.checkClientInstalled(function(){
      var checkClientIsInstalled = 1;//default is 0,only for iOS
      YCQQ.ssoLogin(function(args){
          var params = {};
          params.connectType = 'qq';
          params.openid = args.userid;
          params.accessToken = args.access_token;
          afterThirdAuthSucc(params);
        }
        ,function(failReason){
         showWarnMessage(failReason);
        },checkClientIsInstalled);

    }, function(){
      showWarnMessage('请先安装QQ客户端');
    });
  }

  // 注册
  $scope.registerWithEo = function(){

    var usr = $scope.loginData.usr;
    var pwd = $scope.loginData.pwd;

    if( !usr ){
      showWarnMessage('帐号不能为空');
      return;
    }
    
    if( usr.length < 4 ){
      showWarnMessage('帐号长度不能小于4位');
      return;      
    }

    if( !pwd ){
      showWarnMessage('密码不能为空');
      return;
    }

    if( pwd.length < 6 ){
      showWarnMessage('密码长度不能小于6位');
      return;      
    }

    showLoading();
    EOUser.register({uname:usr, pwd:pwd, cname:usr, upic:''},function(status, statusText, data){
      hideLoading();
      if( data.code != '10000' ){
        showWarnMessage(data.text, '注册失败');
      } else{
        $scope.loginWithEo();
      }
    });
  };

  $scope.loginWithEo = function(){
    var usr = $scope.loginData.usr;
    var pwd = $scope.loginData.pwd;

    if( !usr ){
      showWarnMessage('帐号不能为空');
      return;
    }
    
    if( usr.length < 4 ){
      showWarnMessage('帐号长度不能小于4位');
      return;      
    }

    if( !pwd ){
      showWarnMessage('密码不能为空');
      return;
    }

    if( pwd.length < 6 ){
      showWarnMessage('密码长度不能小于6位');
      return;      
    }

    showLoading();
    EOUser.loginEo({uname:usr, pwd:pwd},function(status, statusText, data){
      hideLoading();
      if( data.code != '10000' ){
        showWarnMessage(data.text, '登录失败');
      } else{
        $scope.me = EOUser.me();
        $scope.closeLogin();
      }
    });
  }

  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.logout = function() {
    $scope.me.cname = '未登录';
    $scope.me.upic = 'img/def.png';
    EOUser.clear();
    $scope.closeSetting();
  };

  $scope.closeSetting = function() {
    $scope.settingModal.hide();
  };

  $scope.setting = function() {
    $scope.settingModal.show();
  };

  $scope.view = function(viewType){
    var shareDataArticleList = 'ArticleListCtrl.share.view'; 
    EOShare.set(shareDataArticleList, viewType);
    $scope.$emit('Article:refresh');
  }
})