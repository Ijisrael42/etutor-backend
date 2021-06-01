const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'Account' },
    created: { type: Date, default: Date.now },
    updated: Date
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
    }
});

module.exports = mongoose.model('Request', schema);