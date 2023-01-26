import React from "react"
import {useLocation, useHistory} from "react-router";
import firebase from "firebase/app"
import {Link} from "react-router-dom";
import Popup from "reactjs-popup";
import MobileNavbarView from "js/components/views/mobileNavbarView";
import { useSelector } from "react-redux";

const logOut = () => firebase.auth().signOut();

const MobileNavbar = props => {
  const [initialRender, setInitialRender] = React.useState(false);
  const [sidebar, setSidebar] = React.useState(false);
  const location = useLocation()
  const isLogged = useSelector(state => state.isLogged)

  React.useEffect(() => (
    document.getElementById("sidebarContainer").setAttribute("expanded", sidebar.toString())
  ), [sidebar]);

  React.useEffect(() => (
    initialRender ? setSidebar(false) : setInitialRender(true)
  ), [location]);

  return <MobileNavbarView logOut={logOut} isLogged={isLogged} toggleTrending={() => setSidebar(prev => !prev)}/>

}

export default MobileNavbar