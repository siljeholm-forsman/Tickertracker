import csv
import json
import enchant

#d = enchant.Dict("en_US")

# https://www.nasdaq.com/market-activity/stocks/screener
tickers = []
with open("nasdaq_screener_1617394081662.csv") as f:
  rows = csv.reader(f)
  for row in rows:
    #if not d.check(row[0]):
    tickers.append(row[0])
tickers = tickers[1:]
#print(len(tickers))

with open("tickers.json", "w") as f:
  json.dump(tickers, f)
