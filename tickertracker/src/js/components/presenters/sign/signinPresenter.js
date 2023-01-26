import SigninView from "js/components/views/sign/signinView";
import firebase from "firebase/app";
import React from "react";


const signInWithFirebase = async (email, password, rememberMe) => {
  if (email && password) {
    try {
      if (rememberMe) {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      } else {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
      }
      await firebase.auth().signInWithEmailAndPassword(email, password);
      return {success: true};
    } catch (e) {
      return {success: false, err: e};
    }
  }
}

const SigninPresenter = props => {
  const [err, setErr] = React.useState();
  const [load, setLoad] = React.useState(false);

  const signin = (email, password, rememberMe) => {
    setLoad(true);
    signInWithFirebase(email, password, rememberMe).then(res => {
      setLoad(false);
      if (res.success) {
        props.close();
      } else {
        setErr(res.err.message)
      }
    })
    .catch(res => {
      setLoad(false);
    })
  }

  return <SigninView
    signin={(email, password, rememberMe) => signin(email, password, rememberMe)}
    load={load}
    error={err}
    openSignup={() => {props.close(); props.openSignup()}}
  />
}

export default SigninPresenter;