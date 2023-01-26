import SignupView from "js/components/views/sign/signupView";
import firebase from "firebase/app"
import React from "react";

const signUpWithFirebase = async (email, password, rememberMe) => {
  if (email && password) {
    try {
      if (rememberMe) {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      } else {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
      }
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      return {success: true};
    } catch (e) {
      return {success: false, err: e};
    }
  }
}

const SignupPresenter = props => {
  const [err, setErr] = React.useState();
  const [load, setLoad] = React.useState(false);

  const signup = (email, password, rememberMe) => {
    setLoad(true);
    signUpWithFirebase(email, password, rememberMe).then(res => {
      setLoad(false);
      if (res.success) {
        props.close();
      } else {
        setErr(res.err.message);
      }
    })
    .catch(res => {
      setLoad(false);
    })
  }

  return <SignupView
    signup={(email, password, rememberMe) => signup(email, password, rememberMe)}
    load={load}
    error={err}
    setErr={setErr}
    openLogin={() => {props.close(); props.openLogin()}}
  />
}

export default SignupPresenter