// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('eyeopener', ['ionic', 'eyeopener.controllers', 'eyeopener.services', 'eyeopener.filters', 'eyeopener.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  // ==== ==== ==== ==== >>>> 文章首页
  .state('app.knows', {
    url: '/knows',
    views: {
      'menuContent': {
        templateUrl: 'templates/article_list.html',
        controller: 'ArticleListCtrl'
      }
    }
  })

  // ==== ==== ==== ==== >>>> 文章创建
  .state('app.article_create', {
    url: '/article/create',
    views: {
      'menuContent': {
        templateUrl: 'templates/article_create.html',
        controller: 'ArticleCreateCtrl'
      }
    }
  })

  // ==== ==== ==== ==== >>>> 文章搜索
  .state('app.article_search', {
    url: '/article/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/article_search.html',
        controller: 'ArticleSearchCtrl'
      }
    }
  })

  // ==== ==== ==== ==== >>>> 文章内容
  .state('app.article_detail', {
    url: '/article/:articleId',
    views: {
      'menuContent': {
        templateUrl: 'templates/article_detail.html',
        controller: 'ArticleDetailCtrl'
      }
    }
  })

  // ==== ==== ==== ==== >>>> 文章评论
  .state('app.article_comment', {
    url: '/article/:articleId/comment',
    views: {
      'menuContent': {
        templateUrl: 'templates/article_comment.html',
        controller: 'ArticleCommentCtrl'
      }
    }
  })

  // ==== ==== ==== ==== >>>> 发现列表
  .state('app.finder_list', {
    url: '/finder/list',
    views: {
      'menuContent': {
        templateUrl: 'templates/finder_list.html',
        controller: 'FinderListCtrl'
      }
    }
  })

  // ==== ==== ==== ==== >>>> 发现专题
  .state('app.finder_article', {
    url: '/finder/article/:type',
    views: {
      'menuContent': {
        templateUrl: 'templates/finder_articles.html',
        controller: 'FinderArticleListCtrl'
      }
    }
  })

  // ==== ==== ==== ==== >>>> 测试
  .state('app.test', {
    url: '/test',
    views: {
      'menuContent': {
        templateUrl: 'templates/test.html',
        controller: 'AppTestCtrl'
      }
    }
  })

  // ==== ==== ==== ==== >>>> 搜索
  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  // ==== ==== ==== ==== >>>> 用户信息 － 用户资料编辑
  .state('app.profile_edit', {
    url: '/profile_edit',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile_edit.html',
        controller: 'ProfileEditCtrl'
      }
    }
  })

  // ==== ==== ==== ==== >>>> 用户信息 － 我的钱包
  .state('app.profile_wallet', {
    url: '/profile_wallet',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile_wallet.html',
        controller: 'ProfileWalletCtrl'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/knows');
});
