const admin = require("firebase-admin");

const secrets = require("./secrets.js");

admin.initializeApp({
  credential: admin.credential.cert(secrets.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS)
});

const db = admin.firestore();
db.settings({ignoreUndefinedProperties: true});

const tickers = require("./data/tickers-original.json");
//const tickers = ["GME"]


const getAndPushStockInfo = async () => {
  for (ticker of tickers) {
    let info = (await db.doc(`stockInformation/${ticker}`).get()).data();
    let reducedinfo = {};
    reducedinfo[info.symbol] = {}
    reducedinfo[info.symbol]["symbol"] = info["symbol"];
    reducedinfo[info.symbol]["name"] = info["name"];
    await db.doc(`availableStocks/all`).set(reducedinfo, {merge: true});
  }
}

getAndPushStockInfo();