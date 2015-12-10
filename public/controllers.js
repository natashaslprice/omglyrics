/*
 * CONTROLLERS
 */

'use strict';

angular.module('myApp.controllers', [])
  .controller('MainCtrl', ['$rootScope', '$scope', '$location', function ($rootScope, $scope, $location) {
    // INITIALIZATION AND NAVBAR LOGIC
  }])

  // SONG SEARCH
  .controller('LandingIndexCtrl', ['$scope', '$http', '$window', '$element', '$location', 'uniqueFilter', 'ArtistApi', function ($scope, $http, $window, $element, $location, uniqueFilter, ArtistApi) {
    // function to search for books based on songs on submission of song-search form, get lyrics and post to page
    $scope.searchForm = function(data) {
      var artist = data.trim();
      // send artist into spotify api and get artist id
      
    };
  }]) // end of searchForm function

  .controller('SongsIndexCtrl', ['$scope', '$http','$window', '$element', '$location', 'ArtistApi', function ($scope, $http, $window, $element, $location, ArtistApi) { 
    $scope.bye = "bye";
  }]);

        //   // get track uri numbers
        //   $scope.trackUri = response.match(/:[^:]*$/g);
        //   console.log("here", $scope.trackUri);
          
        //   // make lyrics into array
        //   var responseArray = response.split(/[\s,]/g);
        //   var newResponseArray = [];
        //   // get first 50 words of lyrics response
        //   for (var i = 0; i < 50; i++) {
        //     newResponseArray.push(responseArray[i]);
        //   }

        //   // get 5 random unique numbers to use as indexes of words to remove from array
        //   var wordIndexes = [];
        //   while (wordIndexes.length < 5) {
        //     var randomNumber = Math.floor((Math.random() * 50) + 1);
        //     var found = false;
        //     for (var j = 0; j < wordIndexes.length; j ++) {
        //       if (randomNumber === wordIndexes[j]) {
        //         found = true;
        //         return;
        //       }
        //     }
        //     if (!found) {
        //       wordIndexes.push(randomNumber);
        //     }
        //   }
        //   wordIndexes.sort(function(a, b){
        //     return a-b;
        //   });
        //   // console.log(wordIndexes);
                
        //   // get the 5 words with the wordIndexes from the newResponseArray
        //   var wordsToRemove = [];
        //   var index;
        //   for (var k = 0; k < wordIndexes.length; k++) {
        //     index = wordIndexes[k];
        //     // console.log(index);
        //     // push the words into an array to store
        //     wordsToRemove.push(newResponseArray[index]);
        //     // replace the word with inputField
        //     var inputField = "<input type='text' class='lyricsInputs' data-id='" + wordsToRemove[k] + "'>";
        //     newResponseArray[index] = newResponseArray[index].replace(newResponseArray[index], inputField);
        //   }
        //   // console.log(wordsToRemove);
        //   // console.log(newResponseArray);
                
        //   // make array a string again
        //   var stringLyrics = newResponseArray.join(" ");
        //   console.log(stringLyrics);
                
        //   // replace the line breaks with <br>
        //   // var stringLyricsBreak = stringLyrics.replace(/\n/g, '<br>'); 
        //   $('#lyrics').html(stringLyrics);
        //   // $scope.lyrics = stringLyrics;
        // })
        // .error(function(error) {
        //   console.log("error in controller is: ", error);
        
          

      // send song.artist name into spotify api
    //   $http.post('/api/artists/songs', { song: $scope.formArtist })
    //     .success(function(response) {
    //       // console.log("success post: ", response.match(/:[^:]*$/g));
    //       // get track uri numbers
    //       $scope.trackUri = response.match(/:[^:]*$/g);
    //       console.log("here", $scope.trackUri[0]);
    //       // make lyrics into array
    //       var responseArray = response.split(/[\s,]/g);
    //       var newResponseArray = [];
    //       // get first 50 words of lyrics response
    //       for (var i = 0; i < 50; i++) {
    //         newResponseArray.push(responseArray[i]);
    //       }

    //       // get 5 random numbers to use as indexes of words to remove from array
    //       var wordIndexes = [];
    //       while (wordIndexes.length < 5) {
    //         var randomNumber = Math.floor((Math.random() * 50) + 1);
    //         var found = false;
    //         for (var j = 0; j < wordIndexes.length; j ++) {
    //           if (randomNumber === wordIndexes[j]) {
    //             found = true;
    //             return;
    //           }
    //         }
    //         if (!found) {
    //           wordIndexes.push(randomNumber);
    //         }
    //       }
    //       wordIndexes.sort(function(a, b){
    //         return a-b;
    //       });
    //       // console.log(wordIndexes);
          
    //       // get the 5 words with the wordIndexes from the newResponseArray
    //       var wordsToRemove = [];
    //       var index;
    //       for (var k = 0; k < wordIndexes.length; k++) {
    //         index = wordIndexes[k];
    //         // console.log(index);
    //         // push the words into an array to store
    //         wordsToRemove.push(newResponseArray[index]);
    //         // replace the word with inputField
    //         var inputField = "<input type='text' class='lyricsInputs' data-id='" + wordsToRemove[k] + "'>";
    //         newResponseArray[index] = newResponseArray[index].replace(newResponseArray[index], inputField);
    //       }
    //       // console.log(wordsToRemove);
    //       // console.log(newResponseArray);
          
    //       // make array a string again
    //       var stringLyrics = newResponseArray.join(" ");
    //       console.log(stringLyrics);
          
    //       // replace the line breaks with <br>
    //       // var stringLyricsBreak = stringLyrics.replace(/\n/g, '<br>'); 
    //       $('#lyrics').html(stringLyrics);
    //       // $scope.lyrics = stringLyrics;
    //     })
    //     .error(function(error) {
    //       console.log("error in controller is: ", error);
    //     });
    // }; // end of searchByArtist function

    // // function to search by track
    // $scope.searchBySong = function(data) {
    //   $scope.formSong = data.name;
      
    // }; // end of searhBySong function


    // check lyrics when user presses play button
  //   $scope.checkLyrics = function() {
  //     // find lyricsInputs class and check whether inputs == data-id
  //     var elements = $element.find('.lyricsInputs');
  //     // console.log(elements);
  //     // for each element, if correct show green box and increase count
  //     var count = 0;
  //     for (var m = 0; m < elements.length; m++) {
  //       // console.log("data-id: ", elements[m].dataset.id, "value: ", elements[m].value);
  //       if (elements[m].dataset.id == elements[m].value) {
  //         elements[m].style.borderColor = "green";
  //         count ++;
  //         if (count === 5) {
  //           // console.log("uri: ", $scope.trackUri);
  //           $scope.player = "<iframe src='https://embed.spotify.com/?uri=spotify:track" + $scope.trackUri[0] + "' width='300' height='380' frameborder='0' allowtransparency='true'></iframe>";
  //           $('#spotifyPlay').html($scope.player);
  //         }
  //       }
  //       else {
  //        elements[m].style.borderColor = "red"; 
  //       }
  //     }

  // };
