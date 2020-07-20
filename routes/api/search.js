var router = require('express').Router();
var mongoose = require('mongoose');
var ImagePost = mongoose.model('ImagePost');
var User = mongoose.model('User');

// return a list of tags

router.post('/', async(req, res, next) =>{
    var query = req.body.searchQuery;
    console.log(query);
    User.find(
        { $text : { $search : query } }, 
        { score : { $meta: "textScore" } }
    )
    .sort({ score : { $meta : 'textScore' } })
    .exec(function(err, users) {
        console.log(users);
        return res.json({users: users.map(function(user){
            return user.toJSONFor(user)
        }),
        userCount: users.length
        })
    });
        
    
});


module.exports = router;
