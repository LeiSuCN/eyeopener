angular.module('eyeopener.filters', [])

/*
 * 专题ID转专题名称
 */
.filter('typeName', function(EOArticles) {

  return function(typeId){
  	var name = '';
  	var typeResp = EOArticles.cacheTypes;
  	if( typeResp && typeResp.data ){
  		var types = typeResp.data;

      for( pId in types ){
        var type = types[pId];

        for( var i = 0 ; i < type.menu.length ; i++ ){
          var sub = type.menu[i];
          if( sub.id == typeId ){
            name = type.name;
            break;
          }
        }

        if( name ){
          break;
        }
      }
  	}
    return name;
  }
})

/*
 * 专题ID转专题图片
 */
.filter('typePic', function(EOArticles) {

  return function(typeId){
    var pic = '';
    var typeResp = EOArticles.cacheTypes;
    if( typeResp && typeResp.data ){
      var types = typeResp.data;

      for( pId in types ){
        var type = types[pId];

        for( var i = 0 ; i < type.menu.length ; i++ ){
          var sub = type.menu[i];
          if( sub.id == typeId ){
            pic = type.picUrl;
            break;
          }
        }

        if( pic ){
          break;
        }
      }
    }
    return pic;
  }
})

/*
 * 专题ID转专题颜色
 */
.filter('typeColor', function(EOArticles) {

  return function(typeId){
    var color = '';
    var typeResp = EOArticles.cacheTypes;
    if( typeResp && typeResp.data ){
      var types = typeResp.data;

      for( pId in types ){
        var type = types[pId];

        for( var i = 0 ; i < type.menu.length ; i++ ){
          var sub = type.menu[i];
          if( sub.id == typeId ){
            color = type.bgc;
            break;
          }
        }

        if( color ){
          break;
        }
      }
    }
    return color;
  }
})

/*
 * 时间转换为时间差
 */
.filter('eoReadableTime', function($filter) {

  var DIFF_JUSTNOW = 60 * 1000; // 一分钟内算刚刚
  var DIFF_MINS_MAX = 1 * 60 * 60 * 1000; // 显示分钟的最大时间差
  var DIFF_HOUR_MAX = 12 * 60 * 60 * 1000; // 显示小时的最大时间差

  // 毫秒时间差
  function diff( targetDate ){
    var now = new Date();
    return now.getTime() - targetDate;
  }

  return function( oriDate ){

    var diffMills = diff( oriDate );

    if( diffMills < DIFF_JUSTNOW ){
      return '刚刚';
    } else if( diffMills < DIFF_MINS_MAX ){
      return parseInt( diffMills / 60000 ) + '分钟前';
    } else if( diffMills < DIFF_HOUR_MAX ){
      return parseInt( diffMills / 3600000 ) + '小时前';
    } else{
      return $filter('date')(oriDate, 'MM月dd日');
    }
  }
})

/*
 * 经营id转经营名城
 */
 .filter('eoBussinessId2Name', function($filter) {

  return function( id ){
    var name = '';
    for( var i = 0 ; i < top.window.BUSINESS.length ; i++ ){
      var b = top.window.BUSINESS[i];

      if( b.id == id ){
        name = b.name;
        break;
      }
    }
    return name;
  }

})
