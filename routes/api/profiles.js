var router = require("express").Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");
var auth = require("../auth");

// Preload user profile on routes with ':username'
router.param("username", function (req, res, next, username) {
  User.findOne({ username: username })
    .then(function (user) {
      if (!user) {
        return res.sendStatus(404);
      }

      req.profile = user;

      return next();
    })
    .catch(next);
});

router.get("/:username", auth.optional, function (req, res, next) {
  if (req.payload) {
    User.findById(req.payload.id).then(function (user) {
      if (!user) {
        return res.json({ profile: req.profile.toProfileJSONFor(false) });
      }

      return res.json({ profile: req.profile.toProfileJSONFor(user) });
    });
  } else {
    return res.json({ profile: req.profile.toProfileJSONFor(false) });
  }
});

router.post("/:username/follow", auth.required, function (req, res, next) {
  var profileId = req.params.username;

  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }
      return User.findOne({ username: profileId }).then(function (userF) {
        return user.follow(userF.id).then(function () {
          return userF.getFollowed(user.id).then(function () {
            return res.json({ profile: req.profile.toProfileJSONFor(user) });
          });
        });
      });
    })
    .catch(next);
});

router.delete("/:username/follow", auth.required, function (req, res, next) {
  var profileId = req.params.username;

  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401);
      }

      return User.findOne({ username: profileId }).then(function (userF) {
        return user.unfollow(userF.id).then(function () {
          return userF.getUnfollowed(user.id).then(function () {
            return res.json({ profile: req.profile.toProfileJSONFor(user) });
          });
        });
      });
    })
    .catch(next);
});

module.exports = router;
