angular.module('eyeopener.filters', [])

// 任务状态
.filter('typeName', function() {

  return function(type){

    if( type == '0' ){
      return '顺丰';
    } else{
      return '其他';
    }
  }
})