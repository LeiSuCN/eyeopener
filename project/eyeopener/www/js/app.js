// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('eyeopener', ['ionic', 'eyeopener.controllers', 'eyeopener.services', 'eyeopener.filters'])

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

  // ==== ==== ==== ==== >>>> 文章首页
  .state('app.test', {
    url: '/test',
    views: {
      'menuContent': {
        templateUrl: 'templates/test.html',
        controller: 'AppTestCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })
    .state('app.playlists', {
      url: '/playlists',
      views: {
        'menuContent': {
          templateUrl: 'templates/playlists.html',
          controller: 'PlaylistsCtrl'
        }
      }
    })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/knows');
});
