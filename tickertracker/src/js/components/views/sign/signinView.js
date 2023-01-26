import loadingWhite from "assets/loading_white.svg";
import React from "react";

const SigninView = props => {
  const email = React.useRef();
  const password = React.useRef();
  const [rememberMe, setRememberMe] = React.useState(true)

  return (
  <div className="sign">
    <div>
      <h2>Email address</h2>
      <input id="email" type="text" ref={email}></input>
    </div>
    <div>
      <h2>Enter password</h2>
      <input placeholder={"Password"} id="password" type="password" ref={password}></input>
      {props.error && <span className="error">{props.error}</span>}
      {!props.error && <span>&nbsp;</span>}
    </div>
    <div className="buttonfield">
      <div><input type="checkbox" className="remember" checked={rememberMe} onChange={() => setRememberMe(prev => !prev)}/>Remember Me</div>
      <button onClick={() => props.signin(email.current?.value, password.current?.value, rememberMe)}>
        {!props.load ? "Log In" : <div className="loading"><img alt="Loading..." src={loadingWhite}/></div>}
      </button>
    </div>
    <span>New to Tickertracker? <a className="link" onClick={props.openSignup}>Sign Up</a></span>
  </div>
)}

export default SigninView