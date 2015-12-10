angular.module('myApp').service('sharedAlbums', function() {
  return {
  	getAlbums: function() {
  		return albums;
  	},
  	setAlbums: function(value) {
  		albums = value;
  	}
  };
});
