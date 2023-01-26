import bookmarkFilled from "assets/bookmark-filled.svg";
import bookmark from "assets/bookmark.svg";

const FollowStockButtonView = props => (
  <img 
    alt="Follow" 
    src={props.followedStocks.includes(props.symbol) ? bookmarkFilled : bookmark} 
    className="bookmark" 
    onClick={props.followStock}
  />
)
export default FollowStockButtonView