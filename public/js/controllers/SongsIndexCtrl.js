/*
 * SONGS PAGE CONTROLLER
 */

'use strict';

angular.module('myApp')
  .controller('SongsIndexCtrl', ['$scope', '$http','$window', '$element', '$location', 'sharedAlbums', 'removeAccents', '$uibModal', '$log', '$auth', '$sce', '$compile', function ($scope, $http, $window, $element, $location, sharedAlbums, removeAccents, $uibModal, $log, $auth, $sce, $compile) { 
    console.log("SongsIndexCtrl active");
    
    // get albums from sharedAlbums factory
    $scope.albums = sharedAlbums.getAlbums();
    // console.log($scope.albums);

    // on view load, set first album as activated and get track names
    $scope.$on('$viewContentLoaded', function() {
      // set active album to first in array
      $scope.activated = $scope.albums[0];
      // run getTracks function on that album
      var id = $scope.activated.id;
      var name = $scope.activated.name;
      var getTracksOfFirst = function(id, name) {
        // console.log(id);
        // get spotify album id from item that was clicked
        var albumId = id;
        // send album name to view
        $scope.albumTitle = name;
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
      };
      getTracksOfFirst(id, name);
    });

    // set active album
    $scope.activate = function(item) {
      console.log(item);
      $scope.activated = item;
    };
    $scope.isActive = function(item) {
      return $scope.activated === item;
     };

    // find if bronze silver or gold level selected
    $scope.value = 'Bronze';
    $scope.newValue = function(value) {
      $scope.level = value;
      console.log($scope.level);
    };

    // on click of image, get tracks from spotify api
    $scope.getTracks = function(item) {
      // console.log(item.id);
      // get spotify album id from item that was clicked
      var albumId = item.id;
      // send album name to view
      $scope.albumTitle = item.name;
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
      $scope.trackArtist = removeAccents.removeDiacritics(this.track.artists[0].name);
      $scope.trackName = this.track.name;
      // $scope.trackName = sharedTrackName.setTrackName(trackName);
      console.log($scope.trackArtist, $scope.trackName);
      // send trackArtist and trackName into musixmatch api to get lyrics
      $http.post('/api/lyrics', {artist: $scope.trackArtist, track: $scope.trackName})
        .success(function(response) {
          // console.log(response);
          // get track uri numbers for spotify play button
          $scope.trackUri = response.match(/:[^:]*$/g);
          // console.log("here", $scope.trackUri);
          // remove the ** words **
          response = response.replace(/\*[^\/]+$/g, ' ');
          // make lyrics into array, using spaces, commas, brackets and line breaks
          var responseArray = response.replace( /\n/g, " " ).split(/[ ,().!]+/);
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
          // console.log($scope.numberOfBlanks);

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
          $scope.stringLyrics = $sce.trustAsHtml("<p>" + responseArray.join(" ") + "</p>");
          // $scope.stringLyrics = $sce.trustAsHtml("<a ng-click='someFunction()' href=''>Google</a>");
          console.log($scope.stringLyrics);

          // $scope.someFunction = function() {
          //   console.log("OMG");
          // };
          // send to directive

          
          // replace the line breaks with <br>
          // var stringLyricsBreak = stringLyrics.replace(/\n/g, '<br>'); 
          
          // $scope.lyrics = stringLyrics.html($compile(stringLyrics));
          // $scope.$apply();

          // show play button
          $scope.showButton = true;
        })
        .error(function(error) {
          console.log("The error with the /api/lyrics call is: ", error);
        });
    }; // end of getLyrics function
    


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
    }; // end of checkUnique function

    // checkApostrophe function 
    var checkApostrophe = function(indexArray, randomNumber, lyricsArray) {
      // if word not blank or ... and no apostrophe in the word
      if (lyricsArray[randomNumber] !== " " && lyricsArray[randomNumber] !== "" && lyricsArray[randomNumber] !== "..." && lyricsArray[randomNumber].indexOf('\'') <= 0) {
        // then replace word with input, with data-id same as word
        var inputField = "<input type='text' ng-blur='checkLyrics($event)' class='lyricsInputs' data-id='" + lyricsArray[randomNumber] + "'>";
        lyricsArray[randomNumber] = lyricsArray[randomNumber].replace(lyricsArray[randomNumber], inputField);
        // and push that number into number array
        indexArray.push(randomNumber);
      }
      else {
        return;
      }
    }; // end of checkApostrophe function

    var count = 0;
    // check lyrics when user presses play button
    $scope.checkLyrics = function(event) {
      // console.log("run", event);
      // for each element, if correct show green box and increase count
      if (event.currentTarget.attributes[3].value.trim().toLowerCase() == event.currentTarget.value.trim().toLowerCase()) {
        event.currentTarget.style.borderColor = "green";
        count ++;
      }
      else {
       event.currentTarget.style.borderColor = "red"; 
      }
    };
    console.log(count);

    $scope.checkCount = function() {
      console.log($scope.numberOfBlanks);
      console.log(count);
      if (count === $scope.numberOfBlanks) {

        // create song
        // find current user
        $http.get('/api/me')
          .then(function (data) {
            if (!!data.data) {
              $scope.currentUser = data.data;
              $scope.currentUserId = $scope.currentUser._id;
              // if current user exists, run createSong function and send in user id
              createSong();
            }
          }); 
        
        // modal
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
      }
    }; // end of checkCount function


    // createSong function to be run if currentUser exists
    var createSong = function() {
      // if not silver or gold, assume bronze
      if ($scope.level === undefined) {
        $scope.level = "Bronze";
      }
      // post request to create new song
      $http.post('/api/songs', { userId: $scope.currentUserId, artist: $scope.trackArtist, track: $scope.trackName, level: $scope.level })
        .then(function(response) {
          // console.log(response);
        });
      };
    
  }]); 
    // ORIGINAL CHECK LYRICS FUNCTION - WORKS FROM PLAY BUTTON
   //  // check lyrics when user presses play button
   //  $scope.checkLyrics = function() {
   //    // find lyricsInputs class and check whether inputs == data-id
   //    var elements = $element.find('.lyricsInputs');
   //    // console.log(elements);
   //    // for each element, if correct show green box and increase count
   //    var count = 0;
   //    for (var k = 0; k < elements.length; k++) {
   //      // console.log("data-id: ", elements[k].dataset.id, "value: ", elements[k].value);
   //      if (elements[k].dataset.id.trim().toLowerCase() == elements[k].value.trim().toLowerCase()) {
   //        elements[k].style.borderColor = "green";
   //        count ++;
   //        // console.log(count);
   //        // console.log($scope.numberOfBlanks);
   //        if (count === $scope.numberOfBlanks) {
            
   //          // create song
   //          // find current user
   //          $http.get('/api/me')
   //            .then(function (data) {
   //              if (!!data.data) {
   //                $scope.currentUser = data.data;
   //                $scope.currentUserId = $scope.currentUser._id;
   //                // if current user exists, run createSong function and send in user id
   //                createSong();
   //              }
   //            }); 
            
   //          // modal
   //          $scope.items = [$scope.trackName, $scope.level, $scope.trackUri[0]];

   //          $scope.animationsEnabled = true;

   //          $scope.open = function (size) {
   //            var modalInstance = $uibModal.open({
   //            animation: $scope.animationsEnabled,
   //            templateUrl: 'myModalContent.html',
   //            controller: 'ModalInstanceCtrl',
   //            size: size,
   //            resolve: {
   //              items: function () {
   //                return $scope.items;
   //              }
   //            }
   //          });

   //            modalInstance.result.then(function (selectedItem) {
   //              $scope.selected = selectedItem;
   //            }, function () {
   //              $log.info('Modal dismissed at: ' + new Date());
   //            });
   //          };

   //          // console.log("uri: ", $scope.trackUri);
   //          // $scope.player = "<iframe src='https://embed.spotify.com/?uri=spotify:track" + $scope.trackUri[0] + "' width='300' height='380' frameborder='0' allowtransparency='true'></iframe>";
   //          // $('#spotifyPlay').html($scope.player);
   //        }
   //      }
   //      else {
   //       elements[k].style.borderColor = "red"; 
   //      }
   //    }
  	// }; // end of checkLyrics function