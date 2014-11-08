define(['directives/directives'], function (directives) {
	'use strict';

	function Validate(name, key, callback) {

		this.validate = function ($filter) {

			return {
				require: '?ngModel',

				link: function (scope, elm, attrs, ctrl) {
					if (!ctrl) { return; }

					var validateFn = function (valueToValidate) {
						var expression = callback(scope, elm, attrs, ctrl, valueToValidate, $filter);
						if (!expression) {
							elm.removeAttr('data-enzo-validate-' + key);
						} else {
							elm.attr('data-enzo-validate-' + key, expression);
						}

						ctrl.$setValidity(key, !expression);
						return valueToValidate;
					};

					ctrl.$formatters.push(validateFn);
					ctrl.$parsers.push(validateFn);

					scope.$watch(attrs[name], function () {
						validateFn(ctrl.$modelValue);
					});

					attrs.$observe(name + 'Message', function () {
						validateFn(ctrl.$modelValue);
					});

					if (attrs.enzoValidateWatch) {
						var watch = scope.$eval(attrs.enzoValidateWatch);
						if (angular.isString(watch)) {
							scope.$watch(watch, function () {
								validateFn(ctrl.$modelValue);
							});

						} else {
							validateFn(ctrl.$modelValue);
						}
					}
				}
			};
		};
	}

	function isEmpty(value) {
		if (angular.isArray(value)) { return value.length === 0; }
		return isUndefined(value) || value === '' || value === null || value !== value;
	}

	function isUndefined(value) {
		return typeof value === 'undefined';
	}

	function getWordsLength(val) {
		val = val.replace(/(^\s*)|(\s*$)/gi, '');
		val = val.replace(/[ ]{2,}/gi, ' ');
		val = val.replace(/\n /, '\n');
		return val.split(' ').length;
	}

	function getDatePattern(attrs) {
		if (attrs.hInputDatetime) {
			return I18n.lookup('enzo.date').formats.medium;

		} else if (attrs.hInputTime) {
			return I18n.lookup('enzo.date').formats.mediumTime;

		} else if (attrs.enzoInputMonth) {
			return 'MM/yyyy';

		} else if (attrs.enzoInputYear) {
			return 'yyyy';
		}
		return I18n.lookup('enzo.date').formats.mediumDate;
	}


	directives.directive('enzoValidate', function () {

		return {
			restrict: 'A',
			require: 'ngModel',

			link: function (scope, elm, attrs, ctrl) {
				var validateFn, watch, validators = {}, validateExpr = scope.$eval(attrs.hValidate);
				if (!validateExpr) { return; }

				if (angular.isString(validateExpr)) {
					validateExpr = { validator: validateExpr };
				}

				angular.forEach(validateExpr, function (exprssn, key) {

					validateFn = function (valueToValidate) {
						var expression = scope.$eval(exprssn, { '$value' : valueToValidate });
						if (angular.isFunction(expression.then)) {
							/* expression is a promise */
							expression.then(function () {
								elm.removeAttr('data-enzo-validate-' + key);
								ctrl.$setValidity(key, true);
							}, function (expression) {
								elm.attr('data-enzo-validate-' + key, expression);
								ctrl.$setValidity(key, false);
							});
							return valueToValidate;


						} else if (!expression) {
							elm.removeAttr('data-enzo-validate-' + key);
							ctrl.$setValidity(key, true);
							return valueToValidate;
						}

						elm.attr('data-enzo-validate-' + key, expression);
						ctrl.$setValidity(key, false);
						return valueToValidate;
					};


					validators[key] = validateFn;
					ctrl.$formatters.push(validateFn);
					ctrl.$parsers.push(validateFn);
				});

				/* Support for ui-validate-watch */
				if (attrs.enzoValidateWatch) {
					watch = scope.$eval(attrs.enzoValidateWatch);
					if (angular.isString(watch)) {
						scope.$watch(watch, function () {
							angular.forEach(validators, function (validatorFn) {
								validatorFn(ctrl.$modelValue);
							});
						});

					} else {

						angular.forEach(watch, function (expression, key) {

							if (angular.isString(expression)) {
								scope.$watch(expression, function () {
									validators[key](ctrl.$modelValue);
								});

							} else {
								angular.forEach(expression, function (expression2) {
									scope.$watch(expression2, function () {
										validators[key](ctrl.$modelValue);
									});
								});
							}
						});
					}
				}
			}
		};
	});


	/*	*/
	directives.directive('enzoRegexp', new Validate('enzoRegexp', 'regexp', function (scope, element, attrs, ctrl, value) {
		var regexp = scope.$eval(attrs.enzoRegexp);
		return !regexp || isEmpty(value) || new RegExp(regexp, '').test(value) ? '' : attrs.enzoRegexpMessage || I18n.t('enzo.validation.regexp');
	}).validate);


	directives.directive('enzoMinwords', new Validate('enzoMinwords', 'minwords', function (scope, element, attrs, ctrl, value) {
		var minwords = scope.$eval(attrs.enzoMinwords);
		return !value || getWordsLength(value) >= minwords ? '' :  attrs.enzoMinwordsMessage || I18n.t('enzo.validation.minwords', {minwords: minwords});
	}).validate);


	directives.directive('enzoMaxwords', new Validate('enzoMaxwords', 'maxwords', function (scope, element, attrs, ctrl, value) {
		var maxwords = scope.$eval(attrs.enzoMaxwords);
		return !value || getWordsLength(value) <= maxwords ? '' : attrs.enzoMaxwordsMessage || I18n.t('enzo.validation.maxwords', {maxwords: maxwords});
	}).validate);


	directives.directive('enzoRangewords', new Validate('enzoRangelength', 'rangewords', function (scope, element, attrs, ctrl, value) {
		var rangewords = scope.$eval(attrs.enzoRangewords);
		if (angular.isArray(rangewords) === false) { return ''; }
		return !value || (getWordsLength(value) >= rangewords[0] && getWordsLength(value) <= rangewords[1]) ? '' : attrs.enzoRangewordsMessage || I18n.t('enzo.validation.rangewords', {minwords: rangewords[0], maxwords: rangewords[1]});
	}).validate);


	directives.directive('enzoRequired', new Validate('enzoRequired', 'required', function (scope, element, attrs, ctrl, value) {
		var required = scope.$eval(attrs.enzoRequired);
		return required && (isEmpty(value) || value === false) ? attrs.enzoRequiredMessage || I18n.t('enzo.validation.required') : '';
	}).validate);


	directives.directive('enzoEqualto', new Validate('enzoEqualto', 'equalto', function (scope, element, attrs, ctrl, value) {
		var equals = scope.$eval(attrs.enzoEqualto);
		return equals === value ? '' : attrs.enzoEqualtoMessage || I18n.t('enzo.validation.equalto');
	}).validate);


	directives.directive('enzoMinlength', new Validate('enzoMinlength', 'minlength', function (scope, element, attrs, ctrl, value) {
		var minlength = scope.$eval(attrs.enzoMinlength);
		return !value || value.length >= minlength ? '' :  attrs.enzoMinlengthMessage || I18n.t('enzo.validation.minlength', {minlength: minlength});
	}).validate);


	directives.directive('enzoMaxlength', new Validate('enzoMaxlength', 'maxlength', function (scope, element, attrs, ctrl, value) {
		var maxlength = scope.$eval(attrs.enzoMaxlength);
		return !value || value.length <= maxlength ? '' : attrs.enzoMaxlengthMessage || I18n.t('enzo.validation.maxlength', {maxlength: maxlength});
	}).validate);


	directives.directive('enzoRangelength', new Validate('enzoRangelength', 'rangelength', function (scope, element, attrs, ctrl, value) {
		var rangelength = scope.$eval(attrs.enzoRangelength);
		if (angular.isArray(rangelength) === false) { return ''; }
		return !value || (value.length >= rangelength[0] && value.length <= rangelength[1]) ? '' : attrs.enzoRangelengthMessage || I18n.t('enzo.validation.rangelength', {minlength: rangelength[0], maxlength: rangelength[1]});
	}).validate);


	directives.directive('enzoMincheck', new Validate('enzoMincheck', 'mincheck', function (scope, element, attrs, ctrl, value) {
		var mincheck = scope.$eval(attrs.enzoMincheck);
		return !value || value.length >= mincheck ? '' :  attrs.enzoMincheckMessage || I18n.t('enzo.validation.mincheck', {mincheck: mincheck});
	}).validate);


	directives.directive('enzoMaxcheck', new Validate('enzoMaxcheck', 'maxcheck', function (scope, element, attrs, ctrl, value) {
		var maxcheck = scope.$eval(attrs.enzoMaxcheck);
		return !value || value.length <= maxcheck ? '' : attrs.enzoMaxcheckMessage || I18n.t('enzo.validation.maxcheck', {maxcheck: maxcheck});
	}).validate);


	directives.directive('enzoRangecheck', new Validate('enzoRangecheck', 'rangecheck', function (scope, element, attrs, ctrl, value) {
		var rangecheck = scope.$eval(attrs.enzoRangecheck);
		if (angular.isArray(rangecheck) === false) { return ''; }
		return !value || (value.length >= rangecheck[0] && value.length <= rangecheck[1]) ? '' : attrs.enzoRangecheckMessage || I18n.t('enzo.validation.rangecheck', {mincheck: rangecheck[0], maxcheck: rangecheck[1]});
	}).validate);


	directives.directive('enzoMin', new Validate('enzoMin', 'min', function (scope, element, attrs, ctrl, value) {
		var min = scope.$eval(attrs.enzoMin);
		return !value || (Number(value) >= Number(min)) ? '' :  attrs.enzoMinMessage || I18n.t('enzo.validation.min', {min: min});
	}).validate);


	directives.directive('enzoMax', new Validate('enzoMax', 'max', function (scope, element, attrs, ctrl, value) {
		var max = scope.$eval(attrs.enzoMax);
		return !value || (Number(value) <=  Number(max)) ? '' : attrs.enzoMaxMessage || I18n.t('enzo.validation.max', {max: max});
	}).validate);


	directives.directive('enzoRange', new Validate('enzoRange', 'range', function (scope, element, attrs, ctrl, value) {
		var range = scope.$eval(attrs.enzoRange);
		if (angular.isArray(range) === false) { return ''; }
		return !value || (Number(value) >=  Number(range[0]) && Number(value) <=  Number(range[1])) ? '' : attrs.enzoRangeMessage || I18n.t('enzo.validation.range', {min: range[0], max: range[1]});
	}).validate);



	directives.directive('enzoGreaterthan', new Validate('enzoGreaterthan', 'greaterthan', function (scope, element, attrs, ctrl, value) {
		var greaterthan = scope.$eval(attrs.enzoGreaterthan);
		return !greaterthan || (value && Number(value) > Number(greaterthan)) ? '' :  attrs.enzoGreaterthanMessage || I18n.t('enzo.validation.greaterthan', {greaterthan: greaterthan});
	}).validate);


	directives.directive('enzoLessthan', new Validate('enzoLessthan', 'lessthan', function (scope, element, attrs, ctrl, value) {
		var lessthan = scope.$eval(attrs.enzoLessthan);
		return !lessthan || (value && Number(value) <  Number(lessthan)) ? '' : attrs.enzoLessthanMessage || I18n.t('enzo.validation.lessthan', {lessthan: lessthan});
	}).validate);


	directives.directive('enzoAfterdate', new Validate('enzoAfterdate', 'afterdate', function (scope, element, attrs, ctrl, value, $filter) {
		var afterdate = scope.$eval(attrs.enzoAfterdate);
		return !afterdate || (value && Date.parse(value) > Date.parse(afterdate)) ? '' :  attrs.enzoAfterdateMessage || I18n.t('enzo.validation.afterdate', {afterdate: $filter('date')(afterdate, getDatePattern(attrs))});
	}).validate);


	directives.directive('enzoBeforedate', new Validate('enzoBeforedate', 'beforedate', function (scope, element, attrs, ctrl, value, $filter) {
		var beforedate = scope.$eval(attrs.enzoBeforedate);
		return !beforedate || (value && Date.parse(value) <  Date.parse(beforedate)) ? '' : attrs.enzoBeforedateMessage || I18n.t('enzo.validation.beforedate', {beforedate: $filter('date')(beforedate, getDatePattern(attrs))});
	}).validate);

});
