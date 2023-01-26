import numberFormatter from "js/utils/numberFormatter";

const checkIfNA = (content, retcontent=content) => content ? retcontent : "N/A"

const StockInfoView = props => (
  <div id="stockdata">
    <h2 className="title">Stock Summary</h2>
    <div className="datatable">
      <div className="row"><div className="rowContent"><span className="label">Today's Range</span><span className="value">{checkIfNA(props.info.dayrange)}</span></div></div>
      <div className="row"><div className="rowContent"><span className="label">Close</span><span className="value">{checkIfNA(props.info.price)}</span></div></div>
      <div className="row"><div className="rowContent"><span className="label">Previous Close</span><span className="value">{checkIfNA(props.info.prevClose)}</span></div></div>
      <div className="row"><div className="rowContent"><span className="label">Market Cap</span><span className="value">{checkIfNA(props.info.marketCap, numberFormatter(props.info.marketCap, 2, true))}</span></div></div>
      <div className="row"><div className="rowContent"><span className="label">52-Week Range</span><span className="value">{checkIfNA(props.info.fiftyTwoWkrange)}</span></div></div>
      <div className="row"><div className="rowContent"><span className="label">Forward P/E</span><span className="value">{checkIfNA(props.info.forwardPE)}</span></div></div>
      <div className="row"><div className="rowContent"><span className="label">Earnings</span><span className="value">{checkIfNA(props.info.earningsTime, props.info.earningsTime?.toDate().toDateString())}</span></div></div>
      <div className="row"><div className="rowContent"><span className="label">Dividend Date</span><span className="value">{checkIfNA(props.info.dividendDate, props.info.dividendDate?.toDate().toDateString())}</span></div></div>
      <div className="row"><div className="rowContent"><span className="label">Ex Dividend Date</span><span className="value">{checkIfNA(props.info.exDividendDate, props.info.exDividendDate?.toDate().toDateString())}</span></div></div>
      <div className="row"><div className="rowContent"><span className="label">Short Percent of Float</span><span className="value">{checkIfNA(props.info.shortPercentFloat, props.info.shortPercentFloat + "%")}</span></div></div>
    </div>
    <p style={{fontStyle: "italic"}}>
      * Prices are shown in {props.info.currency}. Last updated {props.info.priceDate.toDate().toDateString()}.
      <br/> 
      ** Items marked as "N/A" are currently not accessible from our sources.
    </p>
  </div>
)

export default StockInfoView;