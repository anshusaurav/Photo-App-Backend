var mongoose = require('mongoose');

var MessageSchema = new mongoose.Schema({
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'ImagePost' },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });


MessageSchema.methods.toJSONFor = function (user) {
    return {
        id: this._id,
        post: this.post,
        sender: this.sender,
        receiver: this.receiver,
        createdAt: this.createdAt,
    };
};

mongoose.model("Message", MessageSchema);
