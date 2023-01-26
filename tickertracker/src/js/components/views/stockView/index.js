import FollowStockButton from "js/components/elements/followStockButton";
import StockGraphView from "./stockGraphView";
import StockInfoView from "./stockInfoView";

const StockView = props => (
  <div id="stockinfo">
    <span id="stockheader">
      <h1 className="title"><FollowStockButton symbol={props.info.symbol}/>{props.info.name} ({props.info.symbol})</h1>
    </span>
      <StockGraphView {...props}/>
      <StockInfoView {...props}/>
  </div>
)

export default StockView