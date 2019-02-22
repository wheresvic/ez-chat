import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";

import ChatRoom from "./components/chat-room/ChatRoom";
import Navbar from "./components/Navbar";
import About from "./components/About";
import Login from "./components/Login";

const Fragment = React.Fragment;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: props.username
    };
  }

  onUsernameUpdate = username => {
    console.log("new username " + username);
    this.setState({ username });
  };

  render() {
    return (
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/about" component={About} />
          <PropsRoute
            exact
            path="/login"
            component={Login}
            socket={this.props.socket}
            onUsernameUpdate={this.onUsernameUpdate}
          />
          <PropsRoute exact path="/" component={ChatRoom} socket={this.props.socket} username={this.state.username} />
        </Fragment>
      </Router>
    );
  }
}

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest);
      }}
    />
  );
};

/*
const PrivateRoute = ({ component, redirectTo, ...rest }) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return auth.loggedIn() ? (
          renderMergedProps(component, routeProps, rest)
        ) : (
          <Redirect
            to={{
              pathname: redirectTo,
              state: { from: routeProps.location }
            }}
          />
        );
      }}
    />
  );
};
*/

export default App;
