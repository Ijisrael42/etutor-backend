const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: { type: String },
    supplier: { type: String, required: true },
    contact_no: { type: String, required: true },
    car_model: { type: String, required: true },
    car_color: { type: String, required: true },
    no_plate: { type: String, required: true },
    documents: { type: String },
    profile_picture: { type: String },
    status: { type: String, required: true },
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

module.exports = mongoose.model('Vehicle', schema);