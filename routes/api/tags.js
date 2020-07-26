var router = require("express").Router();
var mongoose = require("mongoose");
var ImagePost = mongoose.model("ImagePost");

// return a list of tags
router.get("/", function (req, res, next) {
  ImagePost.find()
    .distinct("tagList")
    .then(function (tags) {
      console.log(tags);
      const allTags = tags.reduce((acc, tagList) => {
        console.log(tagList);
        const tagL = tagList.split(/[\s,]+/);
        // console.log(tagList, tagL);
        return acc.concat(tagL);
      }, []);
      const set = new Set(allTags);

      return res.json({ tags: Array.from(set) });
    })
    .catch(next);
});

module.exports = router;
