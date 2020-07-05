var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
var crypto = require('crypto')
var jwt = require('jsonwebtoken')
var secret = require('../config').secret

var UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true
    },
    fullname: {
      type: String,
      required: [true, "can't be blank"]
    },
    bio: String,
    image: String,
    imageposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ImagePost' }],
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ImagePost' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    follower: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    hash: String,
    salt: String
  },
  { timestamps: true }
)

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' })

UserSchema.methods.validPassword = function (password) {
  var hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
  return this.hash === hash
}

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex')
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex')
}

UserSchema.methods.generateJWT = function () {
  var today = new Date()
  var exp = new Date(today)
  exp.setDate(today.getDate() + 60)

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000)
    },
    secret
  )
}

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    fullname: this.fullname,  
    token: this.generateJWT(),
    bio: this.bio,
    image: this.image
      ? `http://localhost:4000/${this.image}`
      : 'https://cdn4.iconfinder.com/data/icons/emoticons-4/100/smiley-11-512.png',
    numFollowing: this.following.length,
    numFollowers: this.follower.length,
    numPosts: this.imageposts.length
  }
}

UserSchema.methods.toProfileJSONFor = function (user) {
  // console.log()
  return {
    username: this.username,
    fullname: this.fullname,
    bio: this.bio,
    image: this.image
      ? `http://localhost:4000/${this.image}`
      : 'https://cdn4.iconfinder.com/data/icons/emoticons-4/100/smiley-11-512.png',
    following: user ? user.isFollowing(this._id) : false
  }
}
UserSchema.methods.addImagePost = function (id) {
  if (this.imageposts.indexOf(id) === -1) {
    this.imageposts = this.imageposts.concat([id])
  }

  return this.save()
}

UserSchema.methods.removeImagePost = function (id) {
  this.imageposts.remove(id)
  return this.save()
}

UserSchema.methods.favorite = function (id) {
  if (this.favorites.indexOf(id) === -1) {
    this.favorites = this.favorites.concat([id])
  }

  return this.save()
}

UserSchema.methods.unfavorite = function (id) {
  this.favorites.remove(id)
  return this.save()
}

UserSchema.methods.isFavorite = function (id) {
  return this.favorites.some(function (favoriteId) {
    return favoriteId.toString() === id.toString()
  })
}

UserSchema.methods.follow = function (id) {
  if (this.following.indexOf(id) === -1) {
    this.following =this.following.concat(id)
  }

  return this.save()
}

UserSchema.methods.unfollow = function (id) {
  this.following.remove(id)
  return this.save()
}

UserSchema.methods.getFollowed = function (id) {
  if (this.follower.indexOf(id) === -1) {
    this.follower = this.follower.concat(id)
  }
  return this.save()
}
UserSchema.methods.getUnfollowed = function (id) {
  this.follower.remove(id)
  return this.save()
}
UserSchema.methods.isFollowing = function (id) {
  
  return this.following.some(function (followId) {
    
    
    return followId.toString() === id.toString()
  })
}

mongoose.model('User', UserSchema)
