/*
 * LEADERBOARD PAGE CONTROLLER
 */

'use strict';

angular.module('myApp')
	.controller('LeaderboardIndexCtrl', ['$scope', '$http', function ($scope, $http) {
		console.log("LeaderboardIndexCtrl active");

		// get all users
		$http.get('/api/users').then(function(data) {
			var users = data.data;
			// console.log(users);

			// get each username with the points, as an array of objects
			var allUsers = [];
			// var points;
			for (var i = 0; i < users.length; i++) {
				var username = users[i].username;
				var numberOfGold = users[i].songsGold.length;
				var numberOfSilver = users[i].songsSilver.length;
				var numberOfBronze = users[i].songsBronze.length;
				// console.log(username, numberOfGold, numberOfSilver, numberOfBronze);
				var points = (numberOfGold * 25) + (numberOfSilver * 10) + (numberOfBronze * 5);
				allUsers.push({ username: username, points: points });
			}
			var allUsersOrdered = sortByKey(allUsers, 'points');
			var numberOfUsers = allUsersOrdered.length;
			var removed = allUsersOrdered.splice(10, (numberOfUsers - 10));
			// console.log(allUsersOrdered);
			$scope.leaders = allUsersOrdered;
		});

		function sortByKey(array, key) {
	    return array.sort(function(a, b) {
	        var x = a[key]; var y = b[key];
	        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
	    });
		}

}]);