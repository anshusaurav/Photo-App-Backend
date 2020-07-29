var router = require("express").Router();
var mongoose = require("mongoose");
var User = mongoose.model("User");
var ImagePost = mongoose.model("ImagePost")
var Message = mongoose.model("Message")
var auth = require("../auth");
router.post("/:username/:slug", auth.required, function (req, res, next) {
    var { username, slug } = req.params;
    console.log(username, slug);
    // return res.json({ 'HEro': 'HRo' });
    User.findById(req.payload.id)
        .then(function (user) {
            if (!user)
                return res.sendStatus(401);
            return User.findOne({ username }).then(function (userM) {
                return user.communicate(userM.id).then(function () {
                    return userM.communicate(user.id).then(function () {
                        return ImagePost.findOne({ slug }).then(function (imagepost) {

                            var message = new Message({ post: imagepost, sender: user, receiver: userM });
                            return message.save().then(function () {
                                return res.json({ message: message.toJSONFor(user) })
                            })
                        })
                    })
                })
            })
        })

})
router.get('/listUsers', auth.required, function (req, res, next) {
    const id = req.payload.id;
    Message.find().or([{ sender: id }, { receiver: id }])
        .distinct("sender")
        .distinct("receiver")
        .then(function (messages) {
            console.log(messages);
            // const set = new Set(ids);
            return res.json({ messages: messages })
        })

})
module.exports = router;