import HeaderView from "js/components/views/headerView";
import firestore from "js/utils/firebaseConfig";
import firebase from "firebase/app";
import React from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

const stocksToList = stocks => {
  let stockslist = []
  Object.entries(stocks).forEach(stock => {
    stockslist.push([stock[1]["symbol"], stock[1]["name"]])
  })
  return stockslist;
}

const match = (el1, el2) => {
  el1 = el1 ? el1 : "";
  el2 = el2 ? el2 : "";
  return el1.toLowerCase().includes(el2.toLowerCase());
}

const logOut = () => {
  firebase.auth().signOut();
} 

const HeaderPresenter = props => {
  const [keyword, setKeyword] = React.useState("");
  const [availableStocks, setAvailableStocks] = React.useState([])
  // Feels really unnecessary to separate this next line into application state/model/Redux. One single API call.
  const [stocks, stocksLoading, stocksError] = useDocument(firestore.doc(`availableStocks/all`));
  const [filteredStocks, setFilteredStocks] = React.useState([]);
  const [topResult, setTopResult] = React.useState("");
  const isLogged = useSelector(state => state.isLogged);
  const history = useHistory()

  React.useEffect(() => {
    let filtered = availableStocks.filter(stock => match(stock[0], keyword) || match(stock[1], keyword)).slice(0, 5);
    setFilteredStocks(filtered);
    if (filtered && filtered[0] && filtered[0][0]) {setTopResult(filtered[0][0])};
  }, [keyword, availableStocks]);

  React.useEffect(() => {
    if (stocks) {setAvailableStocks(stocksToList(stocks.data()));}
  }, [stocks]);
  
  return <HeaderView 
    keyword={keyword}
    setKeyword={setKeyword}
    results={filteredStocks}
    goToTopResult={() => history.push(`/stock/${topResult}`)}
    isLogged={isLogged}
    logOut={logOut}
  />
}
export default HeaderPresenter;