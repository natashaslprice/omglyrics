 /*
 * MODAL INSTANCE CONTROLLER
 */

'use strict';

angular.module('myApp')
.controller('ModalInstanceCtrl', ['$scope', '$uibModalInstance', 'items', '$sce', function ($scope, $uibModalInstance, items, $sce) {
  console.log("ModalInstanceCtrl active");
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
}]);

  



