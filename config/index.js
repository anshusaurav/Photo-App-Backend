module.exports = {
  secret: process.env.NODE_ENV === 'production' ? process.env.SECRET : 'secret',
  google: {
		projectId: 'bookstoreapp-279005',
		bucket: 'images-photoappbucket',
	},
};
