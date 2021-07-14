const admin = require("firebase-admin");
const serviceAccount = require("service-account.json");
const accountService = require('accounts/account.service');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://test-f2acb.firebaseio.com"
});

module.exports = sendNotification;

async function sendNotification(msg, title, regIdArray, accountId, url) {
    const clickAction =  url ? url : '/';

    const data = { 
        // "notification": { "body": msg, "title": title },
        "data": { "body": msg, "title": title, "click_action": clickAction },
        "token": regIdArray,
    };

    const res = admin.messaging().send(data)
    .then((response) => {  return response; })
    .catch((err) => {
        console.log(err)
        accountService.update(accountId, { device_token: "" });
        return err; 
    });

    return res;
}
