const getTrendingPostsReducer = (state = {}, action) => {
  let retval = {
    ...state,
  };
  switch(action.type) {
    case "TRENDING_POSTS_STARTED":
      retval[action.symbol] = {};
      retval[action.symbol].loading = true;
      return retval
    case "TRENDING_POSTS_SUCCESS":
      retval[action.symbol] = {};
      retval[action.symbol].data = action.payload;
      retval[action.symbol].loading = false;
      return retval
    case "TRENDING_POSTS_FAILURE":
      retval[action.symbol] = {};
      retval[action.symbol].error = action.error;
      return retval
    default:
      return state
  }
}
export default getTrendingPostsReducer