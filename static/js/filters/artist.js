define(['filters/filters'], function (filters) {
	'use strict';
	
	filters.filter('artist', function ($parse) {

		return function(items, field) {
            var result = [];
            angular.forEach(items, function(item, index) {
                if (item.artist.toLowerCase().indexOf(field) > -1 || !field) {
                    result.push(item);
                }
            });
            return result;
        };
	});
});