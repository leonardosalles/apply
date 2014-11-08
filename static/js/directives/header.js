define(['directives/directives', 'text!views/directives/header.html'], function (directives, template) {
	'use strict';
	
	directives.directive('artworkHeader', function ($rootScope) {

		return {
			restrict: 'A',
			replace: true,
			template: template,
			scope: true,
			 
			link: function postLink(scope, element, attrs) {
				scope.filter = {};
                
                scope.filterList = function () {
                    $rootScope.artistTxt = scope.filter.artist.toLowerCase();
                };
                
                scope.clear = function () {
                    scope.filter = {};
                    $rootScope.artistTxt = null;
                };
                
                scope.createArtwork = function () {
                    $rootScope.create = true;
                    $rootScope.entity = {};
                };
			}
		};
	});
});