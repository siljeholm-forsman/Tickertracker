import {getStockInfo} from "js/actions";
import {useDispatch, useSelector} from "react-redux";
import React from "react";
import useStockList from "js/hooks/useStockList";

export const useFollowedStocksInfo = () => {
  const followedStocks = useSelector(state => state.followedStocks);
  const followedStocksInfo = useSelector(state => state.stockInfo);
  const [currentStockInfo, setCurrentStockInfo] = React.useState([]);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getStockInfo(followedStocks))
  }, [followedStocks])

  React.useEffect(() => {
    let info = [];
    Object.entries(followedStocksInfo).forEach(([symbol, val]) => {
      if (!val.loading && val.data && followedStocks.includes(symbol)) {
        info.push({
          ...val.data,
          priceChange: (val.data.price-val.data.prevClose)/val.data.prevClose
        })
      }
    })
    setCurrentStockInfo(info);
  }, [followedStocksInfo, followedStocks])
  return currentStockInfo;
}