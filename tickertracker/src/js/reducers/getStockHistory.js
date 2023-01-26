const getStockHistoryReducer = (state = {}, action) => {
  let retval = {
    ...state,
  };
  switch(action.type) {
    case "STOCK_HISTORY_STARTED":
      retval[action.symbol] = {};
      retval[action.symbol].loading = true;
      return retval
    case "STOCK_HISTORY_SUCCESS":
      retval[action.symbol] = {};
      retval[action.symbol].data = action.payload;
      retval[action.symbol].loading = false;
      return retval
    case "STOCK_HISTORY_FAILURE":
      retval[action.symbol] = {};
      retval[action.symbol].error = action.error;
      return retval
    default:
      return state
  }
}
export default getStockHistoryReducer