/*
 * ANGULAR APP.JS
 */

'use strict';

angular.module('myApp', ['satellizer',
                         'ui.router',
                         'ngSanitize',
                         'angular.filter',
                         'ui.bootstrap',
                         'ngAnimate'])

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
      })
      .state('leaderboard-index', {
        url: '/leaderboard',
        templateUrl: 'templates/leaderboard-index.html',
        controller: 'LeaderboardIndexCtrl'
      });

    $urlRouterProvider.otherwise("/state1");

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
  }]);
