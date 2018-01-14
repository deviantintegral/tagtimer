import React, { Component } from 'react';

import Timer from './component/Timer.js';

import './App.css';

class App extends Component {

  /**
   * Fetch the access and refresh tokens from the OAuth proxy.
   * @param {string} code
   */
  tokens(code) {
    // @todo host and port?
    fetch('http://localhost:8080/authorize?code=' + code).then((response) => this.saveTokens(response));
  }

  saveTokens(response) {
    response.json().then(function (data) {
      window.localStorage.setItem('access_token', data.access_token);
      window.localStorage.setItem('refresh_token', data.refresh_token);
      window.location = 'http://localhost:3000/';
    });
  }

  render() {
    if (window.location.pathname == '/tokens') {

      let code = window.location.search.split('?code=')[1];
      this.tokens(code);
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Freckle Tag Timer</h1>
          <a href="http://localhost:8080/start">Login to Freckle</a>
        </header>
        <Timer />
      </div>
    );
  }
}

export default App;
