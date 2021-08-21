require('dotenv').config();


const express = require("express");
const hbs = require('hbs');


// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

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
app.get("/", (req, res) => {
    res.render("home")
});
app.get("/artist-search", (req, res) => {

    spotifyApi
        .searchArtists(req.query.artist)
        .then((data) => {
            //console.log('The received data from the API: ', data.body);
            //console.log("artist structure", data.body.artists.items[0])
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search-results", { artists: data.body.artists.items })

        })
        .catch(err => console.log('The error while searching artists occurred: ', err));

});

app.get("/albums/:artist_id", (req, res) => {

    spotifyApi
        .getArtistAlbums(req.params.artist_id)
        .then((data) => {
            //console.log("receive:", data.body)
            res.render("albums", { albums: data.body.items })
        })
        .catch((err) =>
            console.log("The error while getting the albums of the artist ocurred: ", err))
});

app.get("/tracks/:album_id", (req, res) => {

    spotifyApi.getAlbumTracks(req.params.album_id)
        .then((data) => {
            console.log("receive:", data.body)
            res.render("tracks", { tracks: data.body.items })
        })
        .catch((err) =>
            console.log("The error while getting the albums of the artist ocurred: ", err))
});


app.listen(3700, () => console.log('My Spotify project running on port 3700 🎧 🥁 🎸 🔊'));