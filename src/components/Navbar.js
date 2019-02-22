import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import "./Navbar.css";

const Fragment = React.Fragment;

/*
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'
*/

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isBurgerActive: false
    };
  }

  onBurgerClick = e => {
    e.preventDefault();
    this.setState({
      isBurgerActive: !this.state.isBurgerActive
    });
  };

  onLinkClick = e => {
    this.setState({
      isBurgerActive: false
    });
  };

  render() {
    return (
      <Fragment>
        <nav className="navbar is-fixed-top" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <Link to="/" className="navbar-item">
              <FontAwesomeIcon icon={faCommentAlt} />
              &nbsp;Ez Chat
            </Link>

            <a
              role="button"
              className={"navbar-burger burger" + (this.state.isBurgerActive ? " is-active" : "")}
              aria-label="menu"
              data-target="navbarBasicExample"
              onClick={this.onBurgerClick}
              href="#"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </a>
          </div>

          <div id="navbarBasicExample" className={"navbar-menu" + (this.state.isBurgerActive ? " is-active" : "")}>
            <div className="navbar-start">
              <Link to="/about" className="navbar-item" onClick={this.onLinkClick}>
                About
              </Link>
            </div>
            <div className="navbar-end">
              {!this.props.username && (
                <Link to="/login" className="navbar-item" onClick={this.onLinkClick}>
                  <button className="button is-primary">
                    <strong>Sign up / Login</strong>
                  </button>
                </Link>
              )}
            </div>
          </div>
        </nav>
      </Fragment>
    );
  }
}

export default Navbar;
