var express = require("express");
var router  = express.Router({mergeParams: true});
var Game = require("../models/game");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
    // find game by id
    console.log(req.params.id);
    Game.findById(req.params.id, function(err, game){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new", {game: game});
        }
    })
});

//Comments Create
router.post("/",middleware.isLoggedIn,function(req, res){
   //lookup game using ID
   Game.findById(req.params.id, function(err, game){
       if(err){
           console.log(err);
           res.redirect("/games");
       } else {
        Comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               comment.author.id = req.user._id;
               comment.author.username = req.user.username;
               //save comment
               comment.save();
               game.comments.push(comment);
               game.save();
               console.log(comment);
               req.flash('success', 'Komentarz utworzony!');
               res.redirect('/games/' + game._id);
           }
        });
       }
   });
});

router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
    // find game by id
    Comment.findById(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
             res.render("comments/edit", {game_id: req.params.id, comment: comment});
        }
    })
});

router.put("/:commentId", function(req, res){
   Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
       if(err){
          console.log(err);
           res.render("edit");
       } else {
           res.redirect("/games/" + req.params.id);
       }
   }); 
});

router.delete("/:commentId",middleware.checkUserComment, function(req, res){
    Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
        if(err){
            console.log(err);
        } else {
            Game.findByIdAndUpdate(req.params.id, {
              $pull: {
                comments: comment.id
              }
            }, function(err) {
              if(err){ 
                console.log(err)
              } else {
                req.flash('error', 'Komentarz skasowany!');
                res.redirect("/games/" + req.params.id);
              }
            });
        }
    });
});

module.exports = router;