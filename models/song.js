/*
 * SONG MODEL
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SongSchema = new Schema({
    created_at: { type: Date, default: Date.now() },
    artist: { type: String, requried: true },
    title: { type: String, required: true },
    level: { type: String }
});

// MIDDLEWARE
// included because Mongoose doesn't do created at and udpated at automatically
SongSchema.pre('save', function(next){
  // set a created_at and update updated_at
  now = new Date();
  this.updated_at = now;
  if ( !this.created_at ) {
    this.created_at = now;
  }
  next();
});

// export post model
var Song = mongoose.model('Song', SongSchema);

module.exports = Song;
