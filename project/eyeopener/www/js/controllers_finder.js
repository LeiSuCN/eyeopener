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
    EOArticles.types({}, function(status, statusText, data){
      $scope.types = data;
    });
  }

  $scope.toggleLeftSideMenu = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.disableSlide = function(){
    $ionicSlideBoxDelegate.enableSlide(false);
  }

  $scope.showTypes = function(){
    $ionicSlideBoxDelegate.slide(0);
  }

  $scope.showTypeSearchModal = function(){
    $scope.typeSearchModal.show();
  }

  $scope.hideTypeSearchModal = function(){
    $scope.typeSearchModal.hide();
  }

  $scope.clearSearchText = function(){
    $scope.search.name = '';
  }

  $scope.goTypeList = function(typeId, type){
    $scope.subsModal.hide();
    EOShare.set(shareDataType, type);
    $state.go( 'app.finder_article', {type:typeId});
  }

  $scope.goBack = function(){    
    $ionicHistory.goBack();
  }

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
  , $timeout, $ionicLoading, $ionicPopup,$ionicTabsDelegate, $ionicScrollDelegate, EOShare, EOArticles, EOUser, EOUtils) {

  var shareDataType = 'FinderArticleListCtrl.share.type';
  var shareDataArticle = 'ArticleDetailCtrl.share.article';
  var typeId = $stateParams.type;
  var me = EOUser.me();
  var currentTab = false;
  var tabsHandle = false;
  var limit = 10;
  var page = 0;
  var isHasMore = true;
  var _scrollTop = 0; // 滚动条位置
  var _showButtomButton = true; // 是否显示底部按钮

  $scope.showHeader = true; // 是否显示header
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

    var params = {aType: currentTab.id, pType: currentTab.pType};
    // 分页条件
    params.limit = limit;
    params.page = page;
    EOArticles.query(params, function(status, statusText, data){
      
      if( !!data.substr == true ){
        isHasMore = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide(); 
        return;
      }

      if( data || data.length > 0 ){
        angular.forEach( data, function(article){
          $scope.articles.push( article );
        })
        if( data.length < limit ){
          isHasMore = false;
        }
      } else{
        isHasMore = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $ionicLoading.hide();
    });    
  }


  function reload(){
    $scope.articles = [];
    isHasMore = true; 
    page = 0;
    getMore();
  }

  function setCurrentTab(tabName){

    if( tabName == '活动通告' ){
      $scope.showHeader = true;
    } else{
      $scope.showHeader = false;
    }

    for( var i = 0 ; i < $scope.type.menu.length ; i++ ){
      if( $scope.type.menu[i].name == tabName ){
        currentTab = $scope.type.menu[i];
        break;
      }
    }
  }

  $scope.scrolling = function(){

    var position = $ionicScrollDelegate.$getByHandle('finder-articles-content').getScrollPosition();

    if( _scrollTop == 0 ){
      _scrollTop = position.top;
      return;
    }
    var activeDistance = 5;
    var distince = position.top - _scrollTop;
    // 向下滑动
    if( distince > 0 ){
      // 向下滑动有效距离
      if( distince < activeDistance ){
        return;
      }
      _scrollTop = position.top;
      if( _showButtomButton ){
        _showButtomButton = false;
        angular.element('.finder-articles-footer')
          .animate({'bottom':'-4em'})
      }
    }
    // 向上滑动
    else if( distince < 0 ){
      // 向下滑动有效距离
      if( distince*-1 < activeDistance ){
        return;
      }
      _scrollTop = position.top;
      if( !_showButtomButton ){
        _showButtomButton = true;
        angular.element('.finder-articles-footer')
          .animate({'bottom':'0'})
      }
    }   
  }

  $scope.loadMore = function(){

    page = page + 1;

    getMore();
  }

  // 是否有跟多数据
  $scope.hasMore = function(){
    return isHasMore;
  }

  // 申请
  $scope.ask = function(){

    EOUtils.showLoading();
    EOArticles.ask({
      uid:me.uid,
      aType:typeId    
    }, function(status, statusText, data){
      EOUtils.hideLoading();
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

  $scope.activeTab = function(tabId, subName){
    tabsHandle.select( tabId );
    setCurrentTab(subName);
    reload();
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
    setCurrentTab('活动通告');
    tabsHandle = $ionicTabsDelegate.$getByHandle('finder-list-tabs');
    $timeout( reload )
  })

  // 退出时清除共享数据
  $scope.$on('$destroy', function(){
    EOShare.set(shareDataType, false);
  })
  
})