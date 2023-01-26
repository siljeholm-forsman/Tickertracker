import firestore from "js/utils/firebaseConfig.js";

export const login = () => {
  return {
    type: 'SIGN_IN',
  };
};

export const logout = () => {
  return {
    type: 'SIGN_OUT',
  };
};

export const toggleFollowStock = symbol => {
  return {
    type: 'TOGGLE_STOCK',
    symbol: symbol
  }
}

export const setFollowedStocks = symbols => {
  return {
    type: 'SET_FOLLOWED_STOCKS',
    symbols: symbols
  }
}

const dbCallStarted = (type, symbol) => ({
  type: type + "_STARTED",
  symbol: symbol
})

const dbCallSuccess = (type, symbol, payload) => ({
  type: type + "_SUCCESS",
  symbol: symbol,
  payload: {
    ...payload
  }
})

const dbCallFailure = (type, symbol, error) => ({
  type: type + "_FAILURE",
  symbol: symbol,
  payload: {
    error
  }
})

export const getStockInfo = symbols => {
  return (dispatch, getState) => {
    symbols.forEach(symbol => {
      if (!(symbol in getState().stockInfo)) {
        dispatch(dbCallStarted("STOCK_INFO", symbol))
        firestore
          .doc(`stockInformation/${symbol}`)
          .get()
          .then(res => {
            dispatch(dbCallSuccess("STOCK_INFO", symbol, res.data()))
          })
          .catch(err => {
            dispatch(dbCallFailure("STOCK_INFO", symbol, err))
          })
      }
    })
  }
}

export const getStockHistory = symbols => {
  return (dispatch, getState) => {
    let name = "STOCK_HISTORY";
    symbols.forEach(symbol => {
      if (!(symbol in getState().stockHistory)) {
        dispatch(dbCallStarted(name, symbol))
        firestore
          .doc(`priceHistory/${symbol}`)
          .get()
          .then(res => {
            dispatch(dbCallSuccess(name, symbol, res.data()))
          })
          .catch(err => {
            dispatch(dbCallFailure(name, symbol, err))
          })
      }
    })
  }
}

export const getTrendingStocks = () => {
  return dispatch => {
    let name = "TRENDING_STOCKS"
    dispatch(dbCallStarted(name, "na"));
    firestore
      .doc(`popularStocks/top10`)
      .get()
      .then(res => {
        dispatch(dbCallSuccess(name, "na", res.data()))
      })
      .catch(err => {
        dispatch(dbCallFailure(name, "na", err))
      })
  }
};

export const getTrendingPosts = symbols => {
  return (dispatch, getState) => {
    let name = "TRENDING_POSTS"
    symbols.forEach(symbol => {
      if (!(symbol in getState().trendingPosts)) {
        dispatch(dbCallStarted(name, symbol))
        firestore
          .doc(`trendingPosts/${symbol}`)
          .get()
          .then(res => {
            dispatch(dbCallSuccess(name, symbol, res.data()))
          })
          .catch(err => {
            dispatch(dbCallFailure(name, symbol, err))
          })
      }
    })
  }
}