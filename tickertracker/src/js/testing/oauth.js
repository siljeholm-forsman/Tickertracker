/* eslint-disable */
import React from "react";
import {useHistory} from "react-router";

let implicit = true;
let client_secret = "";

let redirect = "http://localhost:3000/reddit_oauth";
// THESE IDs ARE OK TO EXPOSE TO CLIENT
//let clientid = implicit ? "9ooRThivSSG0hw" : "Uam_5iSclLDUTQ";
let clientid = "9ooRThivSSG0hw";
//let clientid = "2zc2xtwxo4qRzA";
const login = () => {
  let state = "randomstring";
  let scope = "read identity";

  //let authorizationUrl = implicit ? `https://www.reddit.com/api/v1/authorize?client_id=${clientid}&response_type=code&state=${state}&redirect_uri=${redirect}&duration=permanent&scope=${scope}` : `https://www.reddit.com/api/v1/authorize?client_id=${clientid}&response_type=code&state=${state}&redirect_uri=${redirect}&duration=permanent&scope=${scope}`;
  let authorizationUrl = `https://www.reddit.com/api/v1/authorize?client_id=${clientid}&response_type=code&state=${state}&redirect_uri=${redirect}&duration=permanent&scope=${scope}`;

  window.open(authorizationUrl, "_self");
}

const Oauth = props => {
  let history = useHistory();
  React.useEffect(() => {
    //if (implicit) {
      const url = new URL(window.location.href);
      let code = url.searchParams.get("code");
      let state = url.searchParams.get("state");
      let error = url.searchParams.get("error");

      if (!error) {
        fetch("https://www.reddit.com/api/v1/access_token", {
          method: "post",
          headers: {
            "Authorization": "Basic " + btoa(unescape(encodeURIComponent(clientid + ":" + ""))),
            "Content-type": "application/x-www-form-urlencoded"
          },
          body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`
        })
        .then(res => res.json())
        .then(json => {
          fetch("https://oauth.reddit.com/api/v1/me", {
              headers: {
                "Authorization": "bearer " + json["access_token"],
              }
          })
          .then(res => res.json())
          .then(json => console.log(json))
          console.log(json);
        })
        history.push("/");
      }
    //} else {
    //  console.log(window.location.href);
    //  const url = new URL(redirect + "?" + window.location.hash.split("#")[1]);
    //  console.log(url);
    //  const token = url.searchParams.get("access_token");
    //  //console.log(token);
    //  //let sendurl = new URL("https://www.reddit.com/api/v1/me")
    //  fetch("https://oauth.reddit.com/api/v1/me", {
    //    headers: {
    //      "Authorization": "bearer " + token,
    //    }
    //  })
    //  .then(res => res.json())
    //  .then(json => console.log(json))
    //  .catch(e => console.log(token));
    //  history.push("/");
    //}
  },[]);

  return (
  <>
  </>)
}

export {Oauth, login}