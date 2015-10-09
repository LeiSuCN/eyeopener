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
// ======== ======== ======== ========>> 文章Service <<======== ======== ======== ========
//
.factory('EOArticles', function($http) {

  var api = {};

  // POST请求
  function post(url, params, successcb, errorcb){
    $http.post( url, params )
    .then(
      // 成功回调结果
      function( resp ){
        if( successcb )
          successcb( resp.status, resp.statusText, resp.data );
      },
      // 失败回调结果
      function( resp ){ 
        if( errorcb ){
          errorcb( resp.status, resp.statusText, resp.data );
        } else{
          console.log( resp );
        }
      }
    );
  }

  api.getAll = function(params, successcb, errorcb){
    var url = SEVER_ADDRESS + '/article/getlist';
    post(url, params, successcb, errorcb);
  }

  return api;
})