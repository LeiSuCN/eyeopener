angular.module('eyeopener.controllers', ['monospaced.elastic'])
/*
 * 全局Controller
 */
.controller('AppCtrl', function($scope, $state, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

/*
 * 问题列表Controller
 */
.controller('QuestionsCtrl', function($scope, $rootScope, $state, EOShare, EOArticles) {

  var shareDataArticle = 'ArticleDetailCtrl.share.article';
  var shareDataSearch = 'ArticleSearchCtrl.share.search';

  $scope.questions = [];

  // 搜索内容
  var gSearch = EOShare.get(shareDataSearch);
  if( !gSearch ){
    gSearch = {
      type:'',
      name:'',
      id:''
    }
    EOShare.set(shareDataSearch, gSearch);
  }

  $scope.search = gSearch;

  function getMore(){
    var params = {};
    // 搜索条件
    if( $scope.search.type == 'hot' ){
      params.title = $scope.search.name;
    } else if( $scope.search.type == 'cate' ){
      params.aType = $scope.search.id;
    }

    EOArticles.query(params, function(status, statusText, data){
      if( data || data.length > 0 ){
        angular.forEach( data, function(question){
          $scope.questions.push( question );
        })
      }
    });    
  }

  $scope.gotoArticleDetail = function(article){
    EOShare.set(shareDataArticle, article);
    $state.go( 'app.article_detail', {articleId:article.aid});
  }

  $scope.gotoArticleSearch = function(){
    $state.go( 'app.article_search' );
  }

  $rootScope.$on('Article:refresh', function(){
    $scope.questions = [];
    getMore();
  })

  // 为了filter能够缓存到专题数据
  // TODO ugly!!!
  EOArticles.types({},function(status, statusText, data){
    getMore();  
  });
  
})

/*
 * 文章创建Controller
 */
.controller('ArticleCreateCtrl', function($scope, $ionicHistory, $ionicLoading, $ionicPopup, $ionicSlideBoxDelegate, EOUser, EOArticles) {

  var me = EOUser.me();

  // 更新文章类型
  function refreshTypes(){
    EOArticles.types({},function(status, statusText, data){
      $scope.types = data;
    });
  }

  $scope.article = {
    uid: me.uid,
    aType: '0',
    title: '',
    context: ''
  }

  $scope.tabActive = 0;
  $scope.types = [];

  function showAlert(msg,index){
    var alertPopup = $ionicPopup.alert({
      title: '请完善您的问题',
      template: msg
    });
    alertPopup.then(function(res) {
      $scope.changeSlide(index);
    });
  }

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }

  $scope.slideHasChanged = function(index){
    $scope.tabActive = index;
  }

  $scope.changeSlide = function(index){
    $ionicSlideBoxDelegate.slide(index);
  }

  $scope.submit = function(){
    var article = $scope.article;

    if( !article.title ){
      showAlert('请填写问题题目',0)
      return;      
    }

    if( !article.aType || article.aType.length <= 0 || article.aType == '0'){
      showAlert('请选择问题所属专题',2)
      return;
    }

    if( article.title && article.aType ){
      $ionicLoading.show({ template: '正在提交...' });
      EOArticles.save( article, function(status, statusText, data){
        $ionicLoading.hide();
        $scope.$emit('Article:refresh');
        $ionicHistory.goBack();
      }, function( errResp ){
        $ionicLoading.hide();
      })
    }
  }

  // window.document.ready
  $scope.$on('$ionicView.afterEnter', function(){
    // 设置高度
    var contentHeight = angular.element('.article-create').height();
    var tabHeight = angular.element('.article-create-tabs').height();
    angular.element('.slider-slide').css('min-height',(contentHeight - tabHeight) + 'px' );
    // 加载类型
    refreshTypes();
  })

  // 注销
  $scope.$on('$destroy', function(){
    
  })
})

/*
 * 问题详细Controller
 */
.controller('ArticleDetailCtrl', function($scope, $rootScope, $state, $stateParams, $ionicHistory, $ionicPopup, $ionicScrollDelegate, EOUser, EOShare, EOArticles, EOComments) {
  var me = EOUser.me();
  var shareDataArticle = 'ArticleDetailCtrl.share.article';
  var shareDataComment = 'ArticleCommentCtrl.share.comment';
  var articleId = $stateParams.articleId;
  var shareArticle = EOShare.get(shareDataArticle);
  var _pageSize = 20; // 当前页大小
  var _pageNo = 0;// 当前页码
  var _selectPopup = false;
  var _scrollTop = 0; // 滚动条位置
  var _showButtomButton = true; // 是否显示底部按钮

  $scope.articleLiked = false; // 是否已经赞过
  $scope.comments = [];  
  $scope.article = {};
  angular.extend($scope.article, shareArticle);

  // 获取更多评论
  function getMoreComments(){

    // 已经全部加载完成
    if( _pageNo < 0 ){
      return;
    }

    var params = {};
    params.aid = articleId;   //文章ID
    params.limit = _pageSize; //每页数量
    params.page = _pageNo;    //页码

    EOComments.query(params,function(status, statusText, data){

      angular.forEach( data, function(comment){
        $scope.comments.push( comment );
      })

      // 还有更多页
      if( data.length >= _pageSize ){
        _pageNo = _pageNo + 1;
      } else{ // 全部加载完成
        _pageNo = -1;
      }
    });
  }

  $scope.popupCommentOpts = function(comment){
    EOShare.set(shareDataComment,comment);
    // 弹出框
    _selectPopup = $ionicPopup.show({
      cssClass: 'article-detail-popup',
      template: '<a ng-click="goComment()">回复</a><a ng-click="likeComment()">赞</a>',
      scope: $scope
    });
    angular.element( window ).one('click', function(){
      _selectPopup.close();
      _selectPopup = false;
    })
  }

  // 赞评论
  $scope.likeComment = function(){
    var comment = EOShare.get(shareDataComment);
    EOComments.like({uid:me.uid, cid:comment.cid},function(status, statusText, data){
      comment.likes = parseInt(comment.likes) + 1;
    });
  }

  // 赞文章
  $scope.likeArticle = function(){
    if( $scope.articleLiked )return;
    EOArticles.like({uid:me.uid, aid:articleId},function(status, statusText, data){
      if( data.code == '10000' ){
        $scope.article.likes = parseInt($scope.article.likes) + 1;
      }
      $scope.articleLiked = true;
    });
  }

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }

  $scope.goComment = function(){
    if( _selectPopup ){
    } else{
      EOShare.set(shareDataComment,false);
    }
    $state.go( 'app.article_comment', {articleId:articleId});
  }

  $scope.scrolling = function(){
    console.log($ionicScrollDelegate.getScrollPosition());

    var position = $ionicScrollDelegate.getScrollPosition();
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
        angular.element('.article-detail-buttom-button')
          .animate({'bottom':'-3em'})
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
        angular.element('.article-detail-buttom-button')
          .animate({'bottom':'1em'})
      }
    }   
  }

  $rootScope.$on('Comments:add', function(){
    $scope.article.commentCount = parseInt($scope.article.commentCount) + 1;
    $scope.comments = [];
    _pageNo = 0;
    getMoreComments();
  })

  // 
  $scope.$on('$destroy', function(){
    EOShare.set(shareDataArticle, false);
  })

  //
  EOArticles.get({aid: articleId},function(status, statusText, data){
    angular.extend($scope.article, data);
    getMoreComments();
  });
})

/*
 * 文章评论Controller
 */
.controller('ArticleCommentCtrl', function($scope, $stateParams, $ionicHistory, $ionicLoading, EOShare, EOComments, EOUser) {
  var shareDataComment = 'ArticleCommentCtrl.share.comment';

  var me = EOUser.me();
  var toComment = EOShare.get(shareDataComment);
  var articleId = $stateParams.articleId;

  $scope.comment = {
    content: '',
    placeholder: '写评论:'
  }

  if( toComment ){
    $scope.comment.placeholder = '回复' + toComment.user.uname + ':';
  }
  
  $scope.goBack = function(){    
    $ionicHistory.goBack();
  }

  $scope.submit = function(){
    var comment = {};
    if( toComment ){
      comment.toUid = toComment.user.uid;//被评论人ID
      comment.pid = toComment.cid;//原评论ID
    }
    comment.aid = articleId;//文章ID
    comment.uid = me.uid;//评论人ID
    comment.context = $scope.comment.content;//评论内容

    if( comment.context ){
      $ionicLoading.show({ template: '正在提交...' });
      EOComments.save( comment, function(status, statusText, data){
        $ionicLoading.hide();
        $scope.$emit('Comments:add');
        $ionicHistory.goBack();
      }, function( errResp ){
        $ionicLoading.hide();
      })
    }
  }

  // 注销
  $scope.$on('$destroy', function(){
    EOShare.set(shareDataComment, false);
  })
})


/*
 * 文章搜索Controller
 */
.controller('ArticleSearchCtrl', function($scope, $ionicHistory, EOShare, EOArticles) {

  var shareDataSearch = 'ArticleSearchCtrl.share.search';

  $scope.search = { text:'', type:'' }
  $scope.types = [];
  $scope.hots = [];

  var preSearch = EOShare.get(shareDataSearch);
  if( preSearch && preSearch.name ){
    $scope.search.text = preSearch.name;
  }

  $scope.hots = ['菜鸟驿站','小白兔干洗','跨境电商'];

  function getTypes(){
    EOArticles.types({},function(status, statusText, data){
      $scope.types = data;
    });
  }

  function search(type, name, id){
    // {type: type, name: name, id: id}
    var search = EOShare.get(shareDataSearch);
    search.type = type;
    search.name = name;
    search.id = id;
    $scope.$emit('Article:refresh');
    $ionicHistory.goBack();
  }

  $scope.goBack = function(){    
    $ionicHistory.goBack();
  }

  $scope.setType = function(type){
    search('cate', type.name, type.id)
  }

  $scope.setHot = function(hot){
    search('hot', hot, false)
  }

  // 注销
  $scope.$on('$destroy', function(){
  })

  getTypes();
})