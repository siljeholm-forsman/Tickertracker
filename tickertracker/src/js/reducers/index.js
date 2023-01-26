import {combineReducers} from 'redux';
import loggedReducer from "./isLogged";
import followStockReducer from "./followStock";
import getTrendingStocks from "./getTrendingStocks";
import getStockInfoReducer from './getStockInfo';
import getStockHistoryReducer from './getStockHistory';
import getTrendingPostsReducer from './getTrendingPosts';

const allReducers = combineReducers({
  isLogged: loggedReducer,
  followedStocks: followStockReducer,
  trendingStocks: getTrendingStocks,
  stockInfo: getStockInfoReducer,
  stockHistory: getStockHistoryReducer,
  trendingPosts: getTrendingPostsReducer,
});

export default allReducers;