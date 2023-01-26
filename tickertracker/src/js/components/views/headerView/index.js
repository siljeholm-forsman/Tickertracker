import SearchbarView from "./searchbarView";
import SearchresultsView from "./searchResultsView";
import logo from "assets/logo.svg";
import React from "react";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import SigninPresenter from "js/components/presenters/sign/signinPresenter";
import SignupPresenter from "js/components/presenters/sign/signupPresenter";

const HeaderView = props => {
  const loginRef = React.useRef();
  const openLogin = () => loginRef.current?.open();
  const closeLogin = () => loginRef.current?.close();

  const signupRef = React.useRef();
  const openSignup = () => signupRef.current?.open();
  const closeSignup = () => signupRef.current?.close();

  return (
  <div id="header">
    <Link to="/">
      <img src={logo} id="logo"/>
    </Link>
    <div id="searchbar">
      <SearchbarView keyword={props.keyword} setKeyword={props.setKeyword} goToTopResult={props.goToTopResult}/>
      <SearchresultsView results={props.results}/>
    </div>
    {!props.isLogged &&
      <>
        <button type="button" id="login-button" onClick={openLogin}>Log In</button>
        <button type="button" id="signup-button" onClick={openSignup}>Sign Up</button>
        <Popup ref={loginRef} closeOnDocumentClick className="login">
          <a className="close" onClick={closeLogin}>&times;</a>
          <SigninPresenter close={closeLogin} openSignup={openSignup}/>
        </Popup>
        <Popup ref={signupRef} closeOnDocumentClick className="login">
          <a className="close" onClick={closeSignup}>&times;</a>
          <SignupPresenter close={closeSignup} openLogin={openLogin}/>
        </Popup>
      </>
    }
    {props.isLogged &&
      <button type="button" id="logout-button" onClick={props.logOut}>Log Out</button>
    }
  </div>)
}

export default HeaderView;