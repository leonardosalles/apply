define(['directives/directives'], function (directives) {
	'use strict';

	var select2 =  function () {

		return {
			restrict: 'AE',
			require: '?ngModel',

			link: function (scope, element, attr, ctrl) {
				if (attr.enzoDuallistbox || element.data('select2')) {
					return;
				}

				element.bind('$destroy', function () {
					if (element.data('select2')) {
						element.select2('destroy');
					}
				});

				var check = attr.enzoSelect2Clear ? JSON.parse(attr.enzoSelect2Clear) : true,
					allowClear = true;

				if (check === false) {
					allowClear = check;
				}

				var minimumP = attr.enzoMinimumResultsForSearch ? JSON.parse(attr.enzoMinimumResultsForSearch) : true,
					minimum = 0;

				if (minimumP === -1) {
					minimum = parseInt(minimumP, 10);
				}

				var opts = angular.extend({placeholder: attr.placeholder || '', allowClear: allowClear, width: 'off', minimumResultsForSearch: minimum}, scope.$eval(attr.enzoSelect2));
				if (!ctrl) {
					element.select2(opts);
					return;
				}

				var verify = function () {
					var container = element.data('select2').container;
					if (ctrl.$valid && $(container).data('bs.tooltip')) {
						$(container).tooltip('destroy');
					}
				};

				var focus = function () {

					verify();
					if (ctrl.$valid) {
						return;
					}

					var container = element.data('select2').container;
					$(container).tooltip({animation: false, placement: 'top', trigger: 'manual', delay: {show: 100, hide: 0}});
					$(container).data('bs.tooltip').options.title = function () {
						var log = '';
						angular.forEach(ctrl.$error, function (value, key) {
							if (value) {
								log = $(element).attr('data-enzo-validate-' + key) || I18n.t('enzo.validation.defaultMessage');
							}
						});

						return log;
					};

					$(container).tooltip('show');
				};

				var blur = function () {
					var container = element.data('select2').container;
					if ($(container).data('bs.tooltip')) {
						$(container).tooltip('destroy');
					}
				};

                var open = function () {
                    if (attr.enzoDropMinSize) {
                       $('#select2-drop').css('min-width', attr.enzoDropMinSize);
                    }
                };

				ctrl.$formatters.push(function (value) {
					return angular.isArray(value) ? value : value || '';
				});

				ctrl.$parsers.push(function (value) {
					return angular.isArray(value) ? value : value || null;
				});

				if (element.is('select')) {

					scope.$watch(function () {
						if (element.data('select2')) {
							var value = element.val();
							element.select2('val', angular.isArray(value) ? value : value || null);
						} else {
							element.select2(opts);
						}

						verify();
					});

                    element.on('select2-focus', focus);
					element.on('select2-blur', blur);
                    element.on('select2-open', open);
					element.on('change', function () {
						if (element.data('select2').container.hasClass('select2-container-active')) {
							element.trigger('select2-focus');
						}
					});


				} else {

					ctrl.$render = function () {
						if (!element.data('select2')) {
							element.select2(opts);

							element.on('select2-focus', focus);
							element.on('select2-blur', blur);
                            element.on('select2-open', open);

							element.on('change', function () {
								ctrl.$setViewValue(element.select2('val'));
								if (element.data('select2').container.hasClass('select2-container-active')) {
									element.trigger('select2-focus');
								}

							});
						}

						element.select2('val', ctrl.$viewValue);
						verify();
					};

					element.bind('change', function () {
						if (scope.$$phase) { return; }

						scope.$apply(function () {
							ctrl.$setViewValue(element.select2('val'));
						});
					});
				}


			}
		};
	};

	directives.directive('select', select2);
	directives.directive('enzoSelect2', select2);

});
