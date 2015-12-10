angular.module('myApp').factory('AritstApi', function($http, artist) {

	$http.post('/api/artists', { artist: artist })
	  .success(function(response) {
	    // console.log(response);
	    // use album info on view
	    $location.path('/songs');
	    var albumsOrdered = response;
	    // get rid of duplicate albums
	    var albums = uniqueFilter(albumsOrdered, 'name');
	    // console.log(albums);

	    // GET TABS ON PAGE

	    var tabs = [];
	    for ( var i = 0; i < albums.length; i++) {
	      tabs.push( { title: albums[i].name, content: albums[i].name } );
	    }
	    $scope.tabs = tabs;
	    console.log($scope.tabs);
	    $scope.hello = "Hello";
	  })
	  .error(function(error) {
	    console.log("The error with the /api/artists call is: ", error);
	    $scope.landingError = "Sorry, we could not find that artist. Please try again with a different name.";
	  });

});