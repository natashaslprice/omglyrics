var port = 3000;

module.exports = {
  port: port,
  db: 'mongodb://localhost/song-app',
  TOKEN_SECRET: process.env.TOKEN_SECRET
};