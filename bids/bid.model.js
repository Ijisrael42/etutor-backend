const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    question_id: { type: Schema.Types.ObjectId, ref: 'Question' },
    tutor_id: { type: Schema.Types.ObjectId, ref: 'Account' },
    tutor_name: { type: String },
    signature: { type: String },
    question_title: { type: String },
    status: { type: String },
    price: { type: Number },    
    created: { type: Date, default: Date.now },
    updated: Date
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
    }
});

module.exports = mongoose.model('Bid', schema);