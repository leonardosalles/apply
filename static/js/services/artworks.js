define(['services/services'], function (services) {
	'use strict';
	
	services.service('$artworks', function (Artworks, Mediums, Materials, $error, $resource) {
		
		this.findAll = function (callback) {
            this.resourceAsList(Artworks, callback);
		};
        
        this.findById = function (id, callback) {
			Artworks.get({id: id}, function (response) {
                callback.apply(this, [response]);
            }, $error.notify());
            
            return;
		};
        
        this.getMediums = function (callback) {
            this.resourceAsList(Mediums, callback);
        };
        
        this.getMaterials = function (callback) {
            this.resourceAsList(Materials, callback);
        };
        
        this.resourceAsList = function (resource, callback) {
            var items = resource.query(null, function () {
                var list = [],
                    urlsLength = items.urls.length;
                
                if (urlsLength === 0) {
                    callback.apply(this, []);
                }
                
                angular.forEach(items.urls, function (item, index) {
                    var resource = $resource(item);
                    
                    resource.get().$then(function (response) {
                        list.push(response.resource);
                        
                        if (urlsLength === list.length) {
                            callback.apply(this, [list]);
                        }
                    }, $error.notify());
                });
            });
        };
	});
});
