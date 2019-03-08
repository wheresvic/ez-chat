import 'react-app-polyfill/ie9';
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "./index.css";
import "./styles/css/ez-chat.css";

import openSocket from "socket.io-client";

const socketUrl = process.env.REACT_APP_SOCKET_URL || "http://localhost:9876";
const socket = openSocket(socketUrl);

const initialUsername = "Anonymous";

if (window.Notification && Notification.permission !== "denied") {
  Notification.requestPermission(function(status) {
    console.log("Notification status", status);
  });
}

ReactDOM.render(<App socket={socket} username={initialUsername} />, document.getElementById("root"));
