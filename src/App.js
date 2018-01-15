import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

import Timer from './component/Timer.js';

import './App.css';

class App extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    const { cookies } = this.props;

    this.state ={
      accessToken: cookies.get('access_token') || '',
      refreshToken: cookies.get('refresh_token') || '',
    };
  }

  /**
   * Fetch the access and refresh tokens from the OAuth proxy.
   * @param {string} code
   */
  tokens(code) {
    // @todo host and port?
    fetch('http://localhost:8080/authorize?code=' + code).then((response) => this.saveTokens(response));
  }

  saveTokens(response) {
    const app = this;
    response.json().then(function (data) {
      const { cookies } = app.props;
      cookies.set('access_token', data.access_token);
      cookies.set('refresh_token', data.refresh_token);
      app.setState({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
      window.location = 'http://localhost:3000/';
    });
  }

  render() {
    if (window.location.pathname == '/tokens') {

      let code = window.location.search.split('?code=')[1];
      this.tokens(code);
    }

    let timer;
    if (this.state.accessToken != '') {
      timer = <Timer accessToken={this.state.accessToken} refreshToken={this.state.refreshToken} />;
    }
    else {
      timer = <a href="http://localhost:8080/start">Login to Freckle</a>;
    }
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Freckle Tag Timer</h1>
        </header>
        {timer}
      </div>
    );
  }
}

export default withCookies(App);
