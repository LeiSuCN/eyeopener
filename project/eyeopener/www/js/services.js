top.window.SEVER_ADDRESS = top.window.SEVER_ADDRESS || 'http://112.74.213.249'

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
// ======== ======== ======== ========>> 用户Service <<======== ======== ======== ========
//
.factory('EOUser', function() {

  var api = {};

  api.me = function(){
    return {
      uid:'16'
    }
  }

  return api;
})

.factory('EOUtils', function($http) {

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

  return api;
})

//
// ======== ======== ======== ========>> 文章Service <<======== ======== ======== ========
//
.factory('EOArticles', function(EOUtils) {

  var api = {};

  api.query = function(params, successcb, errorcb){
    EOUtils.send('/article/getlist', params, successcb, errorcb);
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

  api.types = function(params, successcb, errorcb){
    EOUtils.send('/article/getatypemap', params, successcb, errorcb);
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