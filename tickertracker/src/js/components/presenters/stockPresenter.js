//import {StockInfoView, StockGraphView, StockHeaderView} from "../views/stockView";
import StockView from "js/components/views/stockView";
import React from "react";
import moment from "moment"
import { useStockHistory } from "js/hooks/useStockHistory";
import { useStockInfo } from "js/hooks/useStockInfo";
import loadingIcon from "assets/loading.svg"

const convertPricesToList = pricedict => {
  let prices = Object.entries(pricedict);
  prices = prices.map(price => [new Date(price[0]),price[1]]);
  prices.sort((a, b) => a[0] - b[0]);
  prices = prices.filter(price => price[1]?.date);
  prices = prices.map(price => {return {x: price[1].date.toDate(), y: price[1].close}});
  return prices
}

const filterByDate = (prices, dur, unit) => prices.filter(day => day.x > moment(new Date()).subtract(dur, unit));


const StockPresenter = props => {
  const [hdata, hloading, herror] = useStockHistory(props.symbol);
  const [sdata, sloading, serror] = useStockInfo(props.symbol);
  const [currentData, setCurrentData] = React.useState([]);

  const exists = () => (
    sdata && hdata && sdata[props.symbol[0]] && hdata[props.symbol[0]]
  )

  React.useEffect(() => {
    if (hdata) {
      setCurrentData(convertPricesToList(hdata[props.symbol]));
    }
  }, [hdata]);

  React.useEffect(() => {
    if (props.setLoading) {
      props.setLoading(hloading || sloading)
    }
  }, [hloading, sloading])

  return (
    <>
    {!props.loading && 
      <div id="stockinfo">
        {(hloading || sloading) && <div className="loading"><img alt="Loading..." src={loadingIcon}></img></div>}
        {exists() && <StockView 
          info={sdata[props.symbol[0]]}
          historicalData={currentData}
          filterData={(dur, unit) => setCurrentData(filterByDate(convertPricesToList(hdata[props.symbol[0]]), dur, unit))}
        />}
      </div>
    }
    </>
  )
}

export default StockPresenter