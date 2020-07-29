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
    return res.json({ 'HEro': 'HRo' });
    User.findById(req.payload.id)
        .then(function (user) {
            if (!user)
                return res.sendStatus(401);
            return User.findOne({ username }).then(function (userM) {

            })
        })

})
router.get('/listUsers', auth.required, function (req, res, next) {

})
module.exports = router;