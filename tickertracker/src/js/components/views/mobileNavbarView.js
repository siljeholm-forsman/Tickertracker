import trendingIcon from "assets/fire.svg";
import homeIcon from "assets/home.svg";
import loginIcon from "assets/login.svg";
import logoutIcon from "assets/logout.svg";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";
import SigninPresenter from "../presenters/sign/signinPresenter";
import SignupPresenter from "../presenters/sign/signupPresenter";
import React from "react";

const MobileNavbarView = props => {
  const loginRef = React.useRef();
  const openLogin = () => loginRef.current?.open()
  const closeLogin = () => loginRef.current?.close()

  const signupRef = React.useRef();
  const openSignup = () => signupRef.current?.open();
  const closeSignup = () => signupRef.current?.close();

  return (
    <div id="mobileNav">
      <button id="toggleTrending" style={{cursor: "pointer"}} onClick={props.toggleTrending}><img src={trendingIcon}></img></button>
      <Link id="home" to="/"><img src={homeIcon}></img></Link>
      <button id="login" 
        onClick={() => {
          if (props.isLogged) {
            props.logOut();
          } else {
            openLogin();
          }
        }}
        style={{cursor: "pointer"}}>
          <img src={props.isLogged ? logoutIcon : loginIcon}></img>
      </button>

      <Popup ref={loginRef} className="login" closeOnDocumentClick>
        <a className="close" onClick={closeLogin}>&times;</a>
        <SigninPresenter close={closeLogin} openSignup={openSignup}/>
      </Popup>
      <Popup ref={signupRef} className="login" closeOnDocumentClick>
        <a className="close" onClick={props.closeSignup}>&times;</a>
        <SignupPresenter close={closeSignup} openLogin={openLogin}/>
      </Popup>
    </div>)
}
export default MobileNavbarView;