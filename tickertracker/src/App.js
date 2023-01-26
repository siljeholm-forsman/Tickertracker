import {BrowserRouter as Router, Switch, Route, useParams} from "react-router-dom";
import StockPresenter from './js/components/presenters/stockPresenter';
import SidebarPresenter from './js/components/presenters/sidebarPresenter';
import HeaderPresenter from './js/components/presenters/headerPresenter';
import PostPresenter from './js/components/presenters/postPresenter';
import MobileNavbar from './js/components/presenters/mobileNavbar';
import {useSelector} from "react-redux";
import { useTrendingStocks } from "js/hooks/useTrendingStocks";
import React from "react";
import loadingIcon from "assets/loading.svg"


function App() {

  const isLogged = useSelector(state => state.isLogged);
  const followedStocks = useSelector(state => state.followedStocks);
  const [trends, loading, error] = useTrendingStocks();
  const [defaultSymbols, setDefaultSymbols] = React.useState([]);

  React.useEffect(() => {
    if (trends && trends[0]) {
      setDefaultSymbols(trends.map(stock => stock.symbol));
    }
  }, [trends])

  return (
    <Router>
      <HeaderPresenter/>
      <SidebarPresenter/>
      <div id="mainContentContainer">
        <div id="mainContent">
          <Switch>
            <Route path="/stock/:symbol">
              <Stock/>
            </Route>
            <Route path="/">
              <PostPresenter 
                symbols={isLogged ? followedStocks : defaultSymbols} 
                title={isLogged ? "Your Reddit Feed" : "Popular Posts from Reddit"}
              />
            </Route>
          </Switch>
        </div>
      </div>
      <MobileNavbar/>
    </Router>
  );
}

const Stock = props => {
  const [sloading, setSLoading] = React.useState(true)
  const [ploading, setPLoading] = React.useState(true)

  let {symbol} = useParams()
  return (
    <>
      {sloading && ploading && <div className="loading"><img alt="Loading..." src={loadingIcon}></img></div>}
        <>
          <StockPresenter loading={sloading && ploading} setLoading={setSLoading} symbol={[symbol.toUpperCase()]}/>
          <PostPresenter loading={sloading && ploading} setLoading={setPLoading} symbols={[symbol.toUpperCase()]} title={"Posts from Reddit about " + symbol.toUpperCase()}/>
        </>
    </>
  )
}

export default App;
