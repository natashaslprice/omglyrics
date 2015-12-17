  var express = require('express');
var request = require('request');
require('dotenv').load();
var Song = require('../models/song.js');
var User = require('../models/user.js');

// require API key
var MM_API_KEY = process.env.MUSIXMATCH_API_KEY;

module.exports = function(app) {

  // receive data from artist search form on client side
  app.post('/api/artists', function(req, res) {
    var artist = req.body.artist;
    // console.log("artist: ", artist);
    
    // GET ARTIST ID
    // set query for spotify api
    var artistQuery = "https://api.spotify.com/v1/search?q=" + artist + "&type=artist";
    // request artist data from spotify api
    request(artistQuery, function(err, response, body){
      if (!err && response.statusCode == 200) {
        var data = JSON.parse(body);
        // console.log("number:", data.artists.total);
        // check that artists exist
        var numberOfArtists = data.artists.total;
        if (numberOfArtists === 0) {
          console.log("error in artists api: no artists found");
          return res.status(401).send("error");
        }
        // get spotify id
        var artistId = data.artists.items[0].id;
        // console.log("id: ", artistId);
        
        // GET ARTIST ALBUMS
          var albumsQuery = "https://api.spotify.com/v1/artists/" + artistId + "/albums";
          request(albumsQuery, function(err, response, body){
            if (!err && response.statusCode == 200) {
              // get artists albums
              var data = JSON.parse(body);
              // console.log(data.items[0]);
              var albums = data.items;
              res.send(albums);
            }
            else {
              console.log("error in albums api: " + err);
            }
          });
        }
      else {
        console.log("error in artists api: " + err);
        return res.status(401).send({ message: err.message });
      }
    });
  });

  // receive album id from client side
  app.post('/api/tracks', function(req, res) {
    var albumId = req.body.id;
    // console.log("here", albumId);

    // GET TRACKS FROM ALBUMS
    //set query for spotify api
    var tracksQuery = "https://api.spotify.com/v1/albums/" + albumId + "/tracks";
    // request track data
    request(tracksQuery, function(err, response, body){
      if (!err && response.statusCode == 200) {
        // get tracks
        var data = JSON.parse(body);
        // console.log(data.items);
        var tracks = data.items;
        res.send(tracks);
      }
      else {
        console.log("error in tracks api: " + err);
      }
    });
  });

  app.post('/api/lyrics', function(req, res) {
    var artist = req.body.artist;
    var track = req.body.track;
    // console.log("form: ", artist, track);

    // send artist and track name into lyric api to get track id
    var trackIdQuery = "http://api.musixmatch.com/ws/1.1/matcher.track.get?apikey=" + MM_API_KEY + "&q_track=" + track + "&q_artist=" + artist + "&f_has_lyrics=1";
    request(trackIdQuery, function(err, response, body) {
      if (!err && response.statusCode == 200) {
        var trackData = JSON.parse(body);
        // console.log(trackData.message.body.track);
        // get musix track id
        var trackId = trackData.message.body.track.track_id;
        // getspotify track uri (to use spotify play button)
        var trackUri = ":" + trackData.message.body.track.track_spotify_id;
        // console.log("response: ", trackId, trackUri);

        // send trackId into lyrics api to get lyrics
        var trackLyricQuery = "http://api.musixmatch.com/ws/1.1/track.lyrics.get?apikey=" + MM_API_KEY + "&track_id=" + trackId;
        request(trackLyricQuery, function(err, response, body) {
          if (!err && response.statusCode == 200) {
            var trackLyricsData = JSON.parse(body);
            // console.log("lyrics: ", trackLyricsData.message.body.lyrics.lyrics_body);
            res.write(trackLyricsData.message.body.lyrics.lyrics_body);
            res.write(trackUri);
            res.end();
          }
          else {
            console.log("error in lyrics api: " + err);
          } 
        });
      }
      else {
        console.log("error in trackdata api: " + err);
      }
    });
  });

  app.post('/api/songs', function(req, res) {
    User.findById(req.body.userId, function(err, user) {
      var artist = req.body.artist;
      var title = req.body.track;
      var level = req.body.level;
      if (!user) {
        return res.status(400).send({ message: 'User not found' });
      }
      else {
        // console.log("user is: ", user);
        // console.log(req.body);
        var song = new Song({
            artist: artist, 
            title: title,
            level: level
        });

        

        song.save(function(err) {
          console.log("level: ", level);
          if (err) { 
            console.log("here", err);
            return res.status(400).send({err: err});
          }
          if (level === 'Bronze') {
            // check song doesn't exist in user already
            if (user.songsBronze.length > 0) {
              for (var i = 0; i < user.songsBronze.length; i++) {
                if (song.title == user.songsBronze[i].title) {
                  return;
                }
              }
            }
            user.songsBronze.push(song);
          }
          if (level === 'Silver') {
            // check song doesn't exist in user already
            if (user.songsSilver.length > 0) {
              for (var j = 0; j < user.songsSilver.length; j++) {
                if (song.title == user.songsSilver[j].title) {
                  return;
                }
              }
            }
            user.songsSilver.push(song);
          }
          else if (level === 'Gold') {
            // check song doesn't exist in user already
            if (user.songsGold.length > 0) {
              for (var k = 0; k < user.songsGold.length; k++) {
                if (song.title == user.songsGold[k].title) {
                  return;
                }
              }
            }
            user.songsGold.push(song);
          }
          user.save(function(err) {
            if (err) {
              console.log("here", err);
              return res.status(400).send({err: err});
            }
          });
          res.send(user);
        });
      }
    });

  });

};