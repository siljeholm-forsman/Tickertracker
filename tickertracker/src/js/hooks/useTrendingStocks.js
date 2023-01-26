import React from "react";
import { useDispatch, useSelector } from "react-redux"
import { getTrendingStocks } from "js/actions";


export const useTrendingStocks = () => {
  const [data, setData] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState();

  const trending = useSelector(state => state.trendingStocks);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(getTrendingStocks());
  }, [])

  React.useEffect(() => {
    if (trending) {
      if (trending.error) {
        setError("Could not resolve trending stocks.")
      } else if (trending.loading) {
        setLoading(true);
      } else if (Object.keys(trending.stocks) != 0) {
        setData(trending.stocks)
        setLoading(false)
      }
    } else {
      setLoading(true)
    }
  }, [trending])
  return [data, loading, error]
}