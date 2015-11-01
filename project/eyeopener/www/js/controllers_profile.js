angular.module('eyeopener.controllers')

/*
 * 用户资料编辑Controller
 */
.controller('ProfileEditCtrl', function($scope, $ionicModal, $ionicHistory, $ionicPopover
  , EOUser, EOUtils) {

  var me = EOUser.me();

  var formScope = false;//数据FORM

  // 经营类型
  $scope.bussiness = top.window.BUSINESS;

  //
  $scope.user = {
    sex: 1 // 性别
  };

  // 经营类型Modal
  $ionicModal.fromTemplateUrl('profile_edit_store_bussiness.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.bussinessModal = modal;
  });  

  // 头像选择Popover
  $ionicPopover.fromTemplateUrl('profile_edit_header.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.headerPopover = popover;
  });

  angular.extend($scope.user, me);

  $scope.setFormScope = function( scope ){
    formScope = scope;
  }

  // 提交修改
  $scope.submit = function(){
    var hasChangedKeys = angular.element('.ng-dirty');
    var count = 0;
    var params = {uid: me.uid};
    angular.forEach(hasChangedKeys, function( ele ){

      var eleName = ele.name;
      if( !eleName ){
        return true;
      }

      var eleType = ele.type;
      if( eleType == 'radio' ){
        if( !angular.element( ele ).hasClass('ng-valid-parse') ){
          return;
        }
      }

      params[eleName] = $scope.user[eleName];
      count += 1;
    })

    if( count == 0 ){
      EOUtils.toast('资料没有变化');
      return;
    }
    
    EOUtils.showLoading();
    EOUser.update(params, function(status, statusText, data){
      EOUtils.hideLoading();
      EOUtils.toast(data.text);
      formScope.eoProfileEditForm.$setPristine();
      angular.element('.ng-dirty').removeClass('ng-dirty');
      EOUser.refreshCachedUser();
    }, function(){
      EOUtils.hideLoading();
    });
  }

  // 打开头像编辑选择
  $scope.openHeaderEdit = function($event){
    $scope.headerPopover.show($event);
  }

  // 关闭头像编辑选择
  $scope.closeHeaderEdit = function(){
    $scope.headerPopover.hide();
  }

  // 打开经营类型选择
  $scope.openBussinessModal = function($event){
  	$event.stopPropagation();
  	$scope.bussinessModal.show();
  }

  // 关闭经营类型选择
  $scope.closeBussinessModal = function(){
  	$scope.bussinessModal.hide();
  }

  // 设置经营内容
  $scope.setBtype = function(b){
  	$scope.user.bType = b.id;
    angular.element('.eo-profile-edit-storeBussiness').addClass('ng-dirty');
  }

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
})


/*
 * 我的钱包Controller
 */
.controller('ProfileWalletCtrl', function($scope, $ionicHistory
  , EOUser, EOUtils) {

  var me = EOUser.me();

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
})