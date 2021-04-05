const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect("mongodb+srv://ijudah42:waseekiI42@cluster0.gl6yf.mongodb.net/eTutors?retryWrites=true&w=majority",connectionOptions);
mongoose.Promise = global.Promise;
const connection= mongoose.connection;

connection.once('open', () => {
    console.log("Mongodb database connection established successfully !!");
})

module.exports = {
    Account: require('accounts/account.model'),
    Question: require('questions/question.model'),
    Bid: require('bids/bid.model'),
    Application: require('applications/application.model'),
    RefreshToken: require('accounts/refresh-token.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}