angular.module('eyeopener.controllers', [])
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
 * 问题查询Controller
 */
.controller('QuestionsCtrl', function($scope, $state, EOShare, EOArticles) {

  var shareDataArticle = 'ArticleDetailCtrl.share.article';

  $scope.questions = [];

  $scope.gotoArticleDetail = function(article){
    EOShare.set(shareDataArticle, article);
    $state.go( 'app.article_detail', {articleId:article.aid});
  }

  $scope.questions1 = [
    {title:'你的第一桶金是如何赚到的？', aType:'0', sub:'顺丰快递', likes:201, context:'几个月前，当年搞煤矿时认识的一个小土豪过来喝酒。酒到三巡突然放声大哭起来。土豪说：我赔光了！我问：几千万全没了？土豪：就…'},
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'几个月前，当年搞煤矿时认识的一个小土豪过来喝酒。酒到三巡突然放声大哭起来。土豪说：我赔光了！我问：几千万全没了？土豪：就…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'刚好我们社区有位达人发了篇心得，正好可以回答你这个问题：第一档，一线城市以下的P2P 看都不用看。第二档，没活过2年的P2P，想都不用想。第三档，老板不露面，后面财团胡扯的，碰都不用碰。第四档，永远别想着投多少钱得个什么鬼电子产品啊旅游啊这种贪小…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不读理论，二经验论，把马克思主义混同于苏联和中国的实践，三形而上学，把马克思主义当成某种非黑即白的理论，静止地看待马克思…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'刚好我们社区有位达人发了篇心得，正好可以回答你这个问题：第一档，一线城市以下的P2P 看都不用看。第二档，没活过2年的P2P，想都不用想。第三档，老板不露面，后面财团胡扯的，碰都不用碰。第四档，永远别想着投多少钱得个什么鬼电子产品啊旅游啊这种贪小…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不读理论，二经验论，把马克思主义混同于苏联和中国的实践，三形而上学，把马克思主义当成某种非黑即白的理论，静止地看待马克思…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'刚好我们社区有位达人发了篇心得，正好可以回答你这个问题：第一档，一线城市以下的P2P 看都不用看。第二档，没活过2年的P2P，想都不用想。第三档，老板不露面，后面财团胡扯的，碰都不用碰。第四档，永远别想着投多少钱得个什么鬼电子产品啊旅游啊这种贪小…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不读理论，二经验论，把马克思主义混同于苏联和中国的实践，三形而上学，把马克思主义当成某种非黑即白的理论，静止地看待马克思…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'刚好我们社区有位达人发了篇心得，正好可以回答你这个问题：第一档，一线城市以下的P2P 看都不用看。第二档，没活过2年的P2P，想都不用想。第三档，老板不露面，后面财团胡扯的，碰都不用碰。第四档，永远别想着投多少钱得个什么鬼电子产品啊旅游啊这种贪小…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不读理论，二经验论，把马克思主义混同于苏联和中国的实践，三形而上学，把马克思主义当成某种非黑即白的理论，静止地看待马克思…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'刚好我们社区有位达人发了篇心得，正好可以回答你这个问题：第一档，一线城市以下的P2P 看都不用看。第二档，没活过2年的P2P，想都不用想。第三档，老板不露面，后面财团胡扯的，碰都不用碰。第四档，永远别想着投多少钱得个什么鬼电子产品啊旅游啊这种贪小…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不读理论，二经验论，把马克思主义混同于苏联和中国的实践，三形而上学，把马克思主义当成某种非黑即白的理论，静止地看待马克思…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'刚好我们社区有位达人发了篇心得，正好可以回答你这个问题：第一档，一线城市以下的P2P 看都不用看。第二档，没活过2年的P2P，想都不用想。第三档，老板不露面，后面财团胡扯的，碰都不用碰。第四档，永远别想着投多少钱得个什么鬼电子产品啊旅游啊这种贪小…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不读理论，二经验论，把马克思主义混同于苏联和中国的实践，三形而上学，把马克思主义当成某种非黑即白的理论，静止地看待马克思…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'刚好我们社区有位达人发了篇心得，正好可以回答你这个问题：第一档，一线城市以下的P2P 看都不用看。第二档，没活过2年的P2P，想都不用想。第三档，老板不露面，后面财团胡扯的，碰都不用碰。第四档，永远别想着投多少钱得个什么鬼电子产品啊旅游啊这种贪小…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不读理论，二经验论，把马克思主义混同于苏联和中国的实践，三形而上学，把马克思主义当成某种非黑即白的理论，静止地看待马克思…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'刚好我们社区有位达人发了篇心得，正好可以回答你这个问题：第一档，一线城市以下的P2P 看都不用看。第二档，没活过2年的P2P，想都不用想。第三档，老板不露面，后面财团胡扯的，碰都不用碰。第四档，永远别想着投多少钱得个什么鬼电子产品啊旅游啊这种贪小…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不读理论，二经验论，把马克思主义混同于苏联和中国的实践，三形而上学，把马克思主义当成某种非黑即白的理论，静止地看待马克思…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'刚好我们社区有位达人发了篇心得，正好可以回答你这个问题：第一档，一线城市以下的P2P 看都不用看。第二档，没活过2年的P2P，想都不用想。第三档，老板不露面，后面财团胡扯的，碰都不用碰。第四档，永远别想着投多少钱得个什么鬼电子产品啊旅游啊这种贪小…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不读理论，二经验论，把马克思主义混同于苏联和中国的实践，三形而上学，把马克思主义当成某种非黑即白的理论，静止地看待马克思…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', likes:36, context:'刚好我们社区有位达人发了篇心得，正好可以回答你这个问题：第一档，一线城市以下的P2P 看都不用看。第二档，没活过2年的P2P，想都不用想。第三档，老板不露面，后面财团胡扯的，碰都不用碰。第四档，永远别想着投多少钱得个什么鬼电子产品啊旅游啊这种贪小…'},    
    {title:'为何考研读马克思主义感觉很有道理？', aType:'1', sub:'菜鸟驿站', likes:11, context:'你的感觉当然是正确的。因为马克思主义作为一个流派，和黑格尔，康德，尼采的地位是有过之而无不及的。有些人否定是因为他们一不读理论，二经验论，把马克思主义混同于苏联和中国的实践，三形而上学，把马克思主义当成某种非黑即白的理论，静止地看待马克思…'},
    {title:'诺贝尔奖巡礼', aType:'0', sub:'顺丰快递', likes:101, context:'诺贝尔奖依据阿弗雷德·诺贝尔的遗嘱设立，于每年嘉奖在生理学或医学、物理学、化学、文学、和平领域作出杰出贡献的人士。为纪…'},
    {title:'理财平台那么多？怎样看理财平台是否靠谱呢？', aType:'1', sub:'菜鸟驿站', heart:36, context:'刚好我们社区有位达人发了篇心得，正好可以回答你这个问题：第一档，一线城市以下的P2P 看都不用看。第二档，没活过2年的P2P，想都不用想。第三档，老板不露面，后面财团胡扯的，碰都不用碰。第四档，永远别想着投多少钱得个什么鬼电子产品啊旅游啊这种贪小…'},    
  ]

  EOArticles.query({}, function(status, statusText, data){
    console.log( data );
    if( data || data.length > 0 ){
      angular.forEach( data, function(question){
        $scope.questions.push( question );
      })
    }
  });
})

/*
 * 文章创建Controller
 */
.controller('ArticleCreateCtrl', function($scope, EOUser, EOArticles) {

  var me = EOUser.me();

  $scope.article = {
    uid: me.uid,
    aType: '0',
    title: '',
    context: ''
  }

  $scope.submit = function(){



    var article = $scope.article;

    console.log( article.context ); 
    //return;

    //console.log( article );

    if( article.title && article.context )
    EOArticles.save( $scope.article );
  }

  // 注销
  $scope.$on('$destroy', function(){
    
  })
})

/*
 * 问题详细Controller
 */
.controller('ArticleDetailCtrl', function($scope, $state, $stateParams, $ionicHistory, EOShare, EOArticles, EOComments) {
  var shareDataArticle = 'ArticleDetailCtrl.share.article';
  var articleId = $stateParams.articleId;
  var shareArticle = EOShare.get(shareDataArticle);
  var _pageSize = 20; // 当前页大小
  var _pageNo = 0;// 当前页码

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

  $scope.article = {};
  angular.extend($scope.article, shareArticle);

  $scope.comments = [];

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }

  $scope.goComment = function(){
    $state.go( 'app.article_comment', {articleId:articleId});
  }
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
.controller('ArticleCommentCtrl', function($scope, $stateParams,  $ionicHistory, EOComments) {

  var articleId = $stateParams.articleId;
  
  $scope.goBack = function(){
    $ionicHistory.goBack();
  }

  // 注销
  $scope.$on('$destroy', function(){
    
  })
})