define(['services/services'], function (services) {
	'use strict';
	
	services.service('$utils', function (Artworks, Mediums, Materials, $error, $resource) {
		
		this.findByUrlInArray = function (key, array) {
            if (!array) { return; }

            for (var i=0, n=array.length; i < n; i++) {
                if (key === array[i].url) {
                    return array[i];
                }
            }
		};
        
        this.getElementDataId = function (element) {
            var id = element.parent().parent().next()[0].dataset.artworkId;
            
            if (id.indexOf('{') === 0) {
                id = null;
            }
            
            return id;
        };
	});
});
