define(['directives/directives'], function (directives) {
	'use strict';

	directives.directive('enzoLoading', function ($http, $filter) {

		return {
			restrict: 'A',
			replace: true,
			template: '<div class="body-loader">' +
						'<div class="body-loader-inner">' +
							'<p><span class="glyphicon glyphicon-refresh glyphicon-loader"></span></p>' +
							'<p><span class="loading-text">{{"enzo.loading" | i18n}}</span></p>' +
						'</div>' +
					'</div>',

			controller: function ($scope, $element) {

				$scope.$watchCollection(function () {
					return $http.pendingRequests;
				}, function () {

					var array = $filter('filter')($http.pendingRequests, function (request) {
						return (request.headers['enzo-loading'] === undefined || request.headers['enzo-loading']);
					});

					if (array.length > 0) {
						$element.addClass('active');
					} else {
						$element.removeClass('active');
					}
				}, true);
			}
		};
	});
});
