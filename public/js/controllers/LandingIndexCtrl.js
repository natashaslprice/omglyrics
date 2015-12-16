/*
 * LANDING PAGE CONTROLLER
 */

'use strict';

angular.module('myApp')
  .controller('LandingIndexCtrl', ['$scope', '$http', '$window', '$element', '$location', 'uniqueFilter', 'sharedAlbums', '$anchorScroll', function ($scope, $http, $window, $element, $location, uniqueFilter, sharedAlbums, $anchorScroll) {
    console.log("LandingIndexCtrl active");
    
    // scroll to second section
    $scope.gotoBottom = function() {
      // get old location path
      var old = $location.hash();
      // set the location.hash to the id of the element to scroll to
      $location.hash('landingBottom');
      // call $anchorScroll()
      $anchorScroll();
      // make url clean
      $location.hash(old);
    };

    // function to search for books based on songs on submission of song-search form, get lyrics and post to page
    $scope.searchForm = function(data) {
      var artist = data.trim();
      // send artist into spotify api and get artist id
      $http.post('/api/artists', { artist: artist })
        .success(function(response) {
          // console.log(response);
          // on success, redirect to songs page
          $location.path('/songs');
          // get response
          var albumsOrdered = response;
          // get rid of duplicate albums
          var albums = uniqueFilter(albumsOrdered, 'name');
          // console.log(albums);
          // send albums into factory sharedAlbums
          $scope.albums = sharedAlbums.setAlbums(albums);
        })
        .error(function(error) {
          console.log("The error with the /api/artists call is: ", error);
          $scope.landingError = "Sorry, we could not find that artist. Please try again with a different name.";
        });
    }; // end of searchForm function
  }]);