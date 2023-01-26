const { Link } = require("react-router-dom")


const SearchresultsView = props => (
  <div id="searchResults">
    {props.results.map(([symbol, name]) => {
      return (
        <Link to={`/stock/${symbol}`} key={symbol} className="searchResult">
          <span className="symbol">{symbol}: </span><span className="name">{name}</span>
        </Link>
      )
    })}
    {props.results.length < 1 && <span className="searchResult">Can't find your stock? We currently only support stocks with a $2B+ market cap.</span>}
  </div>)

export default SearchresultsView