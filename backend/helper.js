const admin = require("firebase-admin");
const secrets = require("./secrets.js");
admin.initializeApp({
  credential: admin.credential.cert(secrets.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS)
});
const db = admin.firestore();

const deleteDocumentsInCollection = async collection => {
  console.log("!!! WARNING !!! DELETING DOCUMENTS!");
  let documents = await db.collection(collection).get();
  documents.forEach(document => {
    console.log(document.id);
    db.collection(collection).doc(document.id).delete();

  });
}

const printDocumentsInCollection = async collection => {
  let documents = await db.collection(collection).get();
  documents.forEach(document => {
    console.log(document.id);
  })
  console.log(documents.length);
}

const deleteDocument = async document => {
  db.doc(document).delete();
}

const printDocument = async document => {
  let doc = (await db.doc(document).get()).data()
  let arr = Object.entries(doc);
  arr = arr.sort((a, b) => new Date(a[0]) - new Date(b[0]));

  for (const [key, value] of arr) {
    console.log(key);
    console.log(value);
    //console.log(`${key} | ${value.date.toDate().toDateString()}`);
  }
}

printDocument("priceHistory/GME");
//printDocumentsInCollection("priceHistory")