var Comment = require("../models/comment");
var Game = require("../models/game");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "Musisz być zalogowany!");
        res.redirect("/login");
    },
    checkUserGame: function(req, res, next){
        if(req.isAuthenticated()){
            Game.findById(req.params.id, function(err, game){
               if(game.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "Nie masz do tego pozwolenia!");
                   console.log("Źle!");
                   res.redirect("/games/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "Musisz być zalogowany!");
            res.redirect("/login");
        }
    },
    checkUserComment: function(req, res, next){
        console.log("Udało się!");
        if(req.isAuthenticated()){
            Comment.findById(req.params.commentId, function(err, comment){
               if(comment.author.id.equals(req.user._id)){
                   next();
               } else {
                   req.flash("error", "Nie masz do tego pozwolenia!");
                   res.redirect("/games/" + req.params.id);
               }
            });
        } else {
            req.flash("error", "Musisz być zalogowany!");
            res.redirect("login");
        }
    }
}