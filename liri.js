require("dotenv").config();

var keys = require("./keys.js");
var fs= require ("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");


var spotify = new Spotify(keys.spotify);
var defaultSong = "The Sign";
var twitter = new Twitter(keys.twitter);

var nodeArg2= process.argv[2];
var nodeArg3= process.argv[3];

if(nodeArg2==="my-tweets"){
   //pull twitter API
   tweets();
}else if(nodeArg2==="spotify-this-song"){
    //pull spotify API
    spotifySong(nodeArg3);
}else if(nodeArg2==="movie-this"){
    //pull OMDB API
     movieThis(nodeArg3);
}else if(nodeArg2==="do-what-it-say"){
    //pull random.txt
    doWhatItSays();
};

function tweets(){
    var params = {screen_name: "abrahamTesla",count:20};
    twitter.get('statuses/user_timeline',params,function(err,tweets,response){
         if(err){
             console.log(err);
         }else{
            for(var i=0;i<tweets.length;i++){
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
            }
    
         };
    });

};
function spotifySong(songName){
    // var params ={}
    if(songName!==undefined){
    spotify.search({type: "track", query:songName,limit:1},function(err,data){
         if(err){
             console.log(err);
         }else{
                console.log(data.tracks.items[0].artists[0].name);
                console.log(data.tracks.items[0].name);
                console.log(data.tracks.items[0].preview_url);
                console.log(data.tracks.items[0].album.name);
         };
    });
  }else{
    spotify.search({type: "track", query:"The Sign by Ace of Base",limit:1},function(err,data){
        if(err){
            console.log(err);
        }else{
            console.log(data.tracks.items[0].artists[0].name);
            console.log(data.tracks.items[0].name);
            console.log(data.tracks.items[0].preview_url);
            console.log(data.tracks.items[0].album.name);
        };
    });
};
};

function movieThis (nodeArg3){
    var aKey = "aede9dbb";
    
    var queryUrl = "http://www.omdbapi.com/?t="+nodeArg3+"&y=&plot=short&apikey="+aKey;
    
    console.log(queryUrl);

    request(queryUrl,function(err, response, body){
         if(!err && response.statusCode===200){
            var jParse = JSON.parse(body);
            console.log("Title: "+ jParse.Title);
            console.log("Year: "+ jParse.Year);
            console.log("IMDB Rating: "+ jParse.imdbRating);
            console.log("Country Produced: "+ jParse.Country);
            console.log("Movie Language: "+ jParse.Language);
            
            for (var i=0;i<jParse.Ratings.length;i++){
                if(jParse.Ratings[i].Source ==="Rotten Tomatoes"){
                    console.log("Rotten Tomatoes: " + jParse.Ratings[i].Value);
                }
            }
            // console.log("Rotten Tomatoes: "+ jParse.Ratings[1].Value);
            console.log("Plot: "+ jParse.Plot);
            console.log("Actors: "+ jParse.Actors);
        } 
    });
};
function doWhatItSays(){
    fs.readFile("random.txt","utf8",function(err,data){
      if(err){
          return console.log(err);
      }else{
                dataArray = data.split(",");
                var node2=dataArray[0];
                var node3=dataArray[1];
                if(node2==="spotify-this-song"){
                    spotifySong(node3);
                }

      }
    });
};