import React, { Component } from "react";
import { Redirect } from "react-router";
// import Chance from "chance";
import moment from "moment";

// const chance = new Chance();
const Fragment = React.Fragment;

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputUsername: {
        value: "",
        isDirty: false,
        error: ""
      },
      inputPassword: {
        value: "",
        isDirty: false,
        error: ""
      },
      loginError: {
        error: "",
        when: null
      },
      authSuccess: false
    };
  }

  componentDidMount() {
    this.props.socket.on("auth-user-result", this.onAuthUserResultServerReceive);
  }

  componentWillUnmount() {
    this.props.socket.removeListener("auth-user-result", this.onAuthUserResultServerReceive);
  }

  onAuthUserResultServerReceive = authUserResult => {
    if (authUserResult.type === "AUTH-RESULT") {
      if (authUserResult.value) {
        this.authSuccess(this.state.inputUsername.value);
      } else {
        this.setState({
          loginError: {
            error: "Invalid credentials, try a different username!",
            when: moment()
          }
        });
      }
    } else if (authUserResult.type === "USER-ADD") {
      this.authSuccess(authUserResult.value.username);
    } else {
      throw new Error(authUserResult);
    }
  };

  authSuccess = username => {
    this.props.onUsernameUpdate(username);
    this.setState({
      authSuccess: true
    });
    console.log(this.state);
  };

  onLoginFormSubmit = e => {
    e.preventDefault();
    this.props.socket.emit("auth-user", {
      username: this.state.inputUsername.value,
      password: this.state.inputPassword.value
    });
  };

  onInputUsernameChange = e => {
    const value = e.target.value;
    let error = "";
    if (value === "") {
      error = "Required";
    }
    this.setState({ inputUsername: { value, isDirty: true, error } });
  };

  onInputPasswordChange = e => {
    const value = e.target.value;
    let error = "";
    if (value === "") {
      error = "Required";
    }

    if (value && value.length < 6) {
      error = "Minimum 6 characters";
    }

    this.setState({ inputPassword: { value, isDirty: true, error } });
  };

  render() {
    if (this.state.authSuccess) {
      return <Redirect to="/" />;
    }

    return (
      <Fragment>
        <section className="section">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-8">
                <h3 className="title is-3">Sign up / Login</h3>

                <div className="mt-content-section">
                  <form onSubmit={this.onLoginFormSubmit}>
                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Username</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control is-expanded">
                            <input
                              className="input"
                              type="input"
                              value={this.state.inputUsername.value}
                              onChange={this.onInputUsernameChange}
                            />
                          </p>
                          {this.state.inputUsername.error && (
                            <p className="help is-danger">{this.state.inputUsername.error}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label is-normal">
                        <label className="label">Password</label>
                      </div>
                      <div className="field-body">
                        <div className="field">
                          <p className="control is-expanded">
                            <input
                              className="input"
                              type="password"
                              value={this.state.inputPassword.value}
                              onChange={this.onInputPasswordChange}
                            />
                          </p>
                          {this.state.inputPassword.error && (
                            <p className="help is-danger">{this.state.inputPassword.error}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label" />
                      <div className="field-body">
                        <div className="field">
                          <p className="control">
                            <button
                              className="button is-primary"
                              type="submit"
                              disabled={
                                this.state.inputUsername.error ||
                                this.state.inputPassword.error ||
                                !this.state.inputUsername.value ||
                                !this.state.inputPassword.value
                              }
                            >
                              Sign up / Login
                            </button>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="field is-horizontal">
                      <div className="field-label" />
                      <div className="field-body">
                        <div className="field">
                          {this.state.loginError.error && (
                            <p className="help is-danger">
                              {moment(this.state.loginError.when).format("YYYY-MM-DD HH:mm:ss")}
                              {" // "}
                              {this.state.loginError.error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

export default Login;
