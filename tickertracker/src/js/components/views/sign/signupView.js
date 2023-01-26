import loadingWhite from "assets/loading_white.svg";
import React from "react";

const SignupView = props => {
  const email = React.useRef();
  const [pwd, setPwd] = React.useState();
  const [pwdConf, setPwdConf] = React.useState();
  const [rememberMe, setRememberMe] = React.useState(true);

  React.useEffect(() => {
    if (pwd !== pwdConf) {
      props.setErr("Passwords must match.");
    } else {
      props.setErr();
    }
  }, [pwd, pwdConf])
  
  return (
  <div className="sign">
    <div>
      <h2>Email address</h2>
      <input id="email" type="text" placeholder={"keith.gill@tickertracker.com"} ref={email}></input>
    </div>
    <div>
      <h2>Create password</h2>
      <input placeholder={"At least 6 characters"} id="password" type="password" onInput={e => setPwd(e.target.value)}></input>
      <input placeholder={"Confirm password"} type="password" onInput={e => setPwdConf(e.target.value)}></input>
      {props.error && <span className="error">{props.error}</span>}
      {!props.error && <span>&nbsp;</span>}
    </div>
    <div className="buttonfield">
      <div><input type="checkbox" className="remember" checked={rememberMe} onChange={() => setRememberMe(prev => !prev)}/>Remember Me</div>
        <button onClick={() => {
          if (pwd === pwdConf) {
            props.signup(email.current?.value, pwd, rememberMe);
          }
        }}>
          {!props.load ? "Sign Up" : <div className="loading"><img alt="Loading..." src={loadingWhite}/></div>}
        </button>
      </div>
    <span>Already have an account? <a className="link" onClick={props.openLogin}>Log In</a></span>
  </div>)
}

export default SignupView