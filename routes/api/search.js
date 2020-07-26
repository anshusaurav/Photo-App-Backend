var router = require("express").Router();
var mongoose = require("mongoose");
var ImagePost = mongoose.model("ImagePost");
var User = mongoose.model("User");
var auth = require("../auth");
const { Router } = require("express");
// return a list of tags

router.post("/", auth.optional, async (req, res, next) => {
  var query = req.body.searchQuery;
  console.log("query: ", query);
  User.find({}, { score: { $meta: "textScore" } })
    .sort({ score: { $meta: "textScore" } })
    .exec(function (err, users) {
      ImagePost.find()
        .distinct("tagList")
        .then(function (tags) {
          const allTags = tags.reduce((acc, tagList) => {
            console.log(tagList);
            tagList = JSON.parse(tagList);
            // console.log(tagList, tagL);
            return acc.concat(tagList);
          }, []);
          const set = new Set(allTags);
          return res.json({
            users: users.map(function (user) {
              return user.toProfileJSONFor(false);
            }),
            userCount: users.length,
            tags: Array.from(set),
            tagsCount: Array.from(set).length,
          });
        });
    });
});

// router.post("/", auth.optional, async (req, res, next) => {
//   var query = req.body.searchQuery;
//   console.log("query: ", query);
//   User.find({}, { score: { $meta: "textScore" } })
//     .sort({ score: { $meta: "textScore" } })
//     .exec(function (err, users) {

//     });
// });

module.exports = router;
