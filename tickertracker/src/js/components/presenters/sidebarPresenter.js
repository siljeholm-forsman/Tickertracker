import SidebarView from "../views/sidebarView";
import loadingIcon from "../../../assets/loading.svg";
import React from "react";
import {useFollowedStocksInfo} from "js/hooks/useFollowedStocksInfo";
import { useTrendingStocks } from "js/hooks/useTrendingStocks";
import { useSelector } from "react-redux";

const SidebarPresenter = props => {
  const [tdata, tloading, terror] = useTrendingStocks();
  const currentStockInfo = useFollowedStocksInfo();
  const isLogged = useSelector(state => state.isLogged);

  return (
  <div id="sidebarContainer">
      {tloading && <div className="loading"><img alt="Loading..." src={loadingIcon}></img></div>}
      {tdata && <SidebarView isLogged={isLogged} trending={tdata} watchlist={currentStockInfo.sort((a, b) => a.priceChange < b.priceChange)}></SidebarView>}
      {terror && <div className="loading"><img alt="Loading..."src={loadingIcon}></img></div>}
  </div>
  );
}

export default SidebarPresenter