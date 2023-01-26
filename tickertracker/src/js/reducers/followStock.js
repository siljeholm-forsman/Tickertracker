const followStockReducer = (state = [], action) => {
  switch (action.type) {
    case 'FOLLOW_STOCK':
      return state.includes(action.symbol) ? state : [...state, action.symbol];
    case 'UNFOLLOW_STOCK':
      return state.filter(symbol => symbol !== action.symbol);
    case 'TOGGLE_STOCK':
      return state.includes(action.symbol) ? state.filter(symbol => symbol !== action.symbol) : [...state, action.symbol];
    case 'SET_FOLLOWED_STOCKS':
      return action.symbols
    default:
      return state;
  }
}

export default followStockReducer