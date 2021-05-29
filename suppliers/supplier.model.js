const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String },
    email: { type: String, required: true },
    idpassport_no: { type: String, required: true },
    contact_no: { type: String, required: true },
    category: { type: String, required: true },
    // category: { type: Array, required: true },
    status: { type: String },
    address: { type: String },
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

module.exports = mongoose.model('Supplier', schema);