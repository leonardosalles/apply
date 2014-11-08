define(['services/services'], function (services) {
	'use strict';

	services.factory('Artworks', function ($resource, $http, $config) {
		return $resource($config.apiUrl + '/artworks/:id', {id: '@id'}, {
            query: {method: 'GET', params: {}, isArray: false},
            update: {method: 'PUT'}
        });
	});
    
    services.factory('Mediums', function ($resource, $http, $config) {
		return $resource($config.apiUrl + '/mediums/:id', {id: '@id'}, {
            query: {method: 'GET', params: {}, isArray: false}
        });
	});
    
    services.factory('Materials', function ($resource, $http, $config) {
		return $resource($config.apiUrl + '/materials/:id', {id: '@id'}, {
            query: {method: 'GET', params: {}, isArray: false}
        });
	});
});
