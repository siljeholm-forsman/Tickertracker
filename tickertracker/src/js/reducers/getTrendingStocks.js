const initialState = {
  loading: false,
  stocks: [],
  error: null
};
const getTrendingStocksReducer = (state = initialState, action) => {
  switch (action.type) {
    case "TRENDING_STOCKS_STARTED":
      return {
        ...state,
        loading: true
      }
    case "TRENDING_STOCKS_SUCCESS":
      return {
        ...state,
        loading: false,
        stocks: action.payload.stocks,
        error: null
      }
    case "TRENDING_STOCKS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload.error
      }
    default:
      return state
  }
}
export default getTrendingStocksReducer