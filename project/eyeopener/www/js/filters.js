angular.module('eyeopener.filters', [])

/*
 * 专题ID转专题名称
 */
.filter('typeName', function(EOArticles) {

  return function(typeId){
  	var name = '';
  	var typeResp = EOArticles.cacheTypes;
  	if( typeResp && typeResp.data && typeResp.data.length > 0 ){
  		var types = typeResp.data;
  		for( var i = 0 ; i < types.length; i++ ){
  			var type = types[i];
  			if( type.id == typeId ){
  				name = type.name;
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
  	if( typeResp && typeResp.data && typeResp.data.length > 0 ){
  		var types = typeResp.data;
  		for( var i = 0 ; i < types.length; i++ ){
  			var type = types[i];
  			if( type.id == typeId ){
  				pic = type.picUrl;
  				break;
  			}
  		}
  	}
    return pic;
  }
})