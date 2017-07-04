var mongoose = require("mongoose");
var Game = require("./models/game");
var Comment   = require("./models/comment");

var data = [
    {
        name: "The Elder Scrolls III: Morrowind", 
        image: "http://imgur.com/xamYBYi.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "The Elder Scrolls IV: Oblivion", 
        image: "http://imgur.com/XOc0TKh.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        name: "The Elder Scrolls V: Skyrim", 
        image: "http://imgur.com/AGRXbat.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]

function seedDB(){
   //Remove all games
   Game.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Usunięto grę");
         //add a few games
        data.forEach(function(seed){
            Game.create(seed, function(err, game){
                if(err){
                    console.log(err)
                } else {
                    console.log("Dodano grę");
                    //create a comment
                    Comment.create(
                        {
                            text: "Rush B",
                            author: "Russian guy"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                game.comments.push(comment);
                                game.save();
                                console.log("Utworzono nowy komentarz");
                            }
                        });
                }
            });
        });
    }); 
}

module.exports = seedDB;
