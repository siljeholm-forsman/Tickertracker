import { toggleFollowStock } from "js/actions";
import { useDispatch, useSelector } from "react-redux";
import FollowStockButtonView from "./followStockButtonView";

const FollowStockButton = props => {
  const followedStocks = useSelector(state => state.followedStocks);
  const isLogged = useSelector(state => state.isLogged);
  const dispatch = useDispatch();

  return <>
    {isLogged && <FollowStockButtonView symbol={props.symbol} followedStocks={followedStocks} followStock={() => dispatch(toggleFollowStock(props.symbol))}/>}
  </>
}
export default FollowStockButton