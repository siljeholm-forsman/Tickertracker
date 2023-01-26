const getStockInfoReducer = (state = {}, action) => {
  let retval = {
    ...state,
  };
  switch(action.type) {
    case "STOCK_INFO_STARTED":
      retval[action.symbol] = {};
      retval[action.symbol].loading = true;
      return retval
    case "STOCK_INFO_SUCCESS":
      retval[action.symbol] = {};
      retval[action.symbol].data = action.payload;
      retval[action.symbol].loading = false;
      return retval
    case "STOCK_INFO_FAILURE":
      retval[action.symbol] = {};
      retval[action.symbol].error = action.error;
      return retval
    default:
      return state
  }
}
export default getStockInfoReducer