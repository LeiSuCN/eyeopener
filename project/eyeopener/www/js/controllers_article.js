angular.module('eyeopener.controllers')

/*
 * 问题列表Controller
 */
.controller('ArticleListCtrl', function($scope, $rootScope, $state, $ionicLoading, $timeout, $ionicPopup
  , EOShare, EOArticles, EOUser) {
  var shareDataArticleList = 'ArticleListCtrl.share.view'; 
  var shareDataArticle = 'ArticleDetailCtrl.share.article';
  var shareDataSearch = 'ArticleSearchCtrl.share.search';
  var isHasMore = true;
  var limit = 10;
  var page = 0;
  var viewDataFun;
  var view;
  $scope.questions = [];
  $scope.topTips = '';

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

  function reset(){
    // 视图
    view = EOShare.get(shareDataArticleList);
    if( !view || view == 'read' ){
      viewDataFun = EOArticles.query;
    } else if( view == 'like' ){
      viewDataFun = EOArticles.queryLike;
      $scope.search.type = 'like';
      $scope.search.name = '点赞过的问题';
    } else if( view == 'comment' ){
      viewDataFun = EOArticles.queryComment;
      $scope.search.type = 'comment';
      $scope.search.name = '评论过的问题';
    } else if( view == 'submit' ){
      viewDataFun = EOArticles.querySubmit;
      $scope.search.type = 'submit';
      $scope.search.name = '提交过的问题';
    }

    $scope.questions = [];
    isHasMore = true; 
    page = 0;    
  }

  function getMore(){
    // loading
    $ionicLoading.show({
      template: '<ion-spinner icon="ripple" class="eo-spinner"></ion-spinner>',
      hideOnStageChange: true
    });
    // 条件
    var params = {};
    // 分页条件
    params.limit = limit;
    params.page = page;
    // 搜索条件
    if( $scope.search.type == 'hot' ){
      params.title = $scope.search.name;
    } else if( $scope.search.type == 'cate' ){
      params.aType = $scope.search.id;
    }
    // 我
    var me = EOUser.me();
    if( me ){
      params.uid = me.uid;
    }
    // 回调函数
    var successCallback = function(status, statusText, data){

      if( !!data.substr == true ){
        isHasMore = false;
        $scope.$broadcast('scroll.infiniteScrollComplete');
        $ionicLoading.hide(); 
        return;
      }

      if( data && data.length > 0 ){
        angular.forEach( data, function(question){
          $scope.questions.push( question );
        })
        if( data.length < limit ){
          isHasMore = false;
        }
      } else{
        isHasMore = false;
      }
      $scope.$broadcast('scroll.infiniteScrollComplete');
      $ionicLoading.hide();
    };

    viewDataFun(params, successCallback);    
  }

  $scope.swipeLeft = function(){
    $scope.gotoFinderList();
  }

  /*
   * 加载更多数据
   */
  $scope.loadMore = function(){
    page = page + 1;
    getMore();
  }

  /*
   * 是否有跟多数据
   */
  $scope.hasMore = function(){
    return isHasMore;
  }

  $scope.gotoArticleDetail = function(article){
    EOShare.set(shareDataArticle, article);
    $state.go( 'app.article_detail', {articleId:article.aid});
  }

  $scope.gotoArticleCreate = function($event){

    $event.stopPropagation();

    var me = EOUser.me();
    if( !me || !me.uid ){
      $ionicPopup.alert({
        title: '^_^',
        template: '请您先登录后才能提问'
      }).then(function(res) {});
    } else{
      $state.go( 'app.article_create' );
    }
  }

  $scope.gotoArticleSearch = function(){
    $state.go( 'app.article_search' );
  }

  $scope.gotoFinderList = function(){
    $state.go( 'app.finder_list' );
  }

  $rootScope.$on('Article:refresh', function(){
    reset();
    page = page + 1;
    getMore();
  })

  // 延迟加载数据
  $scope.$on('$ionicView.loaded', function(){
    $timeout( function(){
      // 为了filter能够缓存到专题数据
      // TODO ugly!!!
      EOArticles.types({});  

      // 统计全网数据
      EOArticles.summary({}, function(status, statusText, data){
        $scope.topTips = '话题' + data.numArticle + '/得赏0';
      });    
    } )
  })

  // 恢复初始状态
  reset();
})

/*
 * 文章创建Controller
 */
.controller('ArticleCreateCtrl', function($scope, $ionicHistory, $ionicLoading
  , $ionicPopup, $ionicSlideBoxDelegate, $ionicModal
  , EOUser, EOArticles, EOUtils) {

  var me = EOUser.me();

  // 限制条件
  $scope.titleMax = 60; // 标题最大字数限制

  // 创建的文章
  $scope.article = {
    uid: me.uid,
    aType: '',
    aTypeName: '',
    title: '',
    context: ''
  }

  // 专题列表
  $scope.types = [];

  // 专题Modal
  $ionicModal.fromTemplateUrl('templates/article_create_type.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.typeModal = modal;
  });

  // 更新文章类型
  function refreshTypes(successCallback){
    EOArticles.types({},function(status, statusText, data){

      var currentCate = false;
      if( data && data.length > 0 ){
        angular.forEach(data, function(type, index){
          // 切换类目
          if( type.team != currentCate ){
            $scope.types.push({ name: type.team, isType: false, id: '0' });
            currentCate = type.team;
          }
          $scope.types.push({ name: type.name, isType: true, id: type.id });
        });
      }

      successCallback();
    });
  }

  function showAlert(msg){
    var alertPopup = $ionicPopup.alert({
      title: '请完善您的问题',
      template: msg
    });
    alertPopup.then(function(res) {});
  }

  // 上传图片，并在结束时返回
  function uploadPictures(params, fileURLs, uploadSuccess, uploadError, updateStatus){

    // 结束返回
    if( !fileURLs || fileURLs.length == 0 ){
      // 完成后回调uploadSuccess函数
      uploadSuccess();
      return;
    }

    var fileURL = fileURLs.pop();
    // 上传单张图片，并在上传成功后递归调用uploadPictures
    uploadPicture( params, fileURL, function(){
      uploadPictures(params, fileURLs, uploadSuccess, uploadError, updateStatus);
    }, uploadError, updateStatus );
  }

  // 上传单张图片
  function uploadPicture(params, fileURL, uploadSuccess, uploadError, updateStatus){

    var uri = EOUtils.getServer() + '/article/uploadimg';
    // var uri = 'http://192.168.1.19:81/article/uploadimg';
    var options = new FileUploadOptions();
    options.params = params;
    options.fileKey="image";
    options.fileName=fileURL.substr(fileURL.lastIndexOf('/')+1);

    var ft = new FileTransfer();
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
          var status = parseInt( progressEvent.loaded / progressEvent.total * 100 );
          updateStatus( status );
        } else {
          //loadingStatus.increment();
        }
    };
    ft.upload(fileURL, uri, uploadSuccess, uploadError, options);
  }

  // 显示图片
  function showPicture( imgUri, ele){

    var containerEle = angular.element( ele );
    var h = containerEle.width(); 

    var btnEle = containerEle.find('button');
    var imgEle = containerEle.find('img');
    imgEle.attr('src', imgUri);
    imgEle.css('max-height', h + 'px');

    btnEle.hide();
    imgEle.show();
  }

  // 获取当前的内容
  function getCurrentContent(){

    var article = $scope.article;

    var images = [];
    for( var i = 0 ; i < 3 ; i++ ){
      var imgSrc = angular.element('#articleCreateImage' + i ).find('img').attr('src');
      if( imgSrc ){
        images.push( imgSrc );
      }
    }

    return {
      title: article.title,
      context: article.context,
      aType: article.aType,
      aTypeName: article.aTypeName,
      images: images
    }
  }

  // 清除草稿
  function clearDraft(){
    EOUtils.setObject('draft', false);
  }

  // 加载草稿
  function loadDraft(){
    var draft = EOUtils.getObject('draft');
    if( draft ){
      $scope.article.title = draft.title;
      $scope.article.context = draft.context;
      $scope.article.aType = draft.aType;
      $scope.article.aTypeName = draft.aTypeName;
    }
  }

  // 获取本地图片
  $scope.getPicture = function($event){

    var containerEle = $event.toElement.parentElement;

    //showPicture('img/def.png', $event.toElement.parentElement );return;

    EOUtils.getPicture({
      quality:10,
      destinationType: Camera.DestinationType.FILE_URI,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: Camera.EncodingType.JPEG,
      correctOrientation: true
    }).then(function(imageURI){
      showPicture(imageURI, containerEle);
    }, function(err){
      showAlert(err);
    })
  }

  // 弹出专题Modal
  $scope.showTypeModal = function(){

    //  如果没有专题列表需要先获取专题列表
    if( $scope.types.length == 0 ){
      refreshTypes(function(){
        $scope.typeModal.show();
      });
    } else{
      $scope.typeModal.show();
    }
    
  }

  // 关闭专题Modal
  $scope.closeTypeModal = function(){
    $scope.typeModal.hide();
  }

  // 选中专题
  $scope.chooseType = function( index ){
    var type = $scope.types[index];
    if( !type.isType ){
      return;
    }

    $scope.article.aType = type.id;
    $scope.article.aTypeName = type.name;
    $scope.closeTypeModal();
  }

  $scope.goBack = function(){

    // 草稿提示
    if( $scope.article.title || $scope.article.context ){
      var confirmPopup = $ionicPopup.confirm({
        template: '您编写的问题还未提交，是否保存为草稿？',
        cancelText:'放弃并返回',
        cancelType: 'button-assertive',
        okText:'保存为草稿',
      });
      confirmPopup.then(function(res) {
        if(res) {
          EOUtils.setObject('draft', getCurrentContent());
        } else{
          clearDraft();
        }
        $ionicHistory.goBack();
      });
    } else{
      $ionicHistory.goBack();
    }
  }

  function testUpload(){

    uploadPicture({aid:'123',uid:'456'}, angular.element('#articleCreateImage0').find('img').attr('src'), 
      function(r){
        alert('success')
      }, function(error){
        
    alert("An error has occurred: Code = " + error.code);
    alert("upload error source " + error.source);
    alert("upload error target " + error.target);

      }, function(status){
        $scope.article.title = status;
      });
  }

  $scope.submit = function(){

    //testUpload();return;
    // var images = ['img/def.png','img/QQ.png','img/weixin.png'];
    // uploadPictures({}, images, function(){ 
    //   console.log( 'upload finished' )
    // }, function(){}, function(){});return;

    var article = $scope.article;

    if( !article.title ){
      showAlert('请填写问题简素')
      return;      
    }

    if( !article.aType || article.aType.length <= 0 || article.aType == ''){
      showAlert('请选择问题标签',2)
      return;
    }

    // 上传图片
    var images = [];
    for( var i = 0 ; i < 3 ; i++ ){
      var imgSrc = angular.element('#articleCreateImage' + i ).find('img').attr('src');
      if( imgSrc ){
        images.push( imgSrc );
      }
    }

    if( article.title && article.aType ){
      $ionicLoading.show({ template: '正在提交...' });
      EOArticles.save( {title: article.title, context: article.context, aType: article.aType
        , uid: me.uid}
      , function(status, statusText, data){

        if( data.code != '10000' ){
          // TODO
          showAlert(data.code);
          return;
        }

        var aid = data.aid;

        uploadPictures({// 上传参数
            uid: me.uid,
            aid: aid
          // 上传图片
          }, images,
          // 上传成功回调函数
          function(){ 
            clearDraft();// 上传成功后要清除草稿
            $ionicLoading.hide();
            $scope.$emit('Article:refresh');
            $ionicHistory.goBack();
          // 上传失败回调函数
          }, function(){
            showAlert(error.code);
          // 上传进度回调函数
          }, function(){ 

          })

      }, function( errResp ){
        $ionicLoading.hide();
      })
    }
  }

  $scope.$on('$ionicView.afterEnter', function(){
    loadDraft();
  });

  // 注销
  $scope.$on('$destroy', function(){
    
  })
})

/*
 * 问题详细Controller
 */
.controller('ArticleDetailCtrl', function($scope, $rootScope, $state, $timeout, $stateParams
  , $ionicHistory, $ionicPopover, $ionicPopup, $ionicScrollDelegate, $ionicLoading, $ionicModal
  , EOUser, EOShare, EOArticles, EOComments, EOUtils) {
  var me = EOUser.me();
  var shareDataArticle = 'ArticleDetailCtrl.share.article';
  var shareDataComment = 'ArticleCommentCtrl.share.comment';
  var articleId = $stateParams.articleId;
  var shareArticle = EOShare.get(shareDataArticle);
  var _pageSize = 100; // 当前页大小
  var _pageNo = 0;// 当前页码
  var _selectPopup = false;
  var _scrollTop = 0; // 滚动条位置
  var _showButtomButton = true; // 是否显示底部按钮

  $scope.articleLiked = false; // 是否已经赞过
  $scope.comments = [];  
  $scope.article = {};
  angular.extend($scope.article, shareArticle);

  $scope.award = { sum:0}

  // 打赏Modal
  $ionicModal.fromTemplateUrl('templates/modal_award.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.awardModal = modal;
  });

  // 分享popover
  $ionicPopover.fromTemplateUrl('article-detail-share-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.sharePopover = popover;
  });

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

      $ionicLoading.hide();
    });
  }

  function showAlert(msg,title){
    var alertPopup = $ionicPopup.alert({
      title: title,
      template: msg
    });
    alertPopup.then(function(res) {});
  }

  $scope.popupCommentOpts = function(comment){
    EOShare.set(shareDataComment,comment);
    // 弹出框
    _selectPopup = $ionicPopup.show({
      cssClass: 'article-detail-popup',
      template: '<a ng-click="goComment()" class="ul">回复</a><a ng-click="likeComment()" class="ul">赞</a><a class="ul" a ng-click="copy()">复制</a><a ng-click="report()">举报</a>',
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

  $scope.shareWX = function(){
    if( !window.Wechat ){
      alert('没有微信插件')
      return;
    }

    var params = {};
    params.scene = Wechat.Scene.TIMELINE;
    params.message = {
      title: "眼界",
      description: "猫屋",
      messageExt: "这是第三方带的测试字段",
      thumb: "http://img.mailworld.org/uploads/eyer/share.png",
      media: {
        type: Wechat.Type.LINK,
        webpageUrl: "http://img.mailworld.org/download/eyer"
      }
    };

    Wechat.share(params, function () {
            alert("Success");
        }, function (reason) {
            alert("Failed: " + reason);
    });
  }

  $scope.share = function(shareTarget, $event){
    $event.stopPropagation();
    console.log( shareTarget );
  }

  // 举报
  $scope.report = function(cid){

    var comment = EOShare.get(shareDataComment);

    EOUtils.showLoading();

    //rType:投诉类型(0:文章,1:评论)
    EOComments.report({uid:me.uid, rType:1, cid:comment.cid}, function(status, statusText, data){
      EOUtils.hideLoading();
      showAlert(data.text, '投诉成功');
    }, function(){
      EOUtils.hideLoading();
      showAlert('投诉失败');
    })
  }

  // 复制
  $scope.copy = function(){
    var comment = EOShare.get(shareDataComment);
    cordova.plugins.clipboard.copy(comment.context);
  }

  // 打开分享页面
  $scope.openShare = function($event){
    $scope.sharePopover.show($event);
  }

  // 关闭分享页面
  $scope.closeShare = function(){
    $scope.sharePopover.hide();
  }

  // 打开分享页面
  $scope.openAward = function(){
    $scope.awardModal.show();
  }

  // 关闭分享页面
  $scope.closeAward = function(){
    $scope.awardModal.hide();
  }
  
  $scope.stopPropagation = function($event){
    $event.stopPropagation();
  }

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }

  $scope.goComment = function(){
    var me = EOUser.me();
    if( !me || !me.uid ){
      $ionicPopup.alert({
        title: '^_^',
        template: '请您先登录后才能评论'
      }).then(function(res) {});
      return;
    }

    if( _selectPopup ){
    } else{
      EOShare.set(shareDataComment,false);
    }
    $state.go( 'app.article_comment', {articleId:articleId});
  }

  $scope.scrolling = function(){

    var position = $ionicScrollDelegate.$getByHandle('article-detail-scroll').getScrollPosition();

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


  // 延迟加载数据
  $scope.$on('$ionicView.loaded', function(){
    $timeout( function(){
      //
      EOArticles.get({aid: articleId},function(status, statusText, data){
        angular.extend($scope.article, data);
        getMoreComments();
      });  
    } )
  })

  // loading
  $ionicLoading.show({
    template: '<ion-spinner icon="ripple" class="eo-spinner"></ion-spinner>',
    hideOnStageChange: true
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
    placeholder: '写下你的评论…'
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
  var shareDataArticleList = 'ArticleListCtrl.share.view'; 

  $scope.search = { text:'', type:'' }
  $scope.types = [];
  $scope.hots = [];

  var preSearch = EOShare.get(shareDataSearch);
  if( preSearch && preSearch.name ){
    $scope.search.text = preSearch.name;
  }

  $scope.hots = [];

  function getTypes(){
    EOArticles.hots({},function(status, statusText, data){

      if( !data ){
        return;
      }

      // 热搜类别
      if( data.classes ){
        $scope.types = data.classes;
      }
      // 热搜关键字
      if( data.words ){
        $scope.hots = data.words;
      }
    });
  }

  function search(type, name, id){
    EOShare.set(shareDataArticleList, '');
    var search = EOShare.get(shareDataSearch);
    search.type = type;
    search.name = name;
    search.id = id;
    $scope.$emit('Article:refresh');
    $ionicHistory.goBack();
  }
  $scope.goBack = function(){ 
    if( $scope.search.text != preSearch.name ){
      search('hot', $scope.search.text, false)
    } else{
      $ionicHistory.goBack();
    }
    
  }

  $scope.clear = function(){    
    $scope.search.text = '';
    $scope.search.type = '';
  }

  $scope.setType = function(type){
    search('cate', type.word, type.typeId)
  }

  $scope.setHot = function(hot){
    search('hot', hot, false)
  }

  // 注销
  $scope.$on('$destroy', function(){
  })

  getTypes();
})
