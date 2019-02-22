import React, { Component } from "react";

const Fragment = React.Fragment;

class About extends Component {
  componentDidMount() {}

  render() {
    return (
      <Fragment>
        <section className="section">
          <div className="container content">
            <div className="columns is-centered">
              <div className="column is-8">
                <div className="content-section">
                  <h3 className="title is-3">About</h3>

                  <p>EzChat is a standalone web-socket based chat application. As of version 1.0.0, it features:</p>
                  <ul>
                    <li>file-based persistence</li>
                    <li>a single chat-room</li>
                    <li>username storage</li>
                  </ul>
                </div>
                <div className="content-section">
                  <h4 className="title is-4">License</h4>

                  <p>
                    The EzChat code is MIT licensed and is proudly built open-source software and their respective
                    licenses apply where provided.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}

export default About;
