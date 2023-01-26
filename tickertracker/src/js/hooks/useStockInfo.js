import React from "react";
import { connect, useDispatch, useSelector } from "react-redux"
import { getStockInfo } from "js/actions";
import useStockList from "js/hooks/useStockList";
import {store} from "index.js"

export const useStockInfo = symbols => {
  const stockInfo = useSelector(state => state.stockInfo);
  const dispatch = useDispatch();
  const [data, loading, error] = useStockList(symbols, stockInfo);

  React.useEffect(() => {
    dispatch(getStockInfo(symbols));
  }, [symbols]);

  return [data, loading, error]
}