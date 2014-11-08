define(['controllers/controllers',
			'text!../../../static/views/home.html'], function (controllers, template) {
	'use strict';

	controllers.config(['$routeProvider', function ($routeProvider) {
		$routeProvider.when('/', {template: template, controller: 'HomeCtrl'});
	}]);


	controllers.controller('HomeCtrl', function ($config, $scope, $window, $rootScope, $artworks, Artworks, $error, $resource, $notify, $utils, $http, $q) {
		$window.document.title = 'Welcome';

        var findAll = function (isDelete, isSave) {
            $artworks.findAll(function (response) {
                $scope.artworks = response;
                
                if (isDelete) {
                    $notify.success(I18n.t('message.deleteSuccess'));
                }
                
                if (isSave) {
                    $notify.success(I18n.t('message.saveSuccess'));
                }
            });
        };
        
        findAll();
        
        $artworks.getMediums(function (response) {
            $scope.mediums = response;
        });
        
        $artworks.getMaterials(function (response) {
            $scope.materials = response;
        });
        
        $rootScope.$watch('artistTxt', function (value) {
            $scope.artistTxt = value;
        });
        
        $scope.toggle = function (artwork) {
            if (artwork.expanded) {
                artwork.expanded = false;
                artwork.toggleText = I18n.t('message.showMore');
            } else {
                artwork.expanded = true;
                artwork.toggleText = I18n.t('message.showLess');
            }
        };
        
        $scope.deleteArtwork = function (id) {
            Artworks.remove({id: id}, function () {
                findAll(true);
            }, $error.notify());
        };
        
        $scope.updateArtwork = function (artwork) {
            var materials = [], 
                materialsTmp = [];
            
            if (artwork.materialsTmp) {
                materials = artwork.materialsTmp;
                
                //avoid key from http request
                delete artwork.materialsTmp;
            }
            
            if (artwork.medium && !isNaN(parseInt(artwork.medium, 10))) {
                artwork.medium = $config.apiUrl + '/mediums/' + artwork.medium;
            }
            
            Artworks.update(artwork, function () {
                var requests = [];
                $resource(artwork.materials).get(null, function (response) {
                    angular.forEach(response.urls, function (url) {
                        var config = {
                            method: 'DELETE',
                            url: artwork.materials,
                            data: {url: url},
                            headers: { 'Content-Type': 'application/json;charset=utf-8' }
                        };
                        
                        var httpRequest = $http(config);
                        requests.push(httpRequest);
                    });
                    
                    $q.all(requests).then(function() {
                        angular.forEach(materials, function (item) {
                            var url = $config.apiUrl + '/materials/' + item.id;
                            $resource(artwork.materials).save({url: url});
                        });

                        findAll(false, true);
                    });
                });
            });
        };
        
        $scope.includeArtwork = function () {
            if ($scope.formArtwork.form.isInvalid()) { return; }
            
            if ($rootScope.entity.vat) {
                $rootScope.entity.includes_vat = true;
            }
            
            if ($rootScope.entity.medium === '1') {
                $rootScope.entity.dimension3 = 0;
            }
            
            $rootScope.entity.medium = $config.apiUrl + '/mediums/' + $rootScope.entity.medium;

            Artworks.save($rootScope.entity, function () {
                $rootScope.create = false;
                $rootScope.entity = {};
                findAll(false, true);
            });
        };
        
        $scope.deleteCurrentArtwork = function () {
            $rootScope.create = false;
            $rootScope.entity = null;
        };
        
        $scope.isSculpture = function (medium) {
            var id = parseInt(medium.substring(medium.length -1, medium.length), 10);

            if (id === 1) {
                return;
            }

            return true;
        };
        
        $scope.setFormScope = function (form) {
            $scope.formArtwork = form;
        };

		$scope.mediumSelect = {
            minimumInputLength: 0,

			data: function () {
                var list = [];

                if ($scope.mediums) {
                    for (var i=0,n=$scope.mediums.length; i < n; i++) {
                        list.push({id: $scope.mediums[i].id, text: $scope.mediums[i].name});
                    }
                }
                
                return {results: list};
            },
            
			initSelection: function (element, callback) {
                var value = element.val();
                
                $resource(value).get(null, function (response) {
                    callback({id: response.id, text: response.name});
                });
			}
		};
        
        $scope.setSelectedMaterial = function (artwork) {
            if (typeof(artwork.materialNew) === 'string') { return; }
            
            artwork.materialsTmp.push(artwork.materialNew);
        };
        
        $scope.getArtworkMaterial = function (artwork) {
            if (!artwork.materials) { return; }
            
            //avoid a lot of http requests
            artwork.materialsTmp = [];
            
            $resource(artwork.materials).get(null, function (response) {
                if (response.urls.length === 0) { return; }
                
                angular.forEach(response.urls, function (item) {
                    var material = $utils.findByUrlInArray(item, $scope.materials);

                    if (material) {
                        artwork.materialsTmp.push(material);
                    }
                });
            });
        };
        
        $scope.removeMaterial = function (artwork, index) {
            artwork.materialsTmp.splice(index, 1);
        };
        
        $scope.materialSelect = {
            minimumInputLength: 1,
            multiple: false,
            allowClear: false,

			data: function () {
                var list = [];

                if ($scope.materials) {
                    for (var i=0,n=$scope.materials.length; i < n; i++) {
                        list.push({id: $scope.materials[i].id, text: $scope.materials[i].name});
                    }
                }
                
                return {results: list};
            },
            
            formatSelection: function (object, element) {
                var artworkId = $utils.getElementDataId(element);
                
                if (artworkId) {
                    var material = {
                        id: object.id,
                        name: object.text
                    };

                    $scope.artworks[artworkId].materialsTmp.push(material);
                }
            }
		};
	});
});
