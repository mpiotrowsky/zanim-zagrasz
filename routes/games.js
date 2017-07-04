var express = require("express");
var router  = express.Router();
var Game = require("../models/game");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX - show all games
router.get("/", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all games from DB
      Game.find({name: regex}, function(err, allGames){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(allGames);
         }
      });
  } else {
      // Get all games from DB
      Game.find({}, function(err, allGames){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(allGames);
            } else {
              res.render("games/index",{games: allGames, page: 'games'});
            }
         }
      });
  }
});

//CREATE - add new game to DB
router.post("/", middleware.isLoggedIn, function(req, res){
  // get data from form and add to games array
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author = {
      id: req.user._id,
      username: req.user.username
  };
    var newGame = {name: name, image: image, description: desc, author:author};
    // Create a new game and save to DB
    Game.create(newGame, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to games page
            console.log(newlyCreated);
            res.redirect("/games");
        }
    });
  });

//NEW - show form to create new game
router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("games/new"); 
});

// SHOW - shows more info about one game
router.get("/:id", function(req, res){
    //find the game with provided ID
    Game.findById(req.params.id).populate("comments").exec(function(err, foundGame){
        if(err){
          console.log(err);
        } else {
          console.log(foundGame);
          //render show template with that game
          res.render("games/show", {game: foundGame});
        }
    });
});

router.get("/:id/edit", middleware.checkUserGame, function(req, res){
    //find the game with provided ID
    Game.findById(req.params.id, function(err, foundGame){
        if(err){
            console.log(err);
        } else {
            //render show template with that game
            res.render("games/edit", {game: foundGame});
        }
    });
});

router.put("/:id", function(req, res){

    var newData = {name: req.body.name, image: req.body.image, description: req.body.description};
    Game.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, game){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Zaktualizowano!");
            res.redirect("/games/" + game._id);
        }
    });
  });

router.delete("/:id", function(req, res) {
  Game.findByIdAndRemove(req.params.id, function(err, game) {
    Comment.remove({
      _id: {
        $in: game.comments
      }
    }, function(err, comments) {
      req.flash('error', game.name + ' skasowano!');
      res.redirect('/games');
    });
  });
});

module.exports = router;

