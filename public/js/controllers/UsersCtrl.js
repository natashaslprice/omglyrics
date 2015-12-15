'use strict';

/* USER Controllers */

angular.module('myApp')
  .controller('UsersCtrl', ['$scope', '$http', '$auth', 'Auth', function($scope, $http, $auth, Auth) {
    console.log("UsersCtrl active");
    $http.get('/api/me').then(function(data) {
      $scope.user = data.data;
    });
}]);