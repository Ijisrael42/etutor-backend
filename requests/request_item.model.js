const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    request_id: { type: Schema.Types.ObjectId, ref: 'Request' },
    product_id: { type: String },
    product_name: { type: String },
    price: { type: Number },
    quantity: { type: Number },
    created: { type: Date, default: Date.now },
    updated: Date
});

schema.virtual('isExpired').get(function () {
    return Date.now() >= this.expires;
});

schema.virtual('isActive').get(function () {
    return !this.revoked && !this.isExpired;
});

module.exports = mongoose.model('RequestItem', schema);