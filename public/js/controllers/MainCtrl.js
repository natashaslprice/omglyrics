/*
 * MAIN CONTROLLER
 */

'use strict';

angular.module('myApp')
  .controller('MainCtrl', ['$scope', '$location', '$auth', '$http', '$window', function ($scope, $location, $auth, $http, $window) {
    console.log("MainCtrl active");
    // LOGIN/REGISTER
    $scope.user = {};

    $scope.isAuthenticated = function() {
      $http.get('/api/me').then(function (data) {
        if (!!data.data) {
          $scope.currentUser = data.data;
        } 
        else {
          $auth.removeToken();
        }
      }, function (data) {
        $auth.removeToken();
        $location.path('/');
      });
    };

    $scope.isAuthenticated();

    $scope.email = '';

    $scope.signup = function() {
      $auth.signup($scope.user)
        .then(function(response) {
          // console.log(response);
          $auth.setToken(response);
          $scope.isAuthenticated();
          $scope.user = {};
          $window.location.reload();
        })
        .catch(function(response) {
          console.log(response);
        });
    };

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function(response) {
          $auth.setToken(response.data.token);
          $scope.isAuthenticated();
          $scope.user = {};
        })
        .catch(function(response) {
          console.log(response);
        });
    };

    $scope.logout = function() {
      $auth.logout()
        .then(function() {
          $auth.removeToken();
          $scope.currentUser = null;
          $location.path('/');
        });
    };
  }]);