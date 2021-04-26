require('dotenv').config();

const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');



// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get('/', (req, res, next) => {
  res.render('home');
});
app.get('/artist-search', (req, res, next) => {
  const artist = req.query.artist;
  // console.log(`The artist is ${artist}`);

  spotifyApi
  .searchArtists(artist)
  .then(data => {
    // console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    const artistArray = data.body.artists.items;
    res.render('artist-search-results', { artists : artistArray });
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})
app.get('/albums/:artistId', (req, res, next) => {
  const artistId = req.params.artistId;
  // .getArtistAlbums() code goes here
  spotifyApi.getArtistAlbums(artistId)
  .then(data => {
    // console.log('Artist albums', data.body);
    const albums = data.body.items;
    res.render('albums', {albums});
  })
  .catch(err => console.log('The error while searching albums occureed: ', err));
});
app.get('/tracks/:albumId', (req, res, next) => {
  const albumId = req.params.albumId;

  spotifyApi.getAlbumTracks(albumId, { limit : 20, offset : 1 })
  .then(data => {
    // console.log('The tracks; ', data.body);
    const tracks = data.body.items;
    res.render('tracks', {tracks});
  })
  .catch(err => console.log('The error while searching tracks occureed: ', err));
});

app.listen(5000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
