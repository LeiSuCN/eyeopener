angular.module('eyeopener.controllers')

/*
 * 用户资料编辑Controller
 */
.controller('ProfileEditCtrl', function($scope, $ionicModal, $ionicHistory
  , EOUser, EOUtils) {

  var me = EOUser.me();

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

  angular.extend($scope.user, me);

  // 默认经营业务要设为便利店
  $scope.user.bType = 'convenience';

  console.log( $scope.user )

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
  }

  $scope.goBack = function(){
    $ionicHistory.goBack();
  }
})