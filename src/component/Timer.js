import React, { Component } from 'react';
import parseLinkHeader from 'parse-link-header';
import TagRow from './TagRow.js';

class Timer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      clocks: [false],
    };
    this.projects();
    this.handleAddAnother = this.handleAddAnother.bind(this);
    this.onClockStart = this.onClockStart.bind(this);
  }

  projects(next = '') {
    if (!next) {
      this.setState(() => ({
        projects: [],
      }));

      next = 'https://api.letsfreckle.com/v2/projects/?enabled=true&per_page=100';
    }
    const timer = this;
    fetch('http://localhost:8081/' + next, {
      headers:  new Headers(({'Authorization': 'Bearer ' + window.localStorage.access_token})),
    }).then(function (response) {
      if (response.headers.has('Link')) {
        const link = parseLinkHeader(response.headers.get('Link'));
        if (link.next) {
          timer.projects(link.next.url);
        }
      }
      return response.json();
    })
   .then(function (data) {
     timer.setState((prevState) => ({
       projects: prevState.projects.concat(data),
     }));
    });
  }

  render() {
    let projects;
    if (this.state.projects.length) {
      const options = this.state.projects.map((project) =>
        <option value={project.id}>{project.name}</option>
      );
      projects = (
        <select>
          {options}
        </select>
      );
    }

    let rows = [];
    for (let i = 0; i <= this.state.clocks.length - 1; i++) {
      let last = (i === this.state.clocks.length - 1);
      rows[i] = <TagRow row={i} running={this.state.clocks[i]} onTagInit={this.handleAddAnother} onClockStart={this.onClockStart} last={last}/>;
    }
    return (
      <div>
        {projects}
        <div >
          {rows}
          <input type="button" value="Log all timers" />
        </div>
      </div>
    );
  }

  handleAddAnother(event) {
    this.setState((prevState, props) => ({
      clocks: prevState.clocks.concat(false),
    }));
  }

  onClockStart(event, row) {
    this.setState((prevState, props) => {
      const clocks = prevState.clocks;
      clocks.forEach((v, i) => {
        clocks[i] = false;
      });
      clocks[row] = true;
      return {
        clocks: clocks,
      };
    });
  }
}

export default Timer;