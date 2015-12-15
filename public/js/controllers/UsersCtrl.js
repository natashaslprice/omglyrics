/*
 * SONGS PAGE CONTROLLER
 */

'use strict';

angular.module('myApp')
  .controller('UsersCtrl', ['$scope', '$http', '$auth', 'Auth', function($scope, $http, $auth, Auth) {
    console.log("UsersCtrl active");
    
    // get current user
    $http.get('/api/me').then(function(data) {
      $scope.user = data.data;
      $scope.songsGold = $scope.user.songsGold;
      $scope.goldCount = $scope.user.songsGold.length;
      $scope.songsSilver = $scope.user.songsSilver;
      $scope.silverCount = $scope.user.songsSilver.length;
      $scope.songsBronze = $scope.user.songsBronze;
      $scope.bronzeCount = $scope.user.songsBronze.length;
    	// console.log($scope.silverCount);
	  	if ($scope.goldCount === 1) {
	  		$scope.badgeGold = "badge";
	  	}
	  	else {
	  		$scope.badgeGold = "badges";
	  	}
	  	if ($scope.silverCount === 1) {
	  		$scope.badgeSilver = "badge";
	  	}
	  	else {
	  		$scope.badgeSilver = "badges";
	  	}
	  	if ($scope.bronzeCount === 1) {
	  		$scope.badgeBronze = "badge";
	  	}
	  	else {
	  		$scope.badgeBronze = "badges";
	  	}
    });
}]);