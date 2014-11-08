define([
	'translates/locale_en',
	'text!../views/directives/error.html',

	'core',
	'controllers/controllers',
	'controllers/home-ctrl'

], function (localeEn, templateError) {
	'use strict';

    var enzo = angular.module('enzo', ['enzo.services', 'enzo.controllers', 'enzo.directives', 'enzo.filters', 'ngRoute', 'ngAnimate', 'ngSanitize']);

	enzo.config(function ($translateProvider, $provide, $routeProvider, $httpProvider, $locationProvider) {
		$translateProvider.translations('en', localeEn);

		$provide.factory('$config', function() {
			return App;
		});

		$routeProvider.when('/error', {error: true, template: templateError, controller: function ($window, $scope, $error) {
			$window.document.title = I18n.t('enzo.exception.title');
			$scope.error = $error.get() || '';

			$scope.openStackTrace = function () {
				$error.stacktrace($scope.error.stackTrace);
			};
		}});

		$routeProvider.when('/error403', {error: true, template: templateError, controller: function ($window, $scope) {
			$window.document.title = I18n.t('enzo.exception.code.403');
			$scope.error = {message: I18n.t('enzo.exception.code.403')};
		}});

		$routeProvider.otherwise({error: true, template: templateError, controller: function ($window, $scope) {
			$window.document.title = I18n.t('enzo.exception.pageNotFound');
			$scope.error = {message: I18n.t('enzo.exception.pageNotFound')};
		}});
	});

	enzo.run(function ($bootstrap, $timeout) {
        $timeout(function () {
            $bootstrap.setProgress(30);
        }, 1000);
        
        $timeout(function () {
            $bootstrap.setProgress($bootstrap.getProgress() + 30);
        }, 2000);
        
        $timeout(function () {
            $bootstrap.setProgress($bootstrap.getProgress() + 40);
        }, 3000);
        
        $timeout(function () {
            $bootstrap.ready();
        }, 3100);
    });

	return enzo;
});
