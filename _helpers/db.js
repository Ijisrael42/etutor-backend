const config = require('config.json');
const mongoose = require('mongoose');
const connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect( config.connectionString, connectionOptions);
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
    Service: require('services/service.model'),
    Token: require('token/token.model'),
    isValidId
};

function isValidId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}