angular.module('eyeopener.directives', [])

.directive('eoFinderTypes', function($compile){
	return {
		restrict: 'E',
		link: function(scope, element, attrs){

			function updateView(rootTypes){
				var html = '';
				angular.forEach(rootTypes, function(root, ri){
					var typeHtml = '';
					typeHtml += '<div class="finder-list-group">'
					typeHtml += '<div class="finder-list-group-header">';
					typeHtml += '<span class="finder-list-group-header-name">' + root.name + '</span>';
					typeHtml += '<a class="button button-clear icon-right ion-chevron-right finder-list-group-header-more" ng-click="drillSubs(' + ri + ')">更多类目(' + root.types.length + ')</a>';
					typeHtml += '</div>';// <!-- /.finder-list-group-header -->

					typeHtml += '<div class="finder-list-group-subs">';
					var types = root.types;
					var showSize = Math.min( 4, types.length );
					for( var i = 0 ; i < showSize ; i++ ){
						var type = types[i];
						var jsType = "ng-click='goTypeList(" + JSON.stringify(type) + ")'";
						typeHtml += '<div class="finder-list-group-sub" style="background-image:url(' + type.picUrl + ')" ' + jsType + '>';
						typeHtml += '<span class="finder-list-group-sub-name">' + type.name + '</span>';

						// <!-- finder-list-group-sub-summary -->
						typeHtml += '<div class="finder-list-group-sub-summary">'
						typeHtml += '<span class="finder-list-group-sub-article"><i class="icon ion-ios-bookmarks-outline"></i>' + type.countArticle + '</span>';
						typeHtml += '<span class="finder-list-group-sub-comment"><i class="icon ion-ios-chatboxes-outline"></i>' + type.countComment + '</span>';
						typeHtml += '<span class="finder-list-group-sub-like"><i class="icon ion-ios-heart-outline"></i>' + type.countLike + '</span>';
						typeHtml += '</div>'; 
						// <!-- /.finder-list-group-sub-summary -->

						typeHtml += '</div>';// <!-- /.finder-list-group-sub -->
					}
					typeHtml += '</div>';// <!-- /.finder-list-group-subs -->

					typeHtml += '</div>';// <!-- /.finder-list-group -->
					html += typeHtml;
				})
				html = $compile(html)( scope );
				element.html( html );		
			}


			scope.$watchCollection(attrs.types, function(value){
				updateView(value);
			})
		}
	}
})

.directive('eoFocusMe', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      $timeout(function() {
        element[0].focus(); 
        if(ionic.Platform.isAndroid()){
           cordova.plugins.Keyboard.show();
        }
      }, 150);
    }
  };
});