/*
 * ANGULAR APP.JS
 */

'use strict';

angular.module('myApp', ['ui.router',
                         'myApp.controllers',
                         'ngSanitize',
                         'angular.filter',
                         'ui.bootstrap'])

  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('landing', {
        url: '/',
        templateUrl: 'templates/landing-index.html',
        controller: 'LandingIndexCtrl'
      })
      .state('songs-index', {
        url: '/songs',
        templateUrl: 'templates/songs-index.html',
        controller: 'SongsIndexCtrl'
      });

    $urlRouterProvider.otherwise("/state1");

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
  }]);
