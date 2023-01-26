import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, compose, applyMiddleware} from 'redux';
import allReducers from "./js/reducers";
import {Provider} from "react-redux";
import {loadState, saveState} from "./js/utils/localStorage"
import firestore from "js/utils/firebaseConfig.js";
import thunk from "redux-thunk";

import "./scss/style.css";

import App from './App';
import firebase from "firebase/app";
import {login, logout, setFollowedStocks} from "./js/actions"

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedState = loadState();
const store = createStore(
  allReducers,
  persistedState,
  composeEnhancer(applyMiddleware(thunk))
);

let currentState = store.getState();
const handleChange = () => {
  let previousState = currentState;
  currentState = store.getState();
  if (currentState.followedStocks != previousState?.followedStocks) {
    if (currentState.isLogged) {
      // ACCESS CURRENT USER
      firestore.doc(`users/${firebase.auth().currentUser.uid}`).set({
        followedStocks: currentState.followedStocks
      });
    }
  }
  if (currentState.isLogged != previousState?.isLogged) {
    saveState({
      isLogged: store.getState().isLogged
    });
  }
}

store.subscribe(() => {
  handleChange();
});

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    firestore.doc(`users/${user.uid}`).get()
      .then(dt => store.dispatch(setFollowedStocks(dt.data()?.followedStocks ? dt.data()?.followedStocks : [])))
    
    store.dispatch(login());
  } else {
    store.dispatch(logout());
    store.dispatch(setFollowedStocks([]));
  }
})

ReactDOM.render((
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>),
  document.getElementById('root')
);

export {store}