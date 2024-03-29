const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String },
    description: { type: String, required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'Account' },
    tutor_id: { type: Schema.Types.ObjectId, ref: 'Account' },
    bid_id: { type: Schema.Types.ObjectId, ref: 'Bid' },
    image_name: { type: String },
    image_url: { type: String },
    date_time: { type: String },
    no_of_hours: { type: Number },
    category: { type: String },
    status: { type: String },
    budget: { type: Number },    
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

module.exports = mongoose.model('Question', schema);