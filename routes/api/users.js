var mongoose = require('mongoose')
var router = require('express').Router()
var passport = require('passport')
var multer = require('multer')
var uuid = require('uuid')
var User = mongoose.model('User')
var auth = require('../auth')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/')
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-')
    cb(null, uuid.v4().toString() + '_' + fileName)
  }
})

var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
    }
  }
})

router.get('/user', auth.required, function (req, res, next) {
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401)
      }

      return res.json({ user: user.toAuthJSON() })
    })
    .catch(next)
})

router.put('/user', auth.required, upload.single('image'), function (req, res, next) {
  
  User.findById(req.payload.id)
    .then(function (user) {
      if (!user) {
        return res.sendStatus(401)
      }
      if(req.body.signal) {     //just to remove profile image
        user.image=''
      }
      if (req.body.user && req.body.user.username) {
        user.username = req.body.user.username
      }
      if (req.body.user &&req.body.user.fullname) {
        user.fullname = req.body.user.fullname
      }
      if (req.body.user &&req.body.user.email) {
        user.email = req.body.user.email
      }
      if (req.body.user &&req.body.user.bio) {
        user.bio = req.body.user.bio
      }
      if (req.file) {
        user.image = req.file.filename
      }
      if (req.body.user && req.body.user.password) {
        user.setPassword(req.body.user.password)
      }

      return user.save().then(function () {
        return res.json({ user: user.toAuthJSON() })
      })
    })
    .catch(next)
})

router.post('/users/login', function (req, res, next) {
  if (!req.body.user.email) {
    return res.status(422).json({ errors: { email: "can't be blank" } })
  }

  if (!req.body.user.password) {
    return res.status(422).json({ errors: { password: "can't be blank" } })
  }

  passport.authenticate('local', { session: false }, function (
    err,
    user,
    info
  ) {
    if (err) {
      return next(err)
    }

    if (user) {
      user.token = user.generateJWT()
      return res.json({ user: user.toAuthJSON() })
    } else {
      return res.status(422).json(info)
    }
  })(req, res, next)
})

router.post('/users', function (req, res, next) {
  var user = new User()

  user.username = req.body.user.username
  user.email = req.body.user.email
  user.fullname = req.body.user.fullname
  user.setPassword(req.body.user.password)

  user
    .save()
    .then(function () {
      return res.json({ user: user.toAuthJSON() })
    })
    .catch(next)
})

module.exports = router
