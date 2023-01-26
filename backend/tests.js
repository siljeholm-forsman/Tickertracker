const admin = require("firebase-admin");
const secrets = require("./secrets.js");
admin.initializeApp({
  credential: admin.credential.cert(secrets.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS)
});
const db = admin.firestore();

//db.doc("priceHistory/AA").get().then(dt => dt.data()).then(console.log);


const tickers = require("./data/tickers-original.json");
tickers.forEach(async ticker => {
  let doc = await db.doc(`priceHistory/${ticker}`).get();
  let data = await doc.data();
  if (!data) {
    console.error(`${ticker} DOES NOT EXIST`);
  } else {
    let entries = Object.entries(data);
    console.error(`${ticker}: ${entries.length}`);

  }
  
})