top.window.SEVER_ADDRESS = top.window.SEVER_ADDRESS || 'http://112.74.213.249' ; //mwnshop.mailworld.org 112.74.213.249

angular.module('eyeopener.services', [])

//
// ======== ======== ======== ========>> 共享数据Service <<======== ======== ======== ========
//
.factory('EOShare', function() {

  var api = {};
  // 共享数据
  var _share = {};

  api.get = function( key ){
    return _share[key];
  }

  api.set = function( key, value ){
    _share[key] = value;
  }

  return api;
})

//
// ======== ======== ======== ========>> 共同Service <<======== ======== ======== ========
//
.factory('EOUtils', function($http,$window) {

  var api = {};

  api.send = function(url, params, successcb, errorcb){
    $http.post( SEVER_ADDRESS + url, params )
    .then(
      // 成功回调结果
      function( resp ){
        if( successcb )
          successcb( resp.status, resp.statusText, resp.data );
      },
      // 失败回调结果
      function( resp ){ 
        if( errorcb ){
          errorcb( resp );
        } else{
          console.log( resp );
        }
      }
    );
  }


  api.set = function(key, value) {
    $window.localStorage[key] = value;
  }

  api.get = function(key, defaultValue) {
    return $window.localStorage[key] || defaultValue;
  }

  api.setObject = function(key, value) {
    $window.localStorage[key] = JSON.stringify(value);
  }

  api.getObject = function(key) {
    return JSON.parse($window.localStorage[key] || '{}');
  }

  return api;
})

//
// ======== ======== ======== ========>> 用户Service <<======== ======== ======== ========
//
.factory('EOUser', function(EOUtils) {

  var _me = false;

  // 保存用户信息
  function saveUser( user ){
    _me = {};
    _me.uid = user.uid;//用户ID
    _me.cname = user.cname;//用户昵称
    _me.upic = user.upic;//用户头像
    _me.buildDate = user.buildDate;//注册时间

    EOUtils.setObject('me', user);
  }

  var api = {};

  api.me = function(){

    if( !_me ){
      _me = EOUtils.getObject('me');
    }

    return _me;
  }

  api.login = function(params, successcb, errorcb){
    EOUtils.send('/eyer/loginbyopenid', params, function(status, statusText, data){
      // 注册成功
      if( data && data.uid ){
        saveUser( data );
      }
      successcb(status, statusText, data);
    }, errorcb);
  }

  api.loginEo = function(params, successcb, errorcb){
    EOUtils.send('/eyer/login', params, function(status, statusText, data){
      // 注册成功
      if( data && data.user ){
        saveUser( data.user );
      }
      successcb(status, statusText, data);
    }, errorcb);
  }

  // 注册
  api.register = function(params, successcb, errorcb){
    EOUtils.send('/eyer/register', params, successcb, errorcb);
  }

  api.experts = function(params, successcb, errorcb){
    EOUtils.send('/eyer/getlistpro', params, successcb, errorcb);
  }

  return api;
})

//
// ======== ======== ======== ========>> 文章Service <<======== ======== ======== ========
//
.factory('EOArticles', function(EOUtils) {

  var api = {};
  api.cacheTypes = {};

  api.query = function(params, successcb, errorcb){
    EOUtils.send('/article/getlist', params, successcb, errorcb);
  }

  api.queryLike = function(params, successcb, errorcb){
    EOUtils.send('/article/getlistbyuidwithlikes', params, successcb, errorcb);
  }

  api.queryComment = function(params, successcb, errorcb){
    EOUtils.send('/article/getlistbyuidwithcomments', params, successcb, errorcb);
  }

  api.querySubmit = function(params, successcb, errorcb){
    EOUtils.send('/article/getlistbyuid', params, successcb, errorcb);
  }

  api.get = function(params, successcb, errorcb){
    EOUtils.send('/article/getinfo', params, successcb, errorcb);
  }

  api.save = function(params, successcb, errorcb){
    EOUtils.send('/article/buildbyuid', params, successcb, errorcb);
  }

  api.like = function(params, successcb, errorcb){
    EOUtils.send('/article/likebyaid', params, successcb, errorcb);
  }

  api.types = function(params, successcb, errorcb, force/* 强制刷新 */){

    // 如果存在缓存，则从缓存中获取结果
    if( !force && api.cacheTypes && api.cacheTypes.data && api.cacheTypes.data.length > 0 ){
      successcb(api.cacheTypes.status, api.cacheTypes.statusText, api.cacheTypes.data);
    } else{
      EOUtils.send('/article/getatypemap', params, function(status, statusText, data){
        api.cacheTypes.status = status;
        api.cacheTypes.statusText = statusText;
        api.cacheTypes.data = data;
        if( successcb ){
          successcb(status, statusText, data);
        }
      }, errorcb);
    }
  }

  api.summary = function(params, successcb, errorcb){
    EOUtils.send('/article/getlength', params, successcb, errorcb);
  }

  api.hots = function(params, successcb, errorcb){
    EOUtils.send('/article/gethotword', params, successcb, errorcb);
  }

  return api;
})


//
// ======== ======== ======== ========>> 评论Service <<======== ======== ======== ========
//
.factory('EOComments', function(EOUtils) {

  var api = {};

  api.query = function(params, successcb, errorcb){
    EOUtils.send('/comment/getlist', params, successcb, errorcb);
  }

  api.save = function(params, successcb, errorcb){
    EOUtils.send('/comment/buildbyuid', params, successcb, errorcb);
  }

  api.like = function(params, successcb, errorcb){
    EOUtils.send('/comment/likebycid', params, successcb, errorcb);
  }

  return api;
})