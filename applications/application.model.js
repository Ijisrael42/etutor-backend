const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String },
    description: { type: String, required: true },
    email: { type: String, required: true },
    // category: { type: Array, required: true },
    category: { type: String },
    status: { type: String },
    documents: { type: String },
    experience: { type: String, required: true },
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

module.exports = mongoose.model('Application', schema);