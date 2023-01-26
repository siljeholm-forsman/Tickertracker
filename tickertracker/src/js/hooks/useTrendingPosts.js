import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTrendingPosts } from "js/actions";
import useStockList from "js/hooks/useStockList";

export const useTrendingPosts = symbols => {

  const trendingPosts = useSelector(state => state.trendingPosts);
  const [allTrendingPosts, setAllTrendingPosts] = React.useState([]);
  const dispatch = useDispatch();
  const [data, loading, error] = useStockList(symbols, trendingPosts)

  React.useEffect(() => {
    dispatch(getTrendingPosts(symbols));
  }, [symbols])

  React.useEffect(() => {
    let posts = []
    symbols.forEach(symbol => {
      if (symbols.includes(symbol) && symbol in trendingPosts && trendingPosts[symbol].data && trendingPosts[symbol].data.posts) {
        posts = [...posts, ...trendingPosts[symbol].data.posts]
      }
    });
    setAllTrendingPosts(posts)
  }, [data])
  return [allTrendingPosts, loading, error];
}