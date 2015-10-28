angular.module('eyeopener.controllers')

/*
 * 发现列表Controller
 */
.controller('FinderListCtrl', function($scope, $ionicHistory, $state
  , $ionicSideMenuDelegate,$ionicSlideBoxDelegate, $ionicScrollDelegate, $timeout, $ionicModal
  , EOShare, EOUser, EOArticles) {

  var shareDataType = 'FinderArticleListCtrl.share.type';

  $scope.types = [];
  $scope.oriTypes = [];
  $scope.showRootType = {};
  $scope.subsModal = false;
  $scope.search = { name:''}

  // 专题列表Modal
  $ionicModal.fromTemplateUrl('templates/finder_subs.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.subsModal = modal;
  });

  // 专题搜索Modal
  $ionicModal.fromTemplateUrl('templates/modal_finder_type_search.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.typeSearchModal = modal;
  });

  // 更新列表
  function refreshTypes(){
    var currentRootType = false;
    EOArticles.types({}, function(status, statusText, data){
      $scope.types = data;
      console.log( $scope.types )
      // $scope.oriTypes = data;
      // angular.forEach(data, function(type){
      //   if( type.team != currentRootType.name ){
      //     if( currentRootType ){
      //       $scope.types.push(currentRootType);
      //     }

      //     currentRootType = {'name': type.team, types: [] };
      //   }

      //   currentRootType.types.push(type);
      // });

      // if( currentRootType ){
      //   $scope.types.push( currentRootType );
      // }
    });
  }

  $scope.disableSlide = function(){
    $ionicSlideBoxDelegate.enableSlide(false);
  }

  $scope.showTypes = function(){
    $ionicSlideBoxDelegate.slide(0);
  }

  $scope.showExperts = function(){
    $ionicSlideBoxDelegate.slide(1); 
  }

  $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.swipeRight = function(){
    $scope.goBack();
  }

  $scope.swipeLeft = function(){
    if( $ionicSideMenuDelegate.isOpen() ){
      $ionicSideMenuDelegate.toggleLeft();
    }
  }

  $scope.drillSubs = function(cate){
    $scope.showRootType = $scope.types[parseInt(cate)]
    $ionicScrollDelegate.$getByHandle('finder-subs-content').scrollTop();
    $scope.subsModal.show();
  }

  $scope.closeLogin = function() {
    $scope.subsModal.hide();
  };

  $scope.showTypeSearchModal = function(){
    $scope.typeSearchModal.show();
  }

  $scope.hideTypeSearchModal = function(){
    $scope.typeSearchModal.hide();
  }

  $scope.clearSearchText = function(){
    $scope.search.name = '';
  }

  $scope.goTypeList = function(type){
    $scope.subsModal.hide();
    EOShare.set(shareDataType, type);
    $state.go( 'app.finder_article', {type:type.id});
  }

  $scope.goBack = function(){    
    $ionicHistory.goBack();
  }

  //refreshTypes();

  // 进入
  $scope.$on('$ionicView.loaded', function(){
    refreshTypes();
  })

  // 注销
  $scope.$on('$destroy', function(){
  })
})


/*
 * 返现专题Controller
 */
.controller('FinderArticleListCtrl', function($scope, $rootScope, $state, $stateParams
  , $timeout, $ionicLoading, $ionicPopup, EOShare, EOArticles, EOUser, EOUtils) {

  var shareDataType = 'FinderArticleListCtrl.share.type';
  var shareDataArticle = 'ArticleDetailCtrl.share.article';
  var typeId = $stateParams.type;
  var me = EOUser.me();

  $scope.type = EOShare.get(shareDataType);
  $scope.articles = [];
  $scope.data = {
    challengContent: ''// 吐槽内容
  }

  function getMore(){
    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" class="eo-spinner"></ion-spinner>',
      hideOnStageChange: true
    });

    var params = {aType: typeId};
    //var params = {};
    EOArticles.query(params, function(status, statusText, data){
      if( data || data.length > 0 ){
        angular.forEach( data, function(article){
          $scope.articles.push( article );
        })
      }
      $ionicLoading.hide();
    });    
  }

  // 申请
  $scope.ask = function(){

    EOUtils.showLoading();
    EOArticles.ask({
      uid:me.uid,
      aType:typeId    
    }, function(status, statusText, data){
      EOUtils.hideLoading();
      // var alertPopup = $ionicPopup.alert({
      //   title: '提交成功',
      //   template: '您的申请已经成功提交,我们会尽快联系您'
      // });
      // alertPopup.then(function(res) {});
      window.plugins.toast.showLongCenter('您的申请已经成功提交,我们会尽快联系您');
    }, function(){
      EOUtils.hideLoading();
    });
  }

  // 吐槽
  $scope.challeng = function(){

    $scope.data.challengContent = '';

    var challengPopup = $ionicPopup.show({
      templateUrl: 'finder_articles_challeng.html',
      scope: $scope,
      buttons: [
        { text: '放过他' },
        {
          text: '<b>吐槽</b>',
          type: 'button-positive',
          onTap: function(e) {
            EOUtils.showLoading();
            EOArticles.challeng({
              uid:me.uid,
              aType:typeId, 
              context:$scope.data.challengContent
            }, function(status, statusText, data){
              challengPopup.close();
              EOUtils.hideLoading();
              window.plugins.toast.showShortCenter(data.text);
            }, function(){
              EOUtils.hideLoading();
            })
            e.preventDefault();
          }
        }
      ]
    });

  }
  
  $scope.gotoArticleDetail = function(article){
    EOShare.set(shareDataArticle, article);
    $state.go( 'app.article_detail', {articleId:article.aid});
  }

  $scope.goBack = function(){    
    $state.go( 'app.finder_list' );
  }

  // 延迟加载数据
  $scope.$on('$ionicView.loaded', function(){
    $timeout( getMore )
  })

  // 退出时清除共享数据
  $scope.$on('$destroy', function(){
    EOShare.set(shareDataType, false);
  })
  
})