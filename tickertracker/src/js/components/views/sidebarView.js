import {Link} from "react-router-dom";
import numberFormatter from "js/utils/numberFormatter";
import {useSelector} from "react-redux";
import FollowStockButton from "js/components/elements/followStockButton";
import InfoPopup from "js/components/elements/infoPopup";

// eslint-disable-next-line
const displayTrend = (trend, trendChange) => <span className={`trendChange ${trendChange > 0 ? "trendUp" : "trendDown"}`}>{numberFormatter(new Number(trend)*100, 2)}</span> // trendChange i brackets sen, modifiera gräsnsen för trendUp|trendDown
// eslint-disable-next-line
const displayPrice = price => <span className={`priceChange ${price > 0 ? "priceUp" : "priceDown"}`}>{numberFormatter(new Number(price)*100, 2)}%</span>

const SidebarView = props => {


  return(
    <div id="sidebar">
      <div id="trending">
        <span id="trendingheader">
          <h4>Trending</h4>
          <InfoPopup content={<span>The trend score is based on the amount of mentions of a particular symbol across a multitude of subreddits.</span>}/>
        </span>
        <span className="title stockSidebar">
          <h5 className="ticker" style={{cursor: "auto"}}>Symbol</h5>
          <h5 className="priceChange">Price</h5>
          <h5 className="trendChange">Trend</h5>
        </span>
        {props.trending.map(stock =>
          <span key={stock.symbol} className="stockSidebar">
            <FollowStockButton symbol={stock.symbol}/>
            <Link className="ticker" to={`/stock/${stock.symbol}`}>{stock.symbol}</Link>
            {displayPrice(stock.priceChange)}
            {displayTrend(stock.trend, stock.trendChange)} 
            {/* trend */}
          </span>)}
      </div>
      {props.isLogged &&
      <div id="watchlist">
        <h4>Watchlist</h4>
        <span className="title stockSidebar">
          <h5 className="ticker" style={{cursor: "auto"}}>Symbol</h5>
          <h5 className="priceChange">Price</h5>
        </span>
        {props.watchlist.map(stock =>
          <span key={stock.symbol} className="stockSidebar">
            <FollowStockButton symbol={stock.symbol}/>
            <Link className="ticker" to={`/stock/${stock.symbol}`}>{stock.symbol}</Link>
            {displayPrice(stock.priceChange)}
          </span>)}
      </div>}
    </div>
  );
}

export default SidebarView