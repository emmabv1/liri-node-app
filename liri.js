require("dotenv").config();

var Twitter = require('twitter');

var Spotify = require('node-spotify-api');

var request = require('request');

var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);

var client = new Twitter(keys.twitter);

var command = process.argv[2];

var fs = require("fs");

if (command === "my-tweets") {
    var params = {screen_name: "EmmabvtEmma"};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        //console.log(tweets);
        for (i=0; i<20; i++) {
            console.log(tweets[i].created_at + " " + tweets[i].text); 
        }
  }
});
}

else if (command === "spotify-this-song") {
    var songName = process.argv.slice(3).join("+");

    if (songName === "") {
        spotify.search({ type: 'track', query: "we didnt start the fire" }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
    
        console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name); 
        console.log("Song Link: " + data.tracks.items[0].external_urls.spotify);
        });
    }

    else {
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name); 
        console.log("Song Link: " + data.tracks.items[0].external_urls.spotify);
      });
    }
}

else if (command === "movie-this") {
    var movieName = process.argv.slice(3).join("+");

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            var rotten = JSON.parse(body).Ratings.filter(val => val.Source = "Rotten Tomatoes")[1].Value;
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Score: " + rotten)
            console.log("Production Country: " + JSON.parse(body).Country);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });

}

else if (command === "do-what-it-says") {
    fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(err);
            return false;
        }
    
        var stuff = data.split(",");
    
        command = stuff[0];

        songName = stuff[1];

        spotify.search({ type: 'track', query: songName }, function(err, data) {
            if (err) {
              return console.log('Error occurred: ' + err);
            }
    
            console.log("Artist(s): " + data.tracks.items[0].artists[0].name);
            console.log("Song Name: " + data.tracks.items[0].name);
            console.log("Album: " + data.tracks.items[0].album.name); 
            console.log("Song Link: " + data.tracks.items[0].external_urls.spotify);
          });
    });
}

