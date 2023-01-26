import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStockHistory } from "js/actions";
import useStockList from "js/hooks/useStockList";


export const useStockHistory = symbols => {
  const historicData = useSelector(state => state.stockHistory);
  const dispatch = useDispatch();
  const [data, loading, error] = useStockList(symbols, historicData);

  React.useEffect(() => {
    dispatch(getStockHistory(symbols))
  }, [symbols])

  return [data, loading, error]
}