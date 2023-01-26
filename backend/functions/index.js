const functions = require("firebase-functions");
const admin = require("firebase-admin");
const secrets = require("./secrets");
const axios = require("axios").default;

const snoowrap = require('snoowrap');

let RAPIDAPI_YAHOO_API_KEY = secrets.RAPIDAPI_YAHOO_API_KEY_2

admin.initializeApp();

let databaseApp = admin.initializeApp({
  credential: admin.credential.cert(
      secrets.FIREBASE_SERVICE_ACCOUNT_CREDENTIALS
  ),
}, 'db');
const db = admin.firestore(databaseApp);
db.settings({ignoreUndefinedProperties: true});

// REDDIT STUFF
//let data = fs.readFileSync("./tickers-original.json", "utf8")

let tickers = new Set(require("./tickers-original.json"));
const blacklist = new Set(["DD", "RH", "A", "X", "Y", "ALL", "F", "G", "EDIT", "U", "R", "J", "HE", "O", "ATH"]);
const investingSubreddits = ["wallstreetbets", "stocks", "investing", "wallstreetbetsnew", ]

const r = new snoowrap(secrets.SNOOWRAP_REDDIT_CREDENTIALS);

const symbolRegExp = /\b[A-Z]{1,4}\b[.!?]?/;

// REDDIT FUNCTIONS
const scrapeSubreddit = async (sub) => {
  const subreddit = await  r.getSubreddit(sub);
  let hotposts = await subreddit.getHot({time: "day", limit: 100});
  let amntposts = hotposts.length;
  console.log(amntposts);
  let totalcomments = 0;

  hotposts = await Promise.all(hotposts.map(async post => {
    post = await post.expandReplies({depth: 1, limit: 1});
    let comments = [];
    post.comments.forEach(comment => comments.push(comment.body));
    totalcomments += comments.length;
    return {
      redditlink: "https://reddit.com" + post.permalink,
      title: post.title,
      body: post.selftext,
      postedlink: post.url,
      author: post.author.name,
      score: post.score,
      subreddit: post.subreddit_name_prefixed,
      date: new Date(post.created_utc*1000),
      is_reddit_media_domain: post.is_reddit_media_domain,
      media_embed: post.media_embed,
      comments: comments,
      is_gallery: post?.is_gallery ? true : false,
      gallery_data: post?.gallery_data,
      media_metadata: post?.media_metadata,
      post_hint: post?.post_hint,
      media: post?.media,
    };
  }));
  return hotposts;
}

const sortPostsByMentions = posts => {
  posts.forEach(post => {
    countMentionsInSubmissionNoComments(post);
  });
  let sortedPosts = {};
  posts.forEach(post => {
    post.mentions.forEach(ticker => {
      if (!sortedPosts[ticker]) {
        sortedPosts[ticker] = [post];
      } else {
        sortedPosts[ticker].push(post);
      }
    });
    delete post.mentions;
  });
  return sortedPosts;
}

const calculateTrendingTickers = posts => {
  posts = posts.map(post => countMentionsInSubmission(post));
  let mentions = Object.entries(countTotalMentions(posts));
  mentions = mentions.sort((men1, men2) => men2[1] - men1[1]);
  return Object.fromEntries(mentions);
}

const countMentionsInText = text => {
  mentions = new Set();
  // GER ERROR UNEXPECTED .
  if (text) {
    let ticker;
    text.match(symbolRegExp)?.forEach(ticker => {
      if (tickers.has(ticker) && !blacklist.has(ticker)) {
        mentions.add(ticker);
      };
    });
  }
  return mentions
}

const countMentionsInSubmissionNoComments = post => {
  post.mentions = new Set();
  countMentionsInText(post.title).forEach(e => post.mentions.add(e));
  countMentionsInText(post.body).forEach(e => post.mentions.add(e));
  return post
}

const countMentionsInSubmission = post => {
  post.commentMentions = {};
  post.mentions = new Set();
  countMentionsInText(post.title).forEach(e => post.mentions.add(e));
  countMentionsInText(post.body).forEach(e => post.mentions.add(e));
  post.comments?.forEach(comment => {
    countMentionsInText(comment).forEach(ticker => {
      if (ticker in post.commentMentions) {
        post.commentMentions[ticker]++;
      } else {
        post.commentMentions[ticker] = 1;
      }
    });
  });
  return post;
}

const countTotalMentions = posts => {
  let mentions = {};
  posts.forEach(post => {
    post.mentions.forEach(ticker => {
      if (ticker in mentions) {
        mentions[ticker]++;
      } else {
        mentions[ticker] = 1;
      }
    });
    for (let [ticker, commentMentions] of Object.entries(post.commentMentions)) {
      if (ticker in mentions) {
        mentions[ticker] += commentMentions;
      } else {
        mentions[ticker] = commentMentions;
      }
    }
  })
  return mentions;
}

const displayMentions = async sub => {
  let posts = await scrapeSubreddit(sub);
  let mentions = Object.entries(countTotalMentions(posts));
  mentions = mentions.sort((men1, men2) => men2[1] - men1[1]);
  return Object.fromEntries(mentions);
}

const analyzeRedditAndPush = async () => {
  let todaysDate = (new Date()).toISOString().split("T")[0]
  hotposts = [];
  for (subreddit of investingSubreddits) {
    hotposts = hotposts.concat(await scrapeSubreddit(subreddit));
  }
  console.log("GOT POSTS");
  console.log(hotposts.length)

  for ([key, value] of Object.entries(sortPostsByMentions(hotposts))) {
    await db.collection("trendingPosts").doc(key).set({posts: value});
  }
  console.log("STORED POSTS BY TICKER");

  let symbols = Object.entries(calculateTrendingTickers(hotposts));
  symbols = normalizeMentions(symbols);
  symbols.forEach(async symbol => {
    let trend = {};
    trend[todaysDate + ".trend"] = symbol[1];
    await db.doc(`priceHistory/${symbol[0]}`).update(trend);
  });
  console.log("CALCULATED TRENDS");
  let numPosts = [5, 10, 15];
  await Promise.all(numPosts.map(async limit => {
    let i = 0;
    //console.log(`CURRENT LIMIT: ${limit}`);
    let stockslist = [];
    while (i < limit && symbols[i]) {
      let currsymbol = symbols[i][0];
      // Reduce function to get the latest data from the history
      let yesterday = Object.entries((await db.collection("priceHistory").doc(currsymbol).get()).data()).reduce((latest, curr) => new Date(curr[0]) > new Date(latest[0]) && curr[0] != todaysDate ? curr : latest);
      //console.log(yesterday);
      let prevTrend = yesterday[1]?.trend;
      //console.log(prevTrend);
      let stockdata = (await db.collection("stockInformation").doc(currsymbol).get()).data();
      let change = (stockdata["price"] - stockdata["prevClose"])/stockdata["prevClose"];
      stockslist.push({
        "symbol": currsymbol,
        "price": stockdata["price"],
        "priceChange": change,
        "trend": symbols[i][1],
        "trendChange": prevTrend ? (symbols[i][1]-prevTrend)/prevTrend : Infinity
      });
      i++;
      //console.log(`SYMBOL: ${currsymbol} TRENDCHANGE: ${prevTrend}`)
    }
    await db.doc(`popularStocks/top${limit}`).set({"stocks": stockslist});
  }));
  console.log("UPDATED TRENDING TICKERS")
}

const normalizeMentions = symbols => {
  let sumOfMentions = symbols.reduce((sum, curr) => sum + parseInt(curr[1]), 0);
  return symbols.map(symbol => [symbol[0], symbol[1]/sumOfMentions])
}

const deleteOldReddit = async () => {
  let documents = await db.collection("trendingPosts").get();
  documents.forEach(async document => {
    await db.collection("trendingPosts").doc(document.id).delete();
  });
}

const sleep = async millis => (new Promise(resolve => setTimeout(resolve, millis)));

const storeTickerHistorical = (ticker, file) => {
  parse(file, async (err, rows) => {
    let pricedict = {};
    if (err) {
      console.error(err);
    }
    rows.slice(1).forEach(row => {
      let currdate = new Date(row[0])
      currdate.setUTCHours(20);
      pricedict[currdate.toISOString().split("T")[0]] = {
        date: currdate,
        close: parseFloat(row[4]),
        volume: parseInt(row[6])
      };
    });
    await db.doc(`priceHistory/${ticker}`).set(pricedict).catch(console.log);
  });
}

const getTickerHistorical = async ticker => {
  let csvfile = await fetch(`https://query1.finance.yahoo.com/v7/finance/download/${ticker}?period1=1459555200&period2=1617321600&interval=1d&events=history&includeAdjustedClose=true`)
  let data = await csvfile.text();
  return data;
}

const getAndStoreHistoricalPrices = async tickers => {
  let check = false
  for (ticker of tickers) {
    if (ticker =="CIT") {
      check = true;
    }
    if (ticker == "CLGX") {
      check = false;
    }
    if (check) {
      storeTickerHistorical(ticker, (await getTickerHistorical(ticker)));
      await sleep(200);
    }
  }
  console.log("DONE!");
}

const returnUndefinedOnInvalidDate = date => isNaN(date.getTime()) ? undefined : date;

const getAndStoreDailyInfo = async tickers => {
  let i,j,tickerschunk;
  let chunk = 50;

  console.log("CALLING YAHOO FINANCE API")
  for (i = 0, j=tickers.length; i < j; i += chunk) {
    tickerschunk = tickers.slice(i,i + chunk);
    
    let response = await axios.request({
      method: "GET",
      url: "https://apidojo-yahoo-finance-v1.p.rapidapi.com/market/v2/get-quotes",
      params: {region: "US", symbols: tickerschunk.join()},
      headers: {
        "x-rapidapi-key": RAPIDAPI_YAHOO_API_KEY,
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com"
      }
    });
    let data = response.data.quoteResponse.result;

    await Promise.all(data.map(async stock => {
      relevantdata = {
        "symbol": stock["symbol"],
        "name": stock["shortName"],
        "exchange": stock["exchange"],
        "price": stock["regularMarketPrice"],
        "priceDate": new Date(stock["regularMarketTime"]*1000),
        "prevClose": stock["regularMarketPreviousClose"],
        "dayrange": stock["regularMarketDayRange"],
        "fiftyTwoWkrange": stock["fiftyTwoWeekRange"],
        "volume": stock["regularMarketVolume"],
        "avg10dvolume": stock["averageDailyVolume10Day"],
        "marketCap": stock["marketCap"],
        "forwardPE": stock["forwardPE"],
        "dividendDate": returnUndefinedOnInvalidDate(new Date(stock["dividendDate"]*1000)),
        "exDividendDate": returnUndefinedOnInvalidDate(new Date(stock["exDividendDate"]*1000)),
        "earningsTime": returnUndefinedOnInvalidDate(new Date(stock["earningsTimestamp"]*1000)),
        "shortPercentFloat": stock["shortPercentFloat"],
        "currency": stock["currency"]
      };
      await db.doc(`stockInformation/${stock["symbol"]}`).set(relevantdata);
      let today = {};
      today[relevantdata.priceDate.toISOString().split("T")[0]] = {
        "date": new Date(stock["regularMarketTime"]*1000),
        "close": stock["regularMarketPrice"],
        "volume": stock["regularMarketVolume"]
      };
      await db.doc(`priceHistory/${stock["symbol"]}`).set(today, {merge: true});
    }));
  };
  console.log("FINISHED YAHOO FINANCE CALLS")
}

const storeAllDaily = async () => {
  const tickers = require("./tickers-original.json");
  await getAndStoreDailyInfo(tickers);
  console.log("COMPLETED PRICE STORE")
}

const storeReddit = async () => {
  await deleteOldReddit();
  await analyzeRedditAndPush();
  console.log("COMPLETED REDDIT STORE")
}

exports.dailyStockInfo = functions
  .runWith({timeoutSeconds: 300})
  .pubsub
  .schedule('30 22 * * 1-5')
  .timeZone('Europe/Stockholm')
  .onRun(context => {
    let today = new Date().getDate();
    if (today > 0) {
      RAPIDAPI_YAHOO_API_KEY = secrets.RAPIDAPI_YAHOO_API_KEY_1;
    } else if (today > 11) {
      RAPIDAPI_YAHOO_API_KEY = secrets.RAPIDAPI_YAHOO_API_KEY_2;
    } else if (today > 21) {
      RAPIDAPI_YAHOO_API_KEY = secrets.RAPIDAPI_YAHOO_API_KEY_3;
    }

    return storeAllDaily();
  });

exports.storeReddit = functions
  .runWith({timeoutSeconds: 300})
  .pubsub
  .schedule('00 */3 * * *')
  .timeZone('Europe/Stockholm')
  .onRun(context => {
    return storeReddit();
  })

storeAllDaily();
//storeReddit()