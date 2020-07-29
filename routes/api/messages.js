var router = require("express").Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");
var ImagePost = mongoose.model("ImagePost")
var Message = mongoose.model("Message")
var auth = require("../auth");
router.post("/:username/:slug", auth.required, function (req, res, next) {
    var profileId = req.params.username;
    var slug = req.params.slug;
    console.log(username, slug);
    return res.json({ 'HEro': 'HRo' })

})

module.exports = router;