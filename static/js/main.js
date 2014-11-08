require.config({
    baseUrl: 'static/js',
    paths: {
        'angular': '../../vendor/angular/angular',
        'angular-route': '../../vendor/angular/angular-route',
        'angular-animate': '../../vendor/angular/angular-animate',
        'angular-resource': '../../vendor/angular/angular-resource',
        'angular-cookies': '../../vendor/angular/angular-cookies',
        'angular-loader': '../../vendor/angular/angular-loader',
        'angular-sanitize': '../../vendor/angular/angular-sanitize',
        'bootstrap': '../../vendor/bootstrap/js/bootstrap.min',
        'bootstrap-modal': '../../vendor/bootstrap-modal/bootstrap-modal',
        'bootstrap-modalmanager': '../../vendor/bootstrap-modal/bootstrap-modalmanager',
        'jquery': '../../vendor/jquery/jquery',
        'select2': '../../vendor/select2/select2',
        'i18n': '../../vendor/i18njs/i18n',
        'text': '../../vendor/requirejs-text/text',
        'views': '../views'
    },
    shim: {
        'angular': {
            deps: ['jquery'],
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-resource': {
            deps: ['angular']
        },
        'angular-animate': {
            deps: ['angular']
        },
        'angular-cookies': {
            deps: ['angular']
        },
        'angular-loader': {
            deps: ['angular']
        },
        'angular-sanitize': {
            deps: ['angular']
        },
        'bootstrap': {
            deps: ['jquery']
        },
        'bootstrap-modal': {
            deps: ['bootstrap']
        },
        'bootstrap-modalmanager': {
            deps: ['bootstrap-modal']
        },
        'jquery': {
            exports: '$'
        },
        'i18n': {
            exports: 'I18n'
        },
        'select2': {
            deps: ['jquery']
        },
    }
});

require(['app', 'jquery'], function () {
    'use strict';
    $(document).ready(function () {
        angular.bootstrap(document, ['enzo']);
    });
});
