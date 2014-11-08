define(['directives/directives', 'text!../../views/directives/bootstrap.html'], function (directives, template) {
	'use strict';

	directives.directive('enzoBootstrap', function ($bootstrap) {
		return {
			restrict: 'A',
			replace: true,
			scope: true,
			template: template,

			link: function (scope, element) {
				scope.$bootstrap = $bootstrap;

				scope.$on('coreReady', function () {
					element.remove();
					$('body').addClass('ready');
				});
			}
		};
	});


});
