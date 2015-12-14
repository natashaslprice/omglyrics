/*
 * CONTROLLERS
 */

'use strict';

angular.module('myApp.controllers', [])
  .controller('MainCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
    // INITIALIZATION AND NAVBAR LOGIC
  }])

  // SONG SEARCH
  .controller('LandingIndexCtrl', ['$scope', '$http', '$window', '$element', '$location', 'uniqueFilter', 'sharedAlbums', function ($scope, $http, $window, $element, $location, uniqueFilter, sharedAlbums) {
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
  }]) // end of LandingIndexCtrl


  .controller('SongsIndexCtrl', ['$scope', '$http','$window', '$element', '$location', 'sharedAlbums', 'removeAccents', '$uibModal', '$log', function ($scope, $http, $window, $element, $location, sharedAlbums, removeAccents, $uibModal, $log) { 
    // get albums from sharedAlbums factory
    $scope.albums = sharedAlbums.getAlbums();
    // console.log($scope.albums);

    // find if bronze silver or gold level selected
    $scope.value = 'Bronze';
    $scope.newValue = function(value) {
      $scope.level = value;
      console.log($scope.level);
    };

    // on click of image, get tracks from spotify api
    $scope.getTracks = function() {
      // get spotify album id from item that was clicked
      var albumId = this.album.id;
      // send album name to view
      $scope.albumTitle = this.album.name;
      // send spotify id into spotify api and get albums tracks
      $http.post('/api/tracks', {id: albumId})
        .success(function(response) {
          // console.log(response);
          // send tracks to view
          $scope.tracks = response;
        })
        .error(function(error) {
          console.log("The error with the /api/tracks call is: ", error);
        });
    }; // end of getTracks function

    // get lyrics for chosen track
    $scope.getLyrics = function() {
      // console.log("clicked", this.track.name);
      // remove any accents from artists names
      var trackArtist = removeAccents.removeDiacritics(this.track.artists[0].name);
      $scope.trackName = this.track.name;
      // $scope.trackName = sharedTrackName.setTrackName(trackName);
      console.log(trackArtist, $scope.trackName);
      // send trackArtist and trackName into musixmatch api to get lyrics
      $http.post('/api/lyrics', {artist: trackArtist, track: $scope.trackName})
        .success(function(response) {
          console.log(response);
          // get track uri numbers for spotify play button
          $scope.trackUri = response.match(/:[^:]*$/g);
          // console.log("here", $scope.trackUri);
          // remove the ** words **
          response = response.replace(/\*[^\/]+$/g, ' ');
          // make lyrics into array, using spaces, commas, brackets and line breaks
          var responseArray = response.replace( /\n/g, " " ).split(/[ ,().]+/);
          // console.log(responseArray);

          // get no.of words to blank out based on level and length of response array
          $scope.numberOfBlanks = 0;
          // if gold, 30% of words blank
          if ($scope.level == 'Gold') {
            $scope.numberOfBlanks = Math.floor(0.25 * responseArray.length);
          }
          // if silver, 20% of words blank
          else if ($scope.level == 'Silver') {
            $scope.numberOfBlanks = Math.floor(0.1 * responseArray.length);
          }
          // if bronze, 10% of words blank
          else {
            $scope.numberOfBlanks = Math.floor(0.05 * responseArray.length);
          }
          console.log($scope.numberOfBlanks);

          // set array of indexes to empty
          var blanksIndexes = [];
          // while loop until blanksIndexes length is equal to the $scope.numberOfBlanks
          while (blanksIndexes.length !== $scope.numberOfBlanks) {
            // choose random number between 1 and length of response array
            var randomNumber = Math.floor((Math.random() * (responseArray.length-1)) + 1);
            // if blanksIndexes empty
            if (blanksIndexes.length === 0) {
              // check no apostrophe in word, replace word with input field and push index into array
              checkApostrophe(blanksIndexes, randomNumber, responseArray);
              // console.log(blanksIndexes);
            }
            else {
              // check function for unique index value and apostrophes
              checkUnique(blanksIndexes, randomNumber, responseArray);
            }
          }
          // console.log(blanksIndexes);
          // console.log(responseArray);
          
          // make array a string again
          var stringLyrics = responseArray.join(" ");
          console.log(stringLyrics);
          
          // replace the line breaks with <br>
          // var stringLyricsBreak = stringLyrics.replace(/\n/g, '<br>'); 
          $('#lyrics').html(stringLyrics);
          // $scope.lyrics = stringLyrics;

          // show play button
          $scope.showButton = true;
        })
        .error(function(error) {
          console.log("The error with the /api/lyrics call is: ", error);
        });
    };
    


    // checkUnique for unique index value and apostrophes
    var checkUnique = function(indexArray, randomNumber, lyricsArray) {
      // for loop through blanksIndexes to check number doesn't already exist
      var found = false;
      for (var i = 0; i < indexArray.length; i ++) {
        if (randomNumber === indexArray[i]) {
          found = true;
          return;
        }
      }
      // if not found
      if (!found) {
        // console.log(randomNumber);
        // checkApostrophe function
        checkApostrophe(indexArray, randomNumber, lyricsArray);
      }
    };

    // checkApostrophe function 
    var checkApostrophe = function(indexArray, randomNumber, lyricsArray) {
      // if word not blank or ... and no apostrophe in the word
      if (lyricsArray[randomNumber] !== " " && lyricsArray[randomNumber] !== "" && lyricsArray[randomNumber] !== "..." && lyricsArray[randomNumber].indexOf('\'') <= 0) {
        // then replace word with input, with data-id same as word
        var inputField = "<input type='text' class='lyricsInputs' data-id='" + lyricsArray[randomNumber] + "'>";
        lyricsArray[randomNumber] = lyricsArray[randomNumber].replace(lyricsArray[randomNumber], inputField);
        // and push that number into number array
        indexArray.push(randomNumber);
      }
      else {
        return;
      }
    };

    // check lyrics when user presses play button
    $scope.checkLyrics = function() {
      // find lyricsInputs class and check whether inputs == data-id
      var elements = $element.find('.lyricsInputs');
      // console.log(elements);
      // for each element, if correct show green box and increase count
      var count = 0;
      for (var k = 0; k < elements.length; k++) {
        // console.log("data-id: ", elements[k].dataset.id, "value: ", elements[k].value);
        if (elements[k].dataset.id.trim().toLowerCase() == elements[k].value.trim().toLowerCase()) {
          elements[k].style.borderColor = "green";
          count ++;
          // console.log(count);
          // console.log($scope.numberOfBlanks);
          if (count === $scope.numberOfBlanks) {
            //new code
            $scope.items = [$scope.trackName, $scope.level, $scope.trackUri[0]];

            $scope.animationsEnabled = true;

            $scope.open = function (size) {
              var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                  items: function () {
                    return $scope.items;
                  }
                }
              });

              modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
              }, function () {
                $log.info('Modal dismissed at: ' + new Date());
              });
            };

            // $scope.toggleAnimation = function () {
            //   $scope.animationsEnabled = !$scope.animationsEnabled;
            // };

            // end of new code

            // console.log("uri: ", $scope.trackUri);
            // $scope.player = "<iframe src='https://embed.spotify.com/?uri=spotify:track" + $scope.trackUri[0] + "' width='300' height='380' frameborder='0' allowtransparency='true'></iframe>";
            // $('#spotifyPlay').html($scope.player);
          }
        }
        else {
         elements[k].style.borderColor = "red"; 
        }
      }
  };
    
  }]) // end of SongsIndexCtrl

  .controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items, $sce) {
    console.log(items);
    // set trackname
    $scope.trackName = items[0];
    // set level
    if (items[1] === undefined) {
      $scope.level = "bronze";  
    }
    else {
      $scope.level = items[1];
    }
    // set spotify player
    // $scope.trackUri = items[2];
    $scope.spotifyPlay = $sce.trustAsHtml("<iframe src='https://embed.spotify.com/?uri=spotify:track" + items[2] + "' width='300' height='380' frameborder='0' allowtransparency='true'></iframe>");
    console.log($scope.spotifyPlay);
    // $('#spotifyPlay').html($scope.player);

    $scope.close = function () {
      $uibModalInstance.dismiss('close');
    };
  });



