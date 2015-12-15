/*
 * SONGS PAGE CONTROLLER
 */

'use strict';

angular.module('myApp')
  .controller('SettingsIndexCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
    console.log("SettingsIndexCtrl active");

    // get current user data
    $http.get('/api/me').then(function(data) {
      $scope.user = data.data;
      // console.log($scope.user);
    });

    // edit user settings
    $scope.editSettings = function(user) {
	    $http.put('/api/me', user)
	    	.success(function(data) {
	    		console.log("successfully updated");
	    		$location.path("/profile");
	    	})
	    	.error(function(error) {
	    		console.log(error);
	    	});
    };


  }]);