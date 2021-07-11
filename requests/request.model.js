const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    supplier_name: { type: String },
    status: { type: String },
    supplier_comment: { type: String },
    supplier_rating_customer: { type: Number },
    customer_comment: { type: String },
    customer_rating_supplier: { type: Number },
    total: { type: Number },
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