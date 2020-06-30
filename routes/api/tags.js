var router = require('express').Router();
var mongoose = require('mongoose');
var ImagePost = mongoose.model('ImagePost');

// return a list of tags
router.get('/', function(req, res, next) {
  ImagePost.find().distinct('tagList').then(function(tags){
    return res.json({tags: tags});
  }).catch(next);
});

module.exports = router;
