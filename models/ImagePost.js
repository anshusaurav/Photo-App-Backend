var mongoose = require('mongoose')
var uniqueValidator = require('mongoose-unique-validator')
var slug = require('slug')
var User = mongoose.model('User')

var ImagePostSchema = new mongoose.Schema(
  {
    slug: { type: String, lowercase: true, unique: true },
    filename: String,
    description: String,
    location: String,
    favoritesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    tagList: [{ type: String }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
)

ImagePostSchema.plugin(uniqueValidator, { message: 'is already taken' })

ImagePostSchema.pre('validate', function (next) {
  if (!this.slug) {
    this.slugify()
  }

  next()
})

ImagePostSchema.methods.slugify = function () {
  this.slug =
    slug(this.filename) +
    '-' +
    ((Math.random() * Math.pow(36, 6)) | 0).toString(36)
}

ImagePostSchema.methods.updateFavoriteCount = function () {
  var imagepost = this

  return User.count({ favorites: { $in: [imagepost._id] } }).then(function (
    count
  ) {
    imagepost.favoritesCount = count

    return article.save()
  })
}

ImagePostSchema.methods.toJSONFor = function (user) {
  return {
    slug: this.slug,
    filename: this.filename,
    description: this.description,
    location: this.location,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    tagList: this.tagList,
    favorited: user ? user.isFavorite(this._id) : false,
    favoritesCount: this.favoritesCount,
    author: this.author.toProfileJSONFor(user)
  }
}

mongoose.model('ImagePost', ImagePostSchema)
